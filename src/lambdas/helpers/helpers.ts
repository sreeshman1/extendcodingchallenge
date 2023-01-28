import fetch, { Response } from 'node-fetch'

export default function fetchWithTimeout(url: string, timeout = 7000): Promise<Response | Error> {
  return Promise.race([
    fetch(url),
    new Promise<Error>((_, reject) =>
      setTimeout(() => reject(new Error('Request Timed Out')), timeout),
    ),
  ])
}
