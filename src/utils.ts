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
  const result = new Date(date)
  result.setHours(result.getHours() + hours)
  return result
}

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

  if (lat && lon) {
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    )

    if (response) {
      return response.data
    } else {
      console.log('Error occurred while fetching air pollution.')
    }
  } else {
    console.log(`Cannot fetch data for ${city}`)
  }
}

export const KNOWN_NETWORKS = Object.keys(SDKFactories)

export const IPFS_CID =
  'https://ipfs.unique.network/ipfs/QmX4DmQYobCMFJv32EvNhk8ppDMJDiAhiR1axJYcaKa8M2/'
export const RESOURCE = 'https://openweathermap.org/'

export enum IMAGES {
  Good = 'Good.png',
  Fair = 'Fair.png',
  Moderate = 'Moderate.png',
  Poor = 'Poor.png',
  VeryPoor = 'Very Poor.png',
  Cover = 'cover.png',
}

export const CITIES: string[] = [
  'Tokyo',
  'Delhi',
  'Shanghai',
  'Dhaka',
  'Sao Paulo',
  'Mexico City',
  'Cairo',
  'Beijing',
  'Mumbai',
  'Osaka',
  'Chongqing',
  'Karachi',
  'Istanbul',
  'Kinshasa',
  'Lagos',
  'Buenos Aires',
  'Kolkata',
  'Manila',
  'Tianjin',
  'Guangzhou',
  'Rio de Janeiro',
  'Lahore',
  'Bangalore',
  'Shenzhen',
  'Moscow',
  'Chennai',
  'Bogota',
  'Paris',
  'Jakarta',
  'Lima',
  'Bangkok',
  'Hyderabad',
  'Seoul',
  'Nagoya',
  'London',
  'Chengdu',
  'Nanjing',
  'Tehran',
  'Ho Chi Minh City',
  'Luanda',
  'New York City',
  'Wuhan',
  'Xi-an',
  'Ahmedabad',
  'Kuala Lumpur',
  'Hangzhou',
  'Surat',
  'Suzhou',
  'Hong Kong',
  'Riyadh',
  'Shenyang',
  'Baghdad',
  'Dongguan',
  'Foshan',
  'Dar es Salaam',
  'Pune',
  'Santiago',
  'Madrid',
  'Harbin',
  'Toronto',
]
