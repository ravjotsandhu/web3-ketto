import { useState } from 'react'
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon, ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { ethers } from 'ethers'

export default function Navbar() {
  const provider = new ethers.providers.Web3Provider(window.ethereum)

  const [errorMessage, setErrorMessage] = useState(null)
  const [defaultAccount, setDefaultAccount] = useState(null)
  const [userBalance, setUserBalance] = useState(null)
  const connectwalletHandler = () => {
    if (window.ethereum) {
      provider.send('eth_requestAccounts', []).then(async () => {
        await accountChangedHandler(provider.getSigner())
      })
    } else {
      setErrorMessage('Please Install Metamask!!!')
    }
  }
  const accountChangedHandler = async (newAccount) => {
    const address = await newAccount.getAddress()
    setDefaultAccount(address)
    const balance = await newAccount.getBalance()
    setUserBalance(ethers.utils.formatEther(balance))
    await getuserBalance(address)
  }
  const getuserBalance = async (address) => {
    const balance = await provider.getBalance(address, 'latest')
  }

  return (
    <Box p="1rem" borderRadius="lg">
      <Text fontSize="lg" fontWeight="medium" mt="0.5rem">
        Welcome to a decentralized Application
      </Text>
      <Flex justifyContent="center" mt="0.5rem">
        <Button
          onClick={connectwalletHandler}
          variant="outline"
          color={defaultAccount ? 'white' : 'gray.600'}
        >
          {defaultAccount ? 'Connected!!' : 'Connect'}
        </Button>
      </Flex>
      <Flex mt="1rem" direction="column">
        <Text fontSize="md" fontWeight="medium">
          Address:
        </Text>
        <Text fontSize="lg" fontWeight="medium">
          {defaultAccount}
        </Text>
      </Flex>
      <Flex mt="1rem" direction="column">
        <Text fontSize="md" fontWeight="medium">
          Wallet Amount:
        </Text>
        <Text fontSize="lg" fontWeight="medium">
          {userBalance}
        </Text>
      </Flex>
      {errorMessage}
    </Box>
  )
}
