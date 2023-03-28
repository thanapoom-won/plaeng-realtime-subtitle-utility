import { colorTheme } from "@/uitls/constants"
import { RESTConstant } from "@/uitls/restUtil";
import { SocketConstant } from "@/uitls/socketUtil";
import { Stack, Heading, Select, Button, Box } from "@chakra-ui/react"
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(SocketConstant.baseUrl,{
    transports: ['websocket']
});

export function Participant(){
    const [language, setLanaguage] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | undefined>('');
    const router = useRouter();

    useEffect(()=>{
        async function checkSession(id : string){
            console.log("called");
            try{
                const result = await axios.get(RESTConstant.baseUrl + 'session/check/' + id);
            }
            catch(e){
                if(e instanceof AxiosError){
                    setErrorMessage(e.response?.status + ' ' + e.response?.statusText);
                }
            }
        }
        if(!router.isReady) return
        const query = new URLSearchParams(window.location.search);
        const session = query.get('sessionId');
        if(session === null){
            setErrorMessage('404 Not Found');
        }else{
            checkSession(session);
            socket.on('connect',()=>{
                socket.emit('joinSession',{
                    language: 'EN',
                    sessionId: session
                })
                console.log('connect')
            })
            setSessionId(session);
        }
        
    },[router.isReady])

    
    return(
        <Stack alignItems={'center'} spacing={8}>
            <Heading size='xl' color={colorTheme.primary}>{errorMessage!='' ? errorMessage : "Session #" + sessionId}</Heading>
            <Box w={'30vw'}>
            {/* <Select placeholder="Select language" onChange={e=>{
                setLanaguage(e.target.value)
            }} bgColor='white'>
                {
                    languageSpeechTags.map(e=>{
                        return (<option value={e.tag} key={e.tag}>
                            {e.name}
                        </option>)
                    })
                }
            </Select> */}
            </Box>
            <Box h={'30vh'} w={'70vw'}>
                <Heading size={'lg'} color={colorTheme.primary} textAlign='center'>
                    Subtitle here
                </Heading>
            </Box>
            </Stack>
    )
}