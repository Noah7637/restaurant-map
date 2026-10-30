import { json } from "@sveltejs/kit";

let lastRequestAt = 0;

export async function GET({ url, fetch }) {
    const query = url.searchParams.get("q")?.trim();

    if (!query) {
        return json({ message: "Saisissez une adresse à rechercher." }, { status: 400 });
    }

    if (query.length > 200) {
        return json({ message: "L’adresse recherchée est trop longue." }, { status: 400 });
    }

    const elapsed = Date.now() - lastRequestAt;

    if (elapsed < 1000) {
        return json(
            { message: "Veuillez patienter une seconde avant une nouvelle recherche." },
            { status: 429, headers: { "Retry-After": "1" } }
        );
    }

    lastRequestAt = Date.now();

    const endpoint = new URL("https://nominatim.openstreetmap.org/search");
    endpoint.searchParams.set("q", query);
    endpoint.searchParams.set("format", "jsonv2");
    endpoint.searchParams.set("limit", "1");

    let response;
    try {
        response = await fetch(endpoint, {
            headers: {
                "Accept": "application/json",
                "User-Agent": "restaurant-map/0.0.1"
            }
        });
    } catch {
        return json(
            { message: "Le service de recherche d’adresses est indisponible." },
            { status: 502 }
        );
    }

    if (!response.ok) {
        return json(
            { message: "Le service de recherche d’adresses a renvoyé une erreur." },
            { status: 502 }
        );
    }

    let results;
    try {
        results = await response.json();
    } catch {
        return json(
            { message: "La réponse du service de recherche d’adresses est invalide." },
            { status: 502 }
        );
    }

    if (!Array.isArray(results)) {
        return json(
            { message: "La réponse du service de recherche d’adresses est invalide." },
            { status: 502 }
        );
    }

    if (results.length === 0) {
        return json({ message: "Aucune adresse correspondante n’a été trouvée." }, { status: 404 });
    }

    if (
        typeof results[0]?.lat !== "string" ||
        typeof results[0]?.lon !== "string"
    ) {
        return json(
            { message: "La réponse du service de recherche d’adresses est invalide." },
            { status: 502 }
        );
    }

    const latitude = Number(results[0].lat);
    const longitude = Number(results[0].lon);

    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
    ) {
        return json(
            { message: "La réponse du service de recherche d’adresses est invalide." },
            { status: 502 }
        );
    }

    return json({ latitude, longitude });
}
