import {WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
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
}
