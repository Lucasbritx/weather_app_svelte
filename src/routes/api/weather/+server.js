import { WEATHER_API_KEY } from '$env/static/private';

/** @type {import('../$types').RequestHandler} */
export async function GET({ url }) {
    const locationQuery = url.searchParams.get('q') || '';
    const lat = url.searchParams.get('lat') || '';
    const lon = url.searchParams.get('lon') || '';

    const filter = locationQuery || `${lat},${lon}`;

    const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${filter}&aqi=yes`;

    try {
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!res.ok) {
            return new Response(JSON.stringify({ error: data.error.message }), { status: res.status });
        }

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Erro ao buscar os dados' }), { status: 500 });
    }
}