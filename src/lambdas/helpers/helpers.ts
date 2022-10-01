import fetch from 'node-fetch'

export default function fetchWithTimeout(url: string, timeout = 7000): Promise<any> {
    return Promise.race([
        fetch(url),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request Timed Out')), timeout)
        )
    ]);
}