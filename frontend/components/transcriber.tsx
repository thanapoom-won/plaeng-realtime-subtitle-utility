import { colorTheme, speechToTextParameter } from "@/uitls/constants";
import { languageSpeechTags } from "@/uitls/language";
import { Stack, Heading, Button, Box, Select } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

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
    },[transcript])

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
            <Heading size='xl' color={colorTheme.primary}>Session #12345978</Heading>
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