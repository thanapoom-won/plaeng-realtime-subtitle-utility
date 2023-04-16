/* eslint-disable react-hooks/rules-of-hooks */
import { colorTheme, speechToTextParameter } from "@/uitls/constants";
import { languageSpeechTags, languageTranslateTag, speechToTranslate } from "@/uitls/language";
import { SocketConstant } from "@/uitls/socketUtil";
import { Stack, Heading, Button, Box, Select, Text, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { io } from "socket.io-client";

const socket = io(SocketConstant.baseUrl || 'ws://localhost:8080',{
    transports: ['websocket'],
    path: "/socket.io/",
    rejectUnauthorized: false,
    autoConnect: false,
    secure: true
});

interface subtitleDto{
    speech : string,
    isBreak : boolean
}


export function Transcriber(){
    const {
        browserSupportsSpeechRecognition,
        isMicrophoneAvailable,
        transcript,
        resetTranscript
    } = useSpeechRecognition();
    const [modalText, setModalText] = useState('');
    const [language, setLanaguage] = useState(languageSpeechTags[0].tag);
    const [subtitleLanguage, setSubtitleLanguage] = useState(languageTranslateTag[0].tag)
    const [listening, setListenning] = useState(false);
    const [sessionId, setSessionId] = useState('');
    const [lastEmission, setLastEmission] = useState('');
    const [sequence,setSequence] = useState(0);
    const [buffer, setBuffer] = useState<Map<number,subtitleDto>>(new Map<number,subtitleDto>());
    const [expectedSeq, setExpectedSeq] = useState(-1);
    const [currentSubtitle, setCurrentSubtitle] = useState('');
    const [subtitleHistory, setSubtitleHistory] = useState<string[]>([]);

    const { isOpen, onOpen, onClose } = useDisclosure()

    const lastEmissionRef = useRef<any>();
    const languageRef = useRef<any>();
    const transcriptContainer = useRef<any>();
    const transcriptRef = useRef<any>();
    const subtitleHistoryRef = useRef<any>();
    const currentSubtitleRef = useRef<any>();
    const expectedSeqRef = useRef<any>();
    const bufferRef = useRef<any>();
    const sequenceRef= useRef<any>();

    languageRef.current = language;
    lastEmissionRef.current = lastEmission;
    transcriptRef.current = transcript;
    subtitleHistoryRef.current = subtitleHistory;
    currentSubtitleRef.current = currentSubtitle;
    expectedSeqRef.current = expectedSeq;
    bufferRef.current = buffer;
    sequenceRef.current = sequence;

    useEffect(()=>{
        if(sessionId == ''){
            socket.on('connect', ()=>{
                socket.emit('hostSession',languageTranslateTag[0].tag,(res: any)=>{
                    setSessionId(res)
                });
            })
            socket.on("subtitle", (e)=>{
                transcriptContainer.current?.scrollIntoView({ behavior: "smooth" })
                if(expectedSeq == -1){
                    setExpectedSeq(e.seq + 1);
                    if(e.isBreak){
                        setSubtitleHistory(old=> [...old,currentSubtitleRef.current])
                        setCurrentSubtitle('');
                    }
                    else{
                        setCurrentSubtitle(e.speech);
                    }
                }
                else{
                    if(expectedSeqRef.current == e.seq){
                        let counter = expectedSeqRef.current;
                        if(e.isBreak){
                            setSubtitleHistory(old=> [...old,currentSubtitleRef.current])
                            setCurrentSubtitle('');
                        }
                        else{
                            setCurrentSubtitle(e.speech);
                        }
                        counter = counter+1;
                        if(bufferRef.current.size > 0){
                            let deleted :number[] = [];
                            while(bufferRef.current.has(counter)){
                                const b = bufferRef.current.get(counter);
                                if(b.isBreak){
                                    setSubtitleHistory(old=> [...old,b.speech])
                                    setCurrentSubtitle('');
                                }
                                else{
                                    setCurrentSubtitle(b.speech);
                                }
                                deleted.push(counter);
                                counter += 1;
                            }
                            setBuffer(
                                new Map(
                                    [...bufferRef.current].filter(([k,v])=> !deleted.includes(k)))
                            )
                        }
                        setExpectedSeq(counter);
                    }
                    else if(e.seq > expectedSeqRef.current){
                        setBuffer(new Map(bufferRef.current.set(e.seq,{
                            speech : e.speech,
                            isBreak: e.isBreak
                        })))
                    }
                }
            })
            socket.connect();
            setInterval(() => {
                if(transcriptRef.current.trim() != '' &&
                lastEmissionRef.current != transcriptRef.current){
                    setLastEmission(transcriptRef.current);
                    sendSpeech(transcriptRef.current,languageRef.current,false)
                }
            }, speechToTextParameter.emitInterval);
        }
    },[])

    useEffect(()=>{
        if(!browserSupportsSpeechRecognition){
            setModalText("Your browser does not support speech recognition.")
            onOpen();
        }
        else if(!isMicrophoneAvailable){
            setModalText("Microphone access is not permitted.")
            onOpen();
        }
    },[isMicrophoneAvailable,browserSupportsSpeechRecognition])

    function onMessageEnd(event : any){
        resetTranscript();
        setLastEmission('');
        SpeechRecognition.getRecognition()!.lang = language;
        SpeechRecognition.getRecognition()?.start();
    }

    function toggleListening(){
            if(listening){
                SpeechRecognition.getRecognition()!.onend = ()=>{
                }
                SpeechRecognition.getRecognition()?.abort();
                setListenning(false);
            }else{
                SpeechRecognition.getRecognition()!.continuous = false;
                SpeechRecognition.getRecognition()!.lang = language;
                SpeechRecognition.getRecognition()?.start();
                setListenning(true);
                SpeechRecognition.getRecognition()!.onend = onMessageEnd
                SpeechRecognition.getRecognition()!.onspeechstart = ()=>{
                    sendSpeech('break',languageRef.current,true);
                }
            }
    }

    async function sendSpeech(speech : string, language : string, isBreak: boolean){
        if(speech == ""){
            return;
        }
        await socket.emit("hostSpeech",{
            speech : speech,
            language: speechToTranslate.get(language),
            seq: sequenceRef.current,
            isBreak: isBreak
        })
        setSequence(sequenceRef.current+1);
    }

    return(
        <>
        <Modal  isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Error</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {modalText}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
        </Modal>
        <Stack alignItems={'center'} spacing={5}>
            <Heading size='xl' color={colorTheme.primary}>Session #{sessionId}</Heading>
            <Box h={'30vh'} w={'70vw'} overflowX={'hidden'} overflowY={'scroll'}>
                <Heading size={'lg'} color={colorTheme.primary} textAlign='center'>
                    {subtitleHistory.map((s)=>{
                        return s + " ";
                    })
                    } 
                    {currentSubtitle}
                    <div ref={transcriptContainer}></div>
                </Heading>
            </Box>
            <Box w={'30vw'}>
            <Text>Speech language</Text>
            <Select onChange={e=>{
                setLanaguage(e.target.value)
            }} bgColor='white' defaultValue={languageSpeechTags[0].tag}>
                {
                    languageSpeechTags.map(e=>{
                        return (<option value={e.tag} key={e.tag}>
                            {e.name}
                        </option>)
                    })
                }
            </Select>
            <Text>Subtitle language</Text>
            <Select onChange={e=>{
                setSubtitleLanguage(e.target.value)
                socket.emit("hostChangeLanguage",e.target.value)
            }} bgColor='white' defaultValue={languageTranslateTag[0].tag}>
                {
                    languageTranslateTag.map(e=>{
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
            </Stack>
            </>
    )
}