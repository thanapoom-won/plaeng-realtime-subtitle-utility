import AppBar from "@/components/appbar";
import { colorTheme } from "@/uitls/constants";
import { Box, Button, Center, Heading, Input, Stack } from "@chakra-ui/react";

export default function Home() {
  return (
    <Stack h={'100vh'}>
      <AppBar/>
      <Center h={'full'}>
        <Stack alignItems={'center'} spacing={8}>
          <Heading size='xl' color={colorTheme.primary}>Bring subtitle to real life</Heading>
          <Input bgColor={'white'} placeholder={'session code'}>
          </Input>
          <Stack w={'20vw'}>
            <Button bgColor={colorTheme.primary} color = {"white"}>Join session</Button>
            <Button bgColor={colorTheme.primary} color={"white"}>Host new session</Button>
            </Stack>
        </Stack>
      </Center>
    </Stack>
  )
    
}
