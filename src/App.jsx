import React from 'react'
// import Navbar from './Components/Navbar.jsx'
import * as ReactDOM from 'react-dom'
import { ChakraProvider } from '@chakra-ui/react'
import theme from './chakra/theme'
import CreateFlow from './Components/CreateFlow.jsx'
import CreateIndex from './Components/CreateIndex.jsx'
import UpdateSubscription from './Components/UpdateSubscription.jsx'
import Distribute from './Components/Distribute.jsx'
function App() {
  return (
    <ChakraProvider theme={theme}>
      <CreateFlow />
      <CreateIndex />
      <UpdateSubscription />
      <Distribute />
    </ChakraProvider>
  )
}

export default App
