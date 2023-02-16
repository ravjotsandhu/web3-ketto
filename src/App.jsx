import React from 'react'
// import Navbar from './Components/Navbar.jsx'
import * as ReactDOM from 'react-dom'
import { ChakraProvider } from '@chakra-ui/react'
import theme from './chakra/theme'
import CreateFlow from './Components/CreateFlow.jsx'

function App() {
  return (
    <ChakraProvider theme={theme}>
      <CreateFlow />
    </ChakraProvider>
  )
}

export default App
