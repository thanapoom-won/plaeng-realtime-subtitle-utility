import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Participant, Session } from './session.dto';

@Injectable()
export class SessionService {

    private sessions : Session[] = [];

    async newSession(hostSocketId : string){
        const sessionIdLength = 5;
        const newSessionId = await this.generateSessionId(sessionIdLength);
        await this.sessions.push({
            id : newSessionId,
            hostSocketId : hostSocketId,
            participants: []
        });
        return newSessionId;
    }

    async joinSession(sessionId : string, user: Participant){
        const session = this.sessions.find((session)=>{
            return session.id == sessionId;
        })
        if(session === undefined){
            throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
        }else{
            session.participants.push(user);
        }
    }

    async changeLanguage(sessionId: string, user: Participant){
        const session = this.sessions.find((session)=>{
            return session.id == sessionId;
        })
        if(session === undefined){
            throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
        }
        const userToChange = session.participants.find((u)=>{
            return u.socketId == user.socketId;
        })
        if(userToChange === undefined){
            throw new HttpException('User is not in the session', HttpStatus.NOT_FOUND);
        }
        userToChange.language = user.language;
    }

    async removeUserFromSession(socketId: string, sessionId : string){
        const sessionIdx = this.sessions.findIndex((session)=>{
            return session.id == sessionId;
        })
        if(sessionIdx !== -1){
            this.sessions[sessionIdx].participants = this.sessions[sessionIdx].participants.filter((user)=>{
                return user.socketId !== socketId;
            });
        }
    }

    async endSession(sessionId : string){
        this.sessions = this.sessions.filter((session)=>{
            return session.id !== sessionId;
        })
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
            if(this.sessions.findIndex((session)=>{
                return session.id == sessionId
            }) === -1){
                break;
            } 
        }
        return sessionId;
    }
}
