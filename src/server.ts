import Router from '@koa/router'
import { SetTokenPropertiesBody } from '@unique-nft/sdk'
import Koa from 'koa'
import {
  IMAGES,
  SDKFactories,
  addHours,
  getAirPollution,
  getConfig,
  getLocation,
  getSinger,
} from './utils'

const config = getConfig()

const app = new Koa()
const router = new Router()

const lastRenderTimes: Record<string, number> = {}
const TIMEOUT = 10 * 1000

const updateToken = async (tokenArgs: SetTokenPropertiesBody, city: string) => {
  const signer = await getSinger(getConfig().mnemonic)
  const sdk = SDKFactories['opal' as keyof typeof SDKFactories](signer)
  const airPollution = await getAirPollution(city)
  const cityData = await getLocation(city)
  const aqi = (airPollution as any).list.main.aqi as number
  const now = new Date()

  if (airPollution && cityData) {
    const {parsed, error} = await sdk.tokens.setProperties.submitWaitResult({
      ...tokenArgs,
      properties: [
        {key: 'Last update', value: 'now'},
        {key: 'Next update', value: `${addHours(now, config.interval)}`},
        {key: 'Air Quality Index', value: (airPollution as any).list.main.aqi},
        {
          key: 'Сoncentration of CO (Carbon monoxide), μg/m3',
          value: (airPollution as any).list.components.co,
        },
        {
          key: 'Сoncentration of NO (Nitrogen monoxide), μg/m3',
          value: (airPollution as any).list.components.no,
        },
        {
          key: 'Сoncentration of NO2 (Nitrogen dioxide), μg/m3',
          value: (airPollution as any).list.components.no2,
        },
        {
          key: 'Сoncentration of O3 (Ozone), μg/m3',
          value: (airPollution as any).list.components.o3,
        },
        {
          key: 'Сoncentration of SO2 (Sulphur dioxide), μg/m3',
          value: (airPollution as any).list.components.so2,
        },
        {
          key: 'Сoncentration of PM2.5 (Fine particles matter), μg/m3',
          value: (airPollution as any).list.components.pm2_5,
        },
        {
          key: 'Сoncentration of PM10 (Coarse particulate matter), μg/m3',
          value: (airPollution as any).list.components.pm10,
        },
        {
          key: 'Сoncentration of PM10 (Coarse particulate matter), μg/m3',
          value: (airPollution as any).list.components.nh3,
        },
        {key: 'image', value: Object.values(IMAGES)[aqi]},
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

router.get(`/:city`, async (ctx) => {
  const city: string = ctx.params.city || ''

  // Check if the timeout expired
  /* if (!lastRenderTimes[path] || Date.now() - lastRenderTimes[path] > CACHE_TIME) {
    const sdk = SDKFactories[network as keyof typeof SDKFactories]()

    const imgArray = await getTokenImageUrls(sdk, {collectionId, tokenId})
    await mergeImages(imgArray, offset, path)
    lastRenderTimes[path] = Date.now()
  }
  console.log(`Serving ${path}...`)

  const stream = fs.createReadStream(path)
  ctx.response.set('content-type', 'image/png')
  ctx.body = stream */
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
