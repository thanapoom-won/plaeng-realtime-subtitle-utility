import { Box, Heading, Stack, Text } from "@chakra-ui/react";


export default function AppBar(){
    return(
        <Stack bgColor={'#183347'}>
            <Box padding={'10px'} paddingBottom={'12px'} >
            <Heading size='xl' color={'#5ce1e6'}>Plaeng</Heading>
            <Text color={'white'}>Breakthrough language barriers </Text>
            </Box>
        </Stack>
    )
}