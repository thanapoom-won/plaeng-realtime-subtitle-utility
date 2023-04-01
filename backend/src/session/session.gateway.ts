import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { OnGatewayDisconnect } from '@nestjs/websockets/interfaces';
import axios from 'axios';
import * as translate from 'translate-google';
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
          if(dto.language == sr.language || dto.speech.trim() == ""){
            this.server.to(wsId).emit("subtitle",dto.speech);
          }
          else{
            if(dto.speech !== null && dto.speech.trim() !== ''){
              translate(dto.speech, {from : dto.language, to : sr.language}).then(res=>{
                this.server.to(wsId).emit("subtitle",res)
              }).catch(err=>{
                Logger.error(err,"Translator API error")
              })
            }
            
          }
        })
      })
    }else{
      throw new WsException({message : "Host not found", status : 404})
    }
  }
}
