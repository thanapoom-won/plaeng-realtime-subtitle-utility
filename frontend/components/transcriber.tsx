import { colorTheme } from "@/uitls/constants";
import { Stack, Heading, Button, Box } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export function Transcriber(){
    const {
        transcript,
        resetTranscript,
        listening,
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
    const timerId = useRef<any>(null);
    const resultThreshold = 30;
    useEffect(()=>{
        setResultCount(resultCount+1);
        if(resultCount > resultThreshold){
            resetTranscript();
            setResultCount(0);
        }
        if(timerId.current !== null){
            clearTimeout(timerId.current);
        }
        timerId.current = setTimeout(()=>{
            resetTranscript();
            setResultCount(0);
        },2000)
    },[transcript])
    function toggleListening(){
        if(listening){
            SpeechRecognition.stopListening();
        }else{
            SpeechRecognition.startListening({language: 'th-TH', continuous:true});
        }
    }
    return(
        <Stack alignItems={'center'} spacing={8}>
            <Heading size='xl' color={colorTheme.primary}>Session #12345978</Heading>
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