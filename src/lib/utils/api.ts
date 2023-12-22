type HTTPRequestMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export async function fetchApi(
    url: string,
    method: HTTPRequestMethod,
    body: Record<string, unknown> | null = null
) {
    const response = await fetch(url, {
        method,
        ...body && { body: JSON.stringify(body) },
    });

    if (!response.ok) {
        const error = await response.json();
        return Promise.reject(error.message);
    }

    const contentType = response.headers.get('content-type');
    return contentType?.includes('application/json') ? response.json() : response.text();
}
