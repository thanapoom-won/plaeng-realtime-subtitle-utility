import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateSessionDto, JoinSessionDto } from './session.dto';
import { SessionService } from './session.service';

@WebSocketGateway({
  cors:{
    origin: '*',
  },
  transport:['websocket'],
})
export class SessionGateway {

  @WebSocketServer()
  server : Server;
  
  constructor(private readonly sessionService: SessionService) {
    
  }

  @SubscribeMessage('hostSession')
  async createSession(
    @MessageBody() dto : CreateSessionDto,
    @ConnectedSocket() host: Socket
  ){
    return this.sessionService.newSession(host.id,dto.hostLanguage);
  }

  @SubscribeMessage('joinSession')
  async joinSession(
    @MessageBody() dto : JoinSessionDto,
    @ConnectedSocket() client: Socket
  ){
    return this.sessionService.joinSession(dto.sessionId,{
      language: dto.language,
      socketId: client.id
    })
  }
}
