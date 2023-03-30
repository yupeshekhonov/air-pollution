import Router from '@koa/router'
import { SetTokenPropertiesBody } from '@unique-nft/sdk'
import Koa from 'koa'
import {
  CITIES,
  IMAGES,
  IPFS_CID,
  SDKFactories,
  addHours,
  getAirPollution,
  getConfig,
  getLocation,
  getSinger,
} from './utils'

type SetPropertiesFields = Pick<SetTokenPropertiesBody, 'address' | 'collectionId' | 'tokenId'>

const config = getConfig()

const app = new Koa()
const router = new Router()

const lastRenderTimes: Date[] = []
const COLLECTION_ID = 1052

const updateToken = async (tokenArgs: SetPropertiesFields, city: string) => {
  const signer = await getSinger(getConfig().mnemonic)
  const sdk = SDKFactories['opal' as keyof typeof SDKFactories](signer)
  const airPollution = await getAirPollution(city)
  const cityData = await getLocation(city)
  const airData = (airPollution as any).list[0]
  const aqi = airData.main.aqi as number
  const now = new Date()

  if (airPollution && cityData) {
    const {parsed, error} = await sdk.tokens.setProperties.submitWaitResult({
      ...tokenArgs,
      properties: [
        {key: 'a.2', value: `${now.toLocaleString()}`},
        {key: 'a.3', value: `${addHours(now, config.interval).toLocaleString()}`},
        {key: 'a.4', value: airData.main.aqi},
        {
          key: 'a.5',
          value: airData.components.co,
        },
        {
          key: 'a.6',
          value: airData.components.no,
        },
        {
          key: 'a.7',
          value: airData.components.no2,
        },
        {
          key: 'a.8',
          value: airData.components.o3,
        },
        {
          key: 'a.9',
          value: airData.components.so2,
        },
        {
          key: 'a.10',
          value: airData.components.pm2_5,
        },
        {
          key: 'a.11',
          value: airData.components.pm10,
        },
        {
          key: 'a.12',
          value: airData.components.nh3,
        },
        {key: 'i.u', value: IPFS_CID + Object.values(IMAGES)[aqi - 1]},
      ],
    })

    if (parsed?.properties) {
      return sdk.tokens.get({
        collectionId: parsed.properties[0].collectionId,
        tokenId: parsed.properties[0].tokenId,
      })
    } else {
      throw error ? error : new Error('Error when setting token properties!')
    }
  }
}

function wait(ms:number){
  var start = new Date().getTime();
  var end = start;
  while(end < start + ms) {
    end = new Date().getTime();
 }
}

router.all('/', async (ctx) => {
  const now = new Date() 

  console.log('Update started ... ')
  const signer = await getSinger(getConfig().mnemonic)
    const sdk = SDKFactories['opal' as keyof typeof SDKFactories]()
  for (const city of CITIES) {
    updateToken({
      address: signer.getAddress(),
      collectionId: COLLECTION_ID,
      tokenId: CITIES.indexOf(city) + 1,
    }, city)
    wait(5000)
    console.log(`${city} was updated.`)
  }

 /*  // Check if the timeout expired
  if (!lastRenderTimes[lastRenderTimes.length - 1] || (now.getDate() - lastRenderTimes[lastRenderTimes.length - 1].getDate()) > config.interval) {
    const signer = await getSinger(getConfig().mnemonic)
    const sdk = SDKFactories['opal' as keyof typeof SDKFactories]()
    lastRenderTimes.push(new Date())
    for (const city of CITIES) {
      updateToken({
        address: signer.getAddress(),
        collectionId: COLLECTION_ID,
        tokenId: CITIES.indexOf(city),
      }, city)
    }
  } */
}) 

app.use(router.routes()).use(router.allowedMethods())

app.listen(config.port, config.host, () => {
  console.log(`Server listening on ${config.host}:${config.port}`)
  console.log(
    `http${['localhost', '127.0.0.1'].includes(config.host) ? '' : 's'}://${config.host}:${
      config.port
    }`
  )
})
