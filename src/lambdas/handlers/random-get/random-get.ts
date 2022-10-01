import fetch from 'node-fetch'
import { ErrorResponse, Response } from '../../constants/types'

interface RandomResponse extends Response {
  body: RandomDog
}

interface RandomDog {
  message: string
  status: string
}

export async function handler(): Promise<RandomResponse | ErrorResponse> {
  try {
    const res = await fetch('https://dog.ceo/api/breeds/image/random')
    const payload: RandomDog = await res.json()
    return {
      statusCode: 200,
      body: payload,
    }
  } catch (err: unknown) {
    console.log(err)
    return {
      statusCode: 500,
      message: `Something went wrong ${err}`,
    }
  }
}
