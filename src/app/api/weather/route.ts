import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        let lat = searchParams.get('lat');
        let lon = searchParams.get('lon');
        let city = '';

        // If no lat/lon from browser, fallback to IP-based location
        if (!lat || !lon) {
            const geoRes = await fetch('http://ip-api.com/json/?fields=lat,lon,city', {
                signal: AbortSignal.timeout(4000),
            });
            const geo = await geoRes.json();
            lat = String(geo.lat || 28.6);
            lon = String(geo.lon || 77.2);
            city = geo.city || '';
        }

        // Get city name from lat/lon using reverse geocoding (if browser location used)
        if (!city) {
            try {
                const revGeoRes = await fetch(
                    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
                    { signal: AbortSignal.timeout(3000) }
                );
                const revGeo = await revGeoRes.json();
                city = revGeo.city || revGeo.locality || '';
            } catch { /* ignore */ }
        }

        // Get weather from Open-Meteo (100% free, no API key)
        const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`,
            { signal: AbortSignal.timeout(4000) }
        );
        const weather = await weatherRes.json();
        const current = weather.current;

        return NextResponse.json({
            temp: current?.temperature_2m != null ? Math.round(current.temperature_2m) : null,
            code: current?.weather_code ?? 1,
            city: city,
        });
    } catch {
        return NextResponse.json({ temp: null, code: 1, city: '' });
    }
}
