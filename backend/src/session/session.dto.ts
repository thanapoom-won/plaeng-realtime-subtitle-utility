export interface Participant{
    socketId: string,
    language: string
}
export interface SubRoom{
    language: string,
    participantsWSId: string[]
}
export interface Session {
    hostSocketId : string,
    subRoom : SubRoom[]
}