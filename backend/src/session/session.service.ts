import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Participant, Session } from './session.dto';

@Injectable()
export class SessionService {

    private sessions : Map<string,Session> = new Map<string,Session>(); // sessionId to Session Object

    async newSession(hostSocketId : string){
        const sessionIdLength = 5;
        const newSessionId = await this.generateSessionId(sessionIdLength);
        await this.sessions.set(newSessionId,{
            hostSocketId : hostSocketId,
            subRoom: []
        });
        return newSessionId;
    }

    async checkSession(sessionId: string){
        if(!this.sessions.has(sessionId)){
            throw new HttpException("Session not found", HttpStatus.NOT_FOUND)
        }
        return this.sessions.get(sessionId)
    }

    async joinSession(sessionId : string, user: Participant){
        if(!this.sessions.has(sessionId)){
            throw new HttpException("Session not found", HttpStatus.NOT_FOUND)
        }else{
            const subRoomIdx = this.sessions.get(sessionId).subRoom.findIndex((sr)=>{
                return sr.language === user.language;
            })
            if(subRoomIdx === -1){
                this.sessions.get(sessionId).subRoom.push({
                    language: user.language,
                    participantsWSId: [user.socketId]
                })
            }else{
                this.sessions.get(sessionId).subRoom[subRoomIdx].participantsWSId.push(user.socketId);
            }
        }
    }

    async changeLanguage(sessionId: string, user: Participant){
        if(!this.sessions.has(sessionId)){
            throw new HttpException("Session not found", HttpStatus.NOT_FOUND)
        }
        for(let i = 0; i < this.sessions.get(sessionId).subRoom.length; i++){
            const userIdx = this.sessions.get(sessionId).subRoom[i].participantsWSId.findIndex((id)=>{
                return id === user.socketId;
            })
            if(userIdx !== -1){
                this.sessions.get(sessionId).subRoom[i].participantsWSId.splice(userIdx,1);
                const destSubRoom = this.sessions.get(sessionId).subRoom.findIndex((sr)=>{
                    return sr.language === user.language
                })
                if(destSubRoom !== -1){
                    this.sessions.get(sessionId).subRoom[destSubRoom].participantsWSId.push(user.socketId);
                }else{
                    this.sessions.get(sessionId).subRoom.push({
                        language: user.language,
                        participantsWSId: [user.socketId]
                    })
                }
                return;
            }
        }
        throw new HttpException('User is not in the session', HttpStatus.NOT_FOUND);
    }

    async removeUserFromSession(socketId: string, sessionId : string){
        if(!this.sessions.has(sessionId)){
            throw new HttpException("Session not found", HttpStatus.NOT_FOUND)
        }
        for(let i = 0; i < this.sessions.get(sessionId).subRoom.length; i++){
            const userIdx = this.sessions.get(sessionId).subRoom[i].participantsWSId.findIndex(wsId=>{
                wsId === socketId;
            })
            if(userIdx !== -1){
                this.sessions.get(sessionId).subRoom[i].participantsWSId.splice(userIdx,1);
                return;
            }
        }
        throw new HttpException('User is not in the session', HttpStatus.NOT_FOUND);
    }

    async endSession(sessionId : string){
        if(!this.sessions.has(sessionId)){
            throw new HttpException("Session not found", HttpStatus.NOT_FOUND)
        }
        this.sessions.delete(sessionId);
    }

    generateSessionId(sessionIdLength : number){
        const number = "0123456789";
        let sessionId = "";
        let attemp = 0;
        while(true){
            attemp += 1;
            for (let i =0;i <sessionIdLength; i++){
                sessionId += number.charAt(Math.floor(Math.random() * number.length))
            }
            Logger.log("generating session id, attemp: " + attemp, 'Session Service');
            if(!this.sessions.has(sessionId)){
                break;
            } 
        }
        return sessionId;
    }
}
