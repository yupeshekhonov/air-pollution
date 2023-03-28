import { AttributeType, COLLECTION_SCHEMA_NAME } from '@unique-nft/schemas'
import {
  Client,
  CollectionInfoWithSchemaResponse,
  CreateCollectionBody,
  CreateTokenBody,
  TokenByIdResponse,
  UniqueCollectionSchemaToCreateDto,
} from '@unique-nft/sdk'
import {
  CITIES,
  IMAGES,
  IPFS_CID,
  RESOURCE,
  SDKFactories,
  addHours,
  getAirPollution,
  getConfig,
  getLocation,
  getSinger,
} from './utils'

type CreateCollectionFields = Pick<CreateCollectionBody, 'name' | 'description' | 'tokenPrefix'>

const createCollection = async (
  sdk: Client,
  address: string,
  collectionArgs: CreateCollectionFields,
  coverPictureIpfsCid: string
): Promise<CollectionInfoWithSchemaResponse> => {
  const collectionSchema: UniqueCollectionSchemaToCreateDto = {
    schemaName: COLLECTION_SCHEMA_NAME.unique,
    schemaVersion: '1.0.0',
    attributesSchemaVersion: '1.0.0',
    image: {
      urlTemplate:
        'https://ipfs.unique.network/ipfs/QmX4DmQYobCMFJv32EvNhk8ppDMJDiAhiR1axJYcaKa8M2/{infix}',
    },
    coverPicture: {
      ipfsCid: coverPictureIpfsCid,
    },
    attributesSchema: {
      0: {
        name: {_: 'City'},
        type: AttributeType.string,
        optional: false,
        isArray: false,
        enumValues: {
          0: {_: 'Tokyo'},
          1: {_: 'Delhi'},
          2: {_: 'Shanghai'},
          3: {_: 'Dhaka'},
          4: {_: 'Sao Paulo'},
          5: {_: 'Mexico City'},
          6: {_: 'Cairo'},
          7: {_: 'Beijing'},
          8: {_: 'Mumbai'},
          9: {_: 'Osaka'},
          10: {_: 'Chongqing'},
          11: {_: 'Karachi'},
          12: {_: 'Istanbul'},
          13: {_: 'Kinshasa'},
          14: {_: 'Lagos'},
          15: {_: 'Buenos Aires'},
          16: {_: 'Kolkata'},
          17: {_: 'Manila'},
          18: {_: 'Tianjin'},
          19: {_: 'Guangzhou'},
          20: {_: 'Rio de Janeiro'},
          21: {_: 'Lahore'},
          22: {_: 'Bangalore'},
          23: {_: 'Shenzhen'},
          24: {_: 'Moscow'},
          25: {_: 'Chennai'},
          26: {_: 'Bogota'},
          27: {_: 'Paris'},
          28: {_: 'Jakarta'},
          29: {_: 'Lima'},
          30: {_: 'Bangkok'},
          31: {_: 'Hyderabad'},
          32: {_: 'Seoul'},
          33: {_: 'Nagoya'},
          34: {_: 'London'},
          35: {_: 'Chengdu'},
          36: {_: 'Nanjing'},
          37: {_: 'Tehran'},
          38: {_: 'Ho Chi Minh City'},
          39: {_: 'Luanda'},
          40: {_: 'New York City'},
          41: {_: 'Wuhan'},
          42: {_: 'Xi-an Shaanxi'},
          43: {_: 'Ahmedabad'},
          44: {_: 'Kuala Lumpur'},
          45: {_: 'Hangzhou'},
          46: {_: 'Surat'},
          47: {_: 'Suzhou'},
          48: {_: 'Hong Kong'},
          49: {_: 'Riyadh'},
          50: {_: 'Shenyang'},
          51: {_: 'Baghdad'},
          52: {_: 'Dongguan'},
          53: {_: 'Foshan'},
          54: {_: 'Dar es Salaam'},
          55: {_: 'Pune'},
          56: {_: 'Santiago'},
          57: {_: 'Madrid'},
          58: {_: 'Harbin'},
          59: {_: 'Toronto'},
        },
      },
      1: {
        name: {_: 'Country'},
        type: AttributeType.string,
        optional: false,
        isArray: false,
        enumValues: {
          0: {_: 'Japan'},
          1: {_: 'India'},
          2: {_: 'China'},
          3: {_: 'Bangladesh'},
          4: {_: 'Brazil'},
          5: {_: 'Mexico'},
          6: {_: 'Egypt'},
          7: {_: 'China'},
          8: {_: 'India'},
          9: {_: 'Japan'},
          10: {_: 'China'},
          11: {_: 'Pakistan'},
          12: {_: 'Turkey'},
          13: {_: 'DR Congo'},
          14: {_: 'Nigeria'},
          15: {_: 'Argentina'},
          16: {_: 'India'},
          17: {_: 'Philippines'},
          18: {_: 'China'},
          19: {_: 'China'},
          20: {_: 'Brazil'},
          21: {_: 'Pakistan'},
          22: {_: 'India'},
          23: {_: 'China'},
          24: {_: 'Russia'},
          25: {_: 'India'},
          26: {_: 'Colombia'},
          27: {_: 'France'},
          28: {_: 'Indonesia'},
          29: {_: 'Peru'},
          30: {_: 'Thailand'},
          31: {_: 'India'},
          32: {_: 'South Korea'},
          33: {_: 'Japan'},
          34: {_: 'United Kingdom'},
          35: {_: 'China'},
          36: {_: 'China'},
          37: {_: 'Iran'},
          38: {_: 'Vietnam'},
          39: {_: 'Angola'},
          40: {_: 'United States'},
          41: {_: 'China'},
          42: {_: 'China'},
          43: {_: 'India'},
          44: {_: 'Malaysia'},
          45: {_: 'China'},
          46: {_: 'India'},
          47: {_: 'China'},
          48: {_: 'Hong Kong'},
          49: {_: 'Saudi Arabia'},
          50: {_: 'China'},
          51: {_: 'Iraq'},
          52: {_: 'China'},
          53: {_: 'China'},
          54: {_: 'Tanzania'},
          55: {_: 'India'},
          56: {_: 'Chile'},
          57: {_: 'Spain'},
          58: {_: 'China'},
          59: {_: 'Canada'},
        },
      },
      2: {
        name: {_: 'Last update'},
        type: AttributeType.string,
        optional: false,
        isArray: false,
      },
      3: {
        name: {_: 'Next update'},
        type: AttributeType.string,
        optional: false,
        isArray: false,
      },
      4: {
        name: {_: 'Air Quality Index'},
        type: AttributeType.number,
        optional: false,
        isArray: false,
        enumValues: {
          0: {_: 1},
          1: {_: 2},
          2: {_: 3},
          3: {_: 4},
          4: {_: 5},
        },
      },
      5: {
        name: {_: 'Сoncentration of CO (Carbon monoxide), μg/m3'},
        type: AttributeType.number,
        optional: false,
        isArray: false,
      },
      6: {
        name: {_: 'Сoncentration of NO (Nitrogen monoxide), μg/m3'},
        type: AttributeType.number,
        optional: false,
        isArray: false,
      },
      7: {
        name: {_: 'Сoncentration of NO2 (Nitrogen dioxide), μg/m3'},
        type: AttributeType.number,
        optional: false,
        isArray: false,
      },
      8: {
        name: {_: 'Сoncentration of O3 (Ozone), μg/m3'},
        type: AttributeType.number,
        optional: false,
        isArray: false,
      },
      9: {
        name: {_: 'Сoncentration of SO2 (Sulphur dioxide), μg/m3'},
        type: AttributeType.number,
        optional: false,
        isArray: false,
      },
      10: {
        name: {_: 'Сoncentration of PM2.5 (Fine particles matter), μg/m3'},
        type: AttributeType.number,
        optional: false,
        isArray: false,
      },
      11: {
        name: {_: 'Сoncentration of PM10 (Coarse particulate matter), μg/m3'},
        type: AttributeType.number,
        optional: false,
        isArray: false,
      },
      12: {
        name: {_: 'Сoncentration of NH3 (Ammonia), μg/m3'},
        type: AttributeType.number,
        optional: false,
        isArray: false,
      },
      13: {
        name: {_: 'Resource'},
        type: AttributeType.string,
        optional: false,
        isArray: false,
      },
    },
  }

  const {parsed, error} = await sdk.collections.creation.submitWaitResult({
    ...collectionArgs,
    address,
    schema: collectionSchema,
    tokenPropertyPermissions: [
      {key: 'i.u', permission: {mutable: true, collectionAdmin: true, tokenOwner: false}},
      {key: 'a.10', permission: {mutable: true, collectionAdmin: true, tokenOwner: false}},
      {key: 'a.11', permission: {mutable: true, collectionAdmin: true, tokenOwner: false}},
      {key: 'a.12', permission: {mutable: true, collectionAdmin: true, tokenOwner: false}},
      {key: 'a.2', permission: {mutable: true, collectionAdmin: true, tokenOwner: false}},
      {key: 'a.3', permission: {mutable: true, collectionAdmin: true, tokenOwner: false}},
      {key: 'a.4', permission: {mutable: true, collectionAdmin: true, tokenOwner: false}},
      {key: 'a.5', permission: {mutable: true, collectionAdmin: true, tokenOwner: false}},
      {key: 'a.6', permission: {mutable: true, collectionAdmin: true, tokenOwner: false}},
      {key: 'a.7', permission: {mutable: true, collectionAdmin: true, tokenOwner: false}},
      {key: 'a.8', permission: {mutable: true, collectionAdmin: true, tokenOwner: false}},
      {key: 'a.9', permission: {mutable: true, collectionAdmin: true, tokenOwner: false}},
    ],
  })

  if (parsed?.collectionId) {
    console.log(
      `The collection was created. Id: ${parsed?.collectionId},` +
        `${sdk.options.baseUrl}/collections?collectionId=${parsed?.collectionId}`
    )
    return await sdk.collections.get({collectionId: parsed?.collectionId})
  } else {
    throw error ? error : new Error('Error when creating a collection!')
  }
}

const mintToken = async (
  sdk: Client,
  tokenArgs: CreateTokenBody,
  city: string
): Promise<TokenByIdResponse | void> => {
  const cityData = await getLocation(city)
  const airPollution = await getAirPollution(city)
  const airData = (airPollution as any).list[0]
  const aqi = airData.main.aqi as number
  const now = new Date()
  const config = getConfig()

  if (airPollution && cityData) {
    const {parsed, error} = await sdk.tokens.create.submitWaitResult({
      ...tokenArgs,
      data: {
        encodedAttributes: {
          0: CITIES.indexOf(city), // index for Enum values
          1: CITIES.indexOf(city),
          2: {_: `${now.toLocaleString()}`},
          3: {_: `${addHours(now, config.interval).toLocaleString()}`},
          4: airData.main.aqi - 1,
          5: {_: airData.components.co},
          6: {_: airData.components.no},
          7: {_: airData.components.no2}, // object for number or string without enum
          8: {_: airData.components.o3},
          9: {_: airData.components.so2},
          10: {_: airData.components.pm2_5},
          11: {_: airData.components.pm10},
          12: {_: airData.components.nh3},
          13: {_: RESOURCE},
        },
        image: {
          url: IPFS_CID + Object.values(IMAGES)[aqi - 1],
        },
        name: {_: city},
        description: {_: `This token displays the air pollution in ${city}`},
      },
    })

    if (parsed?.tokenId) {
      console.log(
        `The ${city} token was minted. Id: ${parsed?.tokenId}, collection id: ${tokenArgs.collectionId}`,
        `${sdk.options.baseUrl}/tokens?collectionId=${tokenArgs.collectionId}&tokenId=${parsed?.tokenId}`
      )
      return sdk.tokens.get({collectionId: tokenArgs.collectionId, tokenId: parsed.tokenId})
    } else {
      throw error ? error : new Error('Error when minting a token!')
    }
  }
}

async function main() {
  const signer = await getSinger(getConfig().mnemonic)
  const sdk = SDKFactories['opal' as keyof typeof SDKFactories](signer)

  // mint
  const collection = await createCollection(
    sdk,
    signer.getAddress(),
    {
      name: 'Live Air Quality Index',
      description:
        'Air pollution can have serious negative effects on human health. Collection tokens show real-time air quality index of different cities to draw attention to one of the most pressing environmental issues of our time.',
      tokenPrefix: 'AQI',
    },
    IMAGES.Cover
  )

  for (const city of CITIES) {
    const token = await mintToken(
      sdk,
      {
        address: signer.getAddress(),
        collectionId: collection.id,
      },
      city
    )
  }

  // console.log(token)
}

main().catch((error) => {
  console.error(error.response?.data || error)
})
