import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const config = {
    initialColorMode: 'light',
    useSystemColorMode: false,
  }

const theme = extendTheme({
  config,
  styles: {
    global: (props:any) => ({
      body: {
        bg: mode('gray.200'/*light_mode*/,"gray.200"/*dark mode */)(props),
      },
    }),
  },
})
export default theme