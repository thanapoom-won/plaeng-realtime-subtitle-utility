import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { colorTheme } from "./uitls/constants";

const config = {
    initialColorMode: 'light',
    useSystemColorMode: false,
  }

const theme = extendTheme({
  config,
  styles: {
    global: (props:any) => ({
      body: {
        bg: mode(colorTheme.secondary/*light_mode*/,"gray.200"/*dark mode */)(props),
      },
    }),
  },
})
export default theme