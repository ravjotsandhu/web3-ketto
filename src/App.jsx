import React from 'react'
import Navbar from './Components/Navbar.jsx'
import * as ReactDOM from 'react-dom'
import { ChakraProvider } from '@chakra-ui/react'
import theme from './chakra/theme'
function App() {
    return (
        <ChakraProvider theme={theme}>
            <Navbar />
        </ChakraProvider>
    )
}

export default App
