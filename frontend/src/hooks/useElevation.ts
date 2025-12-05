import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function useElevation() {
    const [elevation, setElevation] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth()

    const localization = user.user.locality;

    useEffect(() => {
        if (!localization) return;

        async function fetchElevation() {
            setLoading(true);
            setError(null);

            try {
                // 1) Geocoding z Open-Meteo (CORS OK)
                const geoRes = await fetch(
                    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
                        localization
                    )}&count=1`
                );

                const geoData = await geoRes.json();
                if (!geoData.results || !geoData.results[0]) {
                    throw new Error("Nie znaleziono lokalizacji");
                }

                const { latitude, longitude } = geoData.results[0];

                // 2) Wysokość z OpenElevation
                const elevRes = await fetch(
                    `https://api.open-elevation.com/api/v1/lookup?locations=${latitude},${longitude}`
                );

                const elevData = await elevRes.json();
                if (!elevData.results || !elevData.results[0]) {
                    throw new Error("Brak danych wysokości");
                }

                setElevation(elevData.results[0].elevation);
            } catch (err: any) {
                setError(err.message || "Błąd podczas pobierania danych");
                setElevation(null);
            } finally {
                setLoading(false);
            }
        }

        fetchElevation();
    }, [localization]);

    return { elevation, loading, error };
}
