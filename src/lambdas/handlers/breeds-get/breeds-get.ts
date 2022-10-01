import { ErrorResponse, Response } from '../../constants/types'
import fetchWithTimeout from '../../helpers/helpers'

interface BreedsResponse extends Response {
  body: string[]
}

export interface Breeds {
  message: Record<string, string[]>
  status: string
}


export const convertBreedsIntoBreedList = (breeds: Record<string, string[]>): string[] => {
  const result: string[] = []
  const breedEntries = Object.entries(breeds)
  for (let i = 0; i < breedEntries.length; i += 1) {
    const [breed, subBreeds] = breedEntries[i]
    if (subBreeds.length === 0) {
      result.push(breed)
    } else {
      subBreeds.forEach((subBreed) => {
        result.push(`${subBreed} ${breed}`)
      })
    }
  }
  return result
}

export async function handler(): Promise<BreedsResponse | ErrorResponse> {
  try {
    const res = await fetchWithTimeout('https://dog.ceo/api/breeds/list/all', 5000)
    const payload: Breeds = await res.json()
    const breedList = convertBreedsIntoBreedList(payload.message)
    return {
      statusCode: 200,
      body: breedList,
    }
  } catch (err: unknown) {
    return {
      statusCode: 500,
      message: 'Something went wrong',
    }
  }
}
