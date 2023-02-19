import React, { useState, useEffect } from 'react'
import { Framework } from '@superfluid-finance/sdk-core'
import { Button, Form, FormGroup, FormControl, Spinner, Card } from 'react-bootstrap'
import './createFlow.css'
import { ethers } from 'ethers'
import * as PushAPI from '@pushprotocol/restapi'
let account

//IMPORTANT:remeber our id and shares are predefined, shares=1 and id=index of subscriber/donor

const sendCharityJoinedBucketNotification = async (titleProp, bodyProp, recipientProp) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send('eth_requestAccounts', [])
  const signer = provider.getSigner()
  try {
    const recipient = `eip155:5:${recipientProp}`
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
      recipients: recipientProp, // recipient address
      channel: `eip155:5:${import.meta.env.VITE_channel_address}`, // your channel address
      env: 'staging',
    })
    // apiResponse?.status === 204, if sent successfully!
    console.log('API repsonse: ', apiResponse)
  } catch (err) {
    console.error('Error: ', err)
  }
}

async function updateSubscription(id, address, shares) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  // const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_QUICKNODE_API_KEY_URL)
  // await provider.send('eth_requestAccounts', [])

  const signer = provider.getSigner()
  const chainId = await window.ethereum.request({ method: 'eth_chainId' })
  // const chainId = await provider.send('eth_chainId')
  const sf = await Framework.create({
    chainId: Number(chainId),
    provider: provider,
  })
  const superSigner = sf.createSigner({ signer: signer })

  console.log(signer)
  console.log(await superSigner.getAddress())
  const ethx = await sf.loadSuperToken('ETHx')

  console.log(ethx)

  try {
    const updateSubscriptionOperation = ethx.updateSubscriptionUnits({
      indexId: id,
      subscriber: address,
      units: shares,
      // userData?: string
    })
    console.log('Updating your Index...')

    await updateSubscriptionOperation.exec(signer)

    console.log(
      `Congrats - you've just updated an Index!
         Network: Goerli
         Super Token: ethx
         Index ID: ${id}
         Subscriber: ${address}
         Units: ${shares} units    
      `
    )
    console.log(
      `Congrats - you've just updated your index!
    `
    )
    sendCharityJoinedBucketNotification(
      `Registered as a donation recipient`,
      `You have joined the xyz charity bucket`,
      address
    )
  } catch (error) {
    console.log(
      "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
    )
    console.error(error)
  }
}

const UpdateSubscription = () => {
  const [id, setId] = useState('')
  const [subscriber, setSubscriber] = useState('')
  const [units, setUnits] = useState('')
  const [isButtonLoading, setIsButtonLoading] = useState(false)
  const [currentAccount, setCurrentAccount] = useState('')

  function UpdateSubButton({ isLoading, children, ...props }) {
    return (
      <Button variant="success" className="button" {...props}>
        {isButtonLoading ? <Spinner animation="border" /> : children}
      </Button>
    )
  }

  const handleIdChange = (e) => {
    setId(() => ([e.target.name] = e.target.value))
  }

  const handleSubscriberChange = (e) => {
    setSubscriber(() => ([e.target.name] = e.target.value))
  }

  const handleUnitsChange = (e) => {
    setUnits(() => ([e.target.name] = e.target.value))
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
      <h2>Give Units to Subscribers of Your Index</h2>
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
            value={subscriber}
            onChange={handleSubscriberChange}
            placeholder="Enter subscriber address"
          ></FormControl>
        </FormGroup>
        <FormGroup className="mb-3">
          <FormControl
            name="units"
            value={units}
            onChange={handleUnitsChange}
            placeholder="Enter the number of shares to give subscriber"
          ></FormControl>
        </FormGroup>
        <UpdateSubButton
          onClick={() => {
            setIsButtonLoading(true)
            updateSubscription(id, subscriber, units)
            setTimeout(() => {
              setIsButtonLoading(false)
            }, 1000)
          }}
        >
          Click to Update Your Index
        </UpdateSubButton>
      </Form>

      <div className="description">
        <p>
          Go to the UpdateSubscription.js component and look at the
          <b> updateSubscription() </b>
          function to see under the hood
        </p>
      </div>
    </div>
  )
}

export default UpdateSubscription
