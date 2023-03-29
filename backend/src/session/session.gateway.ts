import { ConfigService } from '@nestjs/config/dist';
import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { OnGatewayDisconnect } from '@nestjs/websockets/interfaces';
import axios from 'axios';
import { Server, Socket } from 'socket.io';
import { ChangeLanguageDto, HostSpeechDto, JoinSessionDto } from './session.dto';
import { SessionService } from './session.service';

@WebSocketGateway({
  cors:{
    origin: '*',
  },
  transport:['websocket'],
})
export class SessionGateway implements OnGatewayDisconnect{

  @WebSocketServer()
  server : Server;
  
  constructor(private readonly sessionService: SessionService,
    private readonly configService: ConfigService) {
    
  }
  handleDisconnect(client: Socket) {
    if(this.sessionService.isHost(client.id)){
      const session = this.sessionService.getSessionFromHostWsId(client.id);
      session.subRoom.forEach(sr=>{
        sr.participantsWSId.forEach(wsId=>{
          this.server.to(wsId).emit("sessionEnd");
          this.sessionService.removeParticipant(wsId)
        })
      })
      return this.sessionService.hostEndSession(client.id);
    }
    else if(this.sessionService.isParticipant(client.id)){
      return this.sessionService.removeUserFromSession(client.id);
    }
  }

  @SubscribeMessage('hostSession')
  async createSession(
    @ConnectedSocket() host: Socket
  ){
    return await this.sessionService.newSession(host.id)
  }

  @SubscribeMessage('joinSession')
  async joinSession(
    @MessageBody() dto : JoinSessionDto,
    @ConnectedSocket() client: Socket
  ){
    const joinSessionResult = await this.sessionService.joinSession(dto.sessionId,{
      language: dto.language,
      socketId: client.id
    });
    return joinSessionResult;
  }

  @SubscribeMessage('changeLanguage')
  async changeLanguage(
    @MessageBody() dto : ChangeLanguageDto,
    @ConnectedSocket() client: Socket
  ){
    return await this.sessionService.changeLanguage(dto.sessionId,{
      socketId: client.id,
      language: dto.language
    })
  }

  @SubscribeMessage('hostSpeech')
  async handleHostSpeech(
    @MessageBody() dto : HostSpeechDto,
    @ConnectedSocket() host: Socket
  ){
    if(this.sessionService.isHost(host.id)){
      const session = this.sessionService.getSessionFromHostWsId(host.id);
      session.subRoom.forEach(sr=>{
        sr.participantsWSId.forEach(wsId=>{
          if(dto.language == sr.language){
            this.server.to(wsId).emit("subtitle",dto.speech);
          }
          else{
            const apiKey = this.configService.get<string>('API_KEY');
            axios.post("https://api.nlpcloud.io/v1/nllb-200-3-3b/translation",{
              text : dto.speech,
              source : dto.language,
              target : sr.language
            },{withCredentials: true, headers: {"Authorization" : `Bearer ${apiKey}`}}).then(res=>{
              this.server.to(wsId).emit("subtitle",res.data.translation_text);
            })
          }
          this.server.to(wsId).emit("subtitle",dto.speech);
          this.sessionService.removeParticipant(wsId)
        })
      })
    }else{
      throw new WsException({message : "Host not found", status : 404})
    }
  }
}
