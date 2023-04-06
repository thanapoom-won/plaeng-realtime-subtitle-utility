import { colorTheme, speechToTextParameter } from "@/uitls/constants"
import { defaultTranslateLanguage, languageSpeechTags, languageTranslateTag } from "@/uitls/language";
import { RESTConstant } from "@/uitls/restUtil";
import { SocketConstant } from "@/uitls/socketUtil";
import { Stack, Heading, Select, Button, Box, Text } from "@chakra-ui/react"
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io(SocketConstant.baseUrl || 'ws://localhost:8080',{
    transports: ['websocket'],
    path: "/socket.io/",
    autoConnect: false,
});

export function Participant(){
    const [language, setLanaguage] = useState(languageSpeechTags[0].tag);
    const [sessionId, setSessionId] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | undefined>('');
    const [subtitle,setSubtitle] = useState('');
    const router = useRouter();

    useEffect(()=>{
        if(!router.isReady) return
        const query = new URLSearchParams(window.location.search);
        const session = query.get('sessionId');
        socket.on('connect', ()=>{
            socket.emit('joinSession',{
                language: defaultTranslateLanguage,
                sessionId : session
            },(res: any)=>{
                if(res == true && session !== null){
                    setErrorMessage('');
                    setSessionId(session);
                }
            });
        })
        socket.on('exception',(e)=>{
            setErrorMessage(e.status + " : " +e.message)
        })
        socket.on('subtitle',(e)=>{
            setSubtitle(e)
        })
        socket.on('sessionEnd',(e)=>{
            setErrorMessage("This session has ended")
        })
        socket.connect();
        
    },[router.isReady])
    
    const timerId = useRef<any>(null);
    useEffect(()=>{
        let resetTime = speechToTextParameter.speechGapMultiplier * subtitle.length;
        if(resetTime < 1000){
            resetTime = 1000
        }
        if(timerId.current !== null){
            clearTimeout(timerId.current);
        }
        timerId.current = setTimeout(()=>{
            setSubtitle('');
        },resetTime)
    },[subtitle])

    
    return(
        <Stack alignItems={'center'} spacing={8}>
            <Heading size='xl' color={colorTheme.primary}>{errorMessage!='' ? errorMessage : "Session #" + sessionId}</Heading>
            <Box w={'30vw'}>
                <Text>Subtitle language</Text>
            <Select onChange={e=>{
                setLanaguage(e.target.value)
                socket.emit('changeLanguage',{
                    language: e.target.value,
                    sessionId : sessionId
                });

            }} defaultValue={languageSpeechTags[0].tag} bgColor='white'>
                {
                    languageTranslateTag.map(e=>{
                        return (<option value={e.tag} key={e.tag}>
                            {e.name}
                        </option>)
                    })
                }
            </Select>
            </Box>
            <Box h={'30vh'} w={'70vw'}>
                <Heading size={'lg'} color={colorTheme.primary} textAlign='center'>
                    {subtitle}
                </Heading>
            </Box>
            </Stack>
    )
}