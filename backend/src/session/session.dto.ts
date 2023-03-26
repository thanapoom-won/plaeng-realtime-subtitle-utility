export interface Participant{
    socketId: string,
    language: string
}

export interface Session {
    id : string,
    hostSocketId : string,
    participants : Participant[]
}