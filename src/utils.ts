import { KeyringAccount, KeyringProvider } from '@unique-nft/accounts/keyring'
import { Client, Sdk, Signer } from '@unique-nft/sdk'
import axios from 'axios'
import * as dotenv from 'dotenv'

export const getConfig = () => {
  dotenv.config()

  if (!process.env.API_KEY) {
    throw new Error('Empty or invalid API key.')
  }
  const port = parseInt(process.env.PORT || '3000', 10)
  const interval = parseInt(process.env.UPDATE_INTERVAL || '4', 10)
  return {
    mnemonic: process.env.MNEMONIC || '',
    host: process.env.HOST || 'localhost',
    port: !isNaN(port) ? port : 3000,
    interval: !isNaN(interval) ? interval : 1, 
    apiKey: process.env.API_KEY || '',
  }
}

export const getSinger = async (mnemonic: string): Promise<KeyringAccount> => {
  const signer = await KeyringProvider.fromMnemonic(mnemonic)
  if (signer) {
    return signer
  } else {
    throw new Error('Error on getting signer from mnemonic')
  }
}

export const getSdk = async (
  baseUrl: string,
  signerOrMnemonic?: KeyringAccount | string
): Promise<Client> => {
  if (!signerOrMnemonic) {
    console.log('Sdk initialized without a signer. Please specify it to sign transactions!')
    return new Sdk({baseUrl})
  }

  if (typeof signerOrMnemonic === 'string') {
    const signer = await getSinger(signerOrMnemonic)
    return new Sdk({baseUrl, signer})
  } else {
    return new Sdk({baseUrl, signer: signerOrMnemonic})
  }
}

export const addHours = (date: Date, hours: number): Date => {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
};

export const SDKFactories = <const>{
  opal: (signer?: Signer) => new Sdk({baseUrl: 'https://rest.unique.network/opal/v1', signer}),
  quartz: (signer?: Signer) => new Sdk({baseUrl: 'https://rest.unique.network/quartz/v1', signer}),
  unique: (signer?: Signer) => new Sdk({baseUrl: 'https://rest.unique.network/unique/v1', signer}),
  rc: (signer?: Signer) => new Sdk({baseUrl: 'https://rest.dev.uniquenetwork.dev/v1', signer}),
  uniqsu: (signer?: Signer) => new Sdk({baseUrl: 'https://rest.unq.uniq.su/v1', signer}),
}

export const getLocation = async (city: string) => {
  const config = getConfig()
  const response = await axios.get(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${config.apiKey}`
  )

  if (response) {
    return {...response.data[0], apiKey: config.apiKey}
  } else {
    console.log('Error occurred while fetching coordinates.')
  }
}

export const getAirPollution = async (city: string) => {
  const {lat, lon, apiKey} = await getLocation(city)

  const response = await axios.get(
    `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
  )

  if (response) {
    return response.data
  } else {
    console.log('Error occurred while fetching air pollution.')
  }
}

export const KNOWN_NETWORKS = Object.keys(SDKFactories)

export enum IMAGES {
  Good = '1 - Good.png',
  Fair = '2 - Fair.png',
  Moderate = '3 - Moderate.png',
  Poor = '4 - Poor.png',
  VeryPoor = '5 - Very Poor.png',
  Cover = 'cover.png',
}