import React, { useState, useEffect } from 'react'
import { Framework } from '@superfluid-finance/sdk-core'
import { Button, Form, FormGroup, FormControl, Spinner, Card } from 'react-bootstrap'
import './createFlow.css'
import { ethers } from 'ethers'
import * as PushAPI from '@pushprotocol/restapi'
let account

const sendNotification = async (titleProp, bodyProp) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send('eth_requestAccounts', [])
  const signer = provider.getSigner()
  try {
    // const recipient = `eip155:5:${recipientProp}`
    const subscribers = await PushAPI.user.getSubscribers({
      channel: `eip155:5:${import.meta.env.VITE_channel_address}`, // channel address in CAIP
      page: 1, // Optional, defaults to 1
      limit: 10, // Optional, defaults to 10
      env: 'staging', // Optional, defaults to 'prod'
    })
    const apiResponse = await PushAPI.payloads.sendNotification({
      signer,
      type: 3, // target
      identityType: 2, // direct payload
      notification: {
        title: titleProp,
        body: bodyProp,
      },
      payload: {
        title: titleProp,
        body: bodyProp,
        cta: '',
        img: '',
      },
      recipients: subscribers, // recipient address
      channel: `eip155:5:${import.meta.env.VITE_channel_address}`, // your channel address
      env: 'staging',
    })
    // apiResponse?.status === 204, if sent successfully!
    console.log('API repsonse: ', apiResponse)
  } catch (err) {
    console.error('Error: ', err)
  }
}

//where the Superfluid logic takes place
async function distributeFunds(id, amount) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  //   const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_QUICKNODE_API_KEY_URL)
  //   await provider.send('eth_requestAccounts', [])

  const signer = provider.getSigner()
  const chainId = await window.ethereum.request({ method: 'eth_chainId' })
  //   const chainId = await provider.send('eth_chainId')
  const sf = await Framework.create({
    chainId: Number(chainId),
    provider: provider,
  })
  const superSigner = sf.createSigner({ signer: signer })
  console.log(signer)
  //   console.log(await superSigner.getAddress())
  const ethx = await sf.loadSuperToken('ETHx')
  console.log(ethx)
  try {
    const distributeOperation = ethx.distribute({
      indexId: id,
      amount: amount,
      // userData?: string
    })
    console.log('Distributing...')
    await distributeOperation.exec(signer)
    console.log(
      `Congrats - you've just distributed to an Index!
         Network: Goerli
         Super Token: ethx
         Index ID: ${id}
         Amount: ${amount}         
      `
    )
    console.log(
      `Congrats - you've just distributed to your index!
    `
    )
    sendNotification(`Donation Received`, `You have received a donation of ${amount} ETHx!`)
  } catch (error) {
    console.log(
      "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
    )
    console.error(error)
  }
}

const Distribute = () => {
  const [id, setId] = useState('')
  const [amount, setAmount] = useState('')
  const [isButtonLoading, setIsButtonLoading] = useState(false)
  const [currentAccount, setCurrentAccount] = useState('')

  function DistributeButton({ isLoading, children, ...props }) {
    return (
      <Button variant="success" className="button" {...props}>
        {isButtonLoading ? <Spinner animation="border" /> : children}
      </Button>
    )
  }

  const handleIdChange = (e) => {
    setId(() => ([e.target.name] = e.target.value))
  }

  const handleAmountChange = (e) => {
    setAmount(() => ([e.target.name] = e.target.value))
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        alert('Get MetaMask!')
        return
      }
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })
      console.log('Connected', accounts[0])
      setCurrentAccount(accounts[0])
      account = currentAccount
      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      // setupEventListener()
    } catch (error) {
      console.log(error)
    }
  }

  const checkIfWalletIsConnected = async () => {
    console.log('runs')
    const { ethereum } = window

    if (!ethereum) {
      console.log('Make sure you have metamask!')
      return
    } else {
      console.log('We have the ethereum object', ethereum)
    }

    const accounts = await window.ethereum.request({ method: 'eth_accounts' })
    const chain = await window.ethereum.request({ method: 'eth_chainId' })
    let chainId = chain
    console.log('chain ID:', chain)
    console.log('global Chain Id:', chainId)
    if (accounts.length !== 0) {
      account = accounts[0]
      console.log('Found an authorized account:', account)
      setCurrentAccount(account)
      // Setup listener! This is for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
      // setupEventListener()
    } else {
      console.log('No authorized account found')
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  return (
    <div>
      <h2>Distribute To Your Index</h2>
      {currentAccount === '' ? (
        <button id="connectWallet" className="button" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <Card className="connectedWallet">
          {`${currentAccount.substring(0, 4)}...${currentAccount.substring(38)}`}
        </Card>
      )}
      <Form>
        <FormGroup className="mb-3">
          <FormControl
            name="id"
            value={id}
            onChange={handleIdChange}
            placeholder="Enter your index ID"
          ></FormControl>
        </FormGroup>
        <FormGroup className="mb-3">
          <FormControl
            name="subscriber"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
          ></FormControl>
        </FormGroup>
        <DistributeButton
          onClick={() => {
            setIsButtonLoading(true)
            distributeFunds(id, amount)
            setTimeout(() => {
              setIsButtonLoading(false)
            }, 1000)
          }}
        >
          Click to Distribute Funds
        </DistributeButton>
      </Form>

      <div className="description">
        <p>
          Go to the Distribute.js component and look at the
          <b> distribute() </b>
          function to see under the hood
        </p>
      </div>
    </div>
  )
}
export default Distribute
