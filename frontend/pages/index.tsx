import AppBar from "@/components/appbar";
import { colorTheme } from "@/uitls/constants";
import { Box, Button, Center, Heading, Input, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useRef } from "react";

export default function Home() {
  const router = useRouter();
  const sessionId = useRef<any>(null);
  return (
    <Stack h={'85vh'}>
      <AppBar/>
      <Center h={'full'}>
        <Stack alignItems={'center'} spacing={8}>
          <Heading size='xl' color={colorTheme.primary}>Bring subtitle to real life</Heading>
          <Input bgColor={'white'} placeholder={'session id'} ref={sessionId}>
          </Input>
          <Stack w={'20vw'}>
            <Button bgColor={colorTheme.primary} color = {"white"} onClick={()=>{
                router.push("/session?sessionId=" + sessionId.current.value)
              
            }}>Join session</Button>
            <Button bgColor={colorTheme.primary} color={"white"}
            onClick={()=>{
              router.replace("/speaker")
            }}
            >Host new session</Button>
            </Stack>
        </Stack>
      </Center>
    </Stack>
  )
    
}
