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
    hostLanguage: string,
    subRoom : SubRoom[]
}
export interface JoinSessionDto{
    language: string,
    sessionId : string
}
export interface CreateSessionDto{
    hostLanguage: string
}

export interface ChangeLanguageDto{
    sessionId: string,
    language: string
}

export interface HostSpeechDto{
    speech: string,
    language: string
}