import { colorTheme, speechToTextParameter } from "@/uitls/constants";
import { languageSpeechTags, speechToTranslate } from "@/uitls/language";
import { SocketConstant } from "@/uitls/socketUtil";
import { Stack, Heading, Button, Box, Select } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { io } from "socket.io-client";

const socket = io(SocketConstant.baseUrl,{
    transports: ['websocket'],
    autoConnect: false
});


export function Transcriber(){
    const {
        transcript,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    // if(!browserSupportsSpeechRecognition){
    //     return(
    //         <Stack alignItems={'center'} spacing={8}>
    //         <Heading size='xl' color={colorTheme.primary}>This browser doesn&apos;t support speech recognition</Heading>
    //         </Stack>
    //     )
    // }
    const [resultCount, setResultCount] = useState(0);
    const [language, setLanaguage] = useState('');
    const [listening, setListenning] = useState(false);
    const [sessionId, setSessionId] = useState('');
    const timerId = useRef<any>(null);

    useEffect(()=>{
        setResultCount(resultCount+1);
        if(resultCount > speechToTextParameter.resultThreshold){
            resetTranscript();
            setResultCount(0);
        }
        if(timerId.current !== null){
            clearTimeout(timerId.current);
        }
        timerId.current = setTimeout(()=>{
            resetTranscript();
            setResultCount(0);
        },speechToTextParameter.speechGapTimeout)
        socket.emit("hostSpeech",{
            speech : transcript,
            language: speechToTranslate.get(language)
        })
    },[transcript])

    useEffect(()=>{
        if(sessionId == ''){
            socket.on('connect', ()=>{
                socket.emit('hostSession',(res: any)=>{
                    console.log(res)
                    setSessionId(res)
                });
            })
            socket.connect();
        }
    },[])

    function toggleListening(){
        if(listening){
            SpeechRecognition.getRecognition()!.onend = ()=>{
            }
            SpeechRecognition.getRecognition()?.abort();
            setListenning(false);
        }else{
            SpeechRecognition.getRecognition()!.lang = language;
            SpeechRecognition.getRecognition()?.start();
            setListenning(true);
            SpeechRecognition.getRecognition()!.onend = ()=>{
                SpeechRecognition.getRecognition()!.lang = language;
                SpeechRecognition.getRecognition()?.start();
            }
        }
    }
    return(
        <Stack alignItems={'center'} spacing={8}>
            <Heading size='xl' color={colorTheme.primary}>Session #{sessionId}</Heading>
            <Box w={'30vw'}>
            <Select placeholder="Select speech language" onChange={e=>{
                setLanaguage(e.target.value)
            }} bgColor='white'>
                {
                    languageSpeechTags.map(e=>{
                        return (<option value={e.tag} key={e.tag}>
                            {e.name}
                        </option>)
                    })
                }
            </Select>
            </Box>
            {
                <Button bgColor={colorTheme.primary} color = {"white"} onClick={toggleListening}>
                    {listening ? 'Stop listening' : 'Start listening'}
                </Button>
            }
            <Box h={'30vh'} w={'70vw'}>
                <Heading size={'lg'} color={colorTheme.primary} textAlign='center'>
                    {transcript}
                </Heading>
            </Box>
            </Stack>
    )
}