import { extendTheme } from '@chakra-ui/react'
import '@fontsource/poppins/300.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
const styles = {
    global: () => ({
        body: {
            bg: 'transparent'
        },
        p: {
            background: 'transparent',
            color: 'white'
        },
        div: {
            background: 'transparent'
        },
        img: {
            background: 'transparent'
        },
        svg: {
            background: 'transparent'
        },
        span: {
            background: 'transparent'
        },
        ul: {
            background: 'transparent'
        },
        li: {
            background: 'transparent'
        },
        button: {
            background: 'transparent'
        },
        label: {
            background: 'transparent',
            color: 'white'
        }
    })
}
// "*::placeholder": {
//       color: "white",
//     },
const fonts = {
    body: 'Poppins, sans-serif' // default
}

const config = {
    initialColorMode: 'dark',
    useSystemColorMode: 'false'
}

const theme = extendTheme({
    config,
    styles,
    fonts,
    fontWeights
})

export default theme
