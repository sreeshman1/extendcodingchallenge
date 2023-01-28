import fetch from 'node-fetch'
import { Breeds, convertBreedsIntoBreedList, handler } from './breeds-get'

const mockedFetch: jest.Mock = fetch as any

jest.mock('node-fetch')

const mockBreeds: Record<string, string[]> = {
  bulldog: ['boston', 'english', 'french'],
  poodle: [],
}
const mockPayload: Breeds = {
  message: mockBreeds,
  status: '200',
}
const mockBreedList = ['boston bulldog', 'english bulldog', 'french bulldog', 'poodle']

describe('breeds-get convertBreedstoBreedList', () => {
  it('converts a record of breeds into a flat array', () => {
    const breedList = convertBreedsIntoBreedList(mockBreeds)
    expect(breedList).toEqual(mockBreedList)
  })
})

describe('breeds-get handler', () => {
  it('returns the correct payload for a succesful fetch request', async () => {
    mockedFetch.mockReturnValueOnce({
      json: () => {
        return mockPayload
      },
    })
    const response = await handler()
    expect(response).toMatchObject({ body: mockBreedList, statusCode: 200 })
  })

  it('returns an error message for a failed fetch request', async () => {
    mockedFetch.mockReturnValueOnce({})
    await expect(handler()).resolves.toEqual({ message: 'Something went wrong', statusCode: 500 })
  })

  it('handles a timeout on the call to the external api', async () => {
    mockedFetch.mockReturnValueOnce(
      new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              json: () => {
                return mockPayload
              },
            }),
          6000,
        ),
      ),
    )
    await expect(handler()).resolves.toEqual({ message: 'Request Timed Out', statusCode: 504 })
  })
})
