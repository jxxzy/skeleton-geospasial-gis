import {
    addGeoJSON,
    clearMap,
    createMap,
    fitMap,
    getGeoJSON,
    onMapClick
} from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/map.js";

const mapId = "map";
const routeDataUrl = "./data/rute-cimahi-bandung.geojson";
const fareSimulation = 10000;
const estimatedFarePerKilometer = 2000;
const fareRoundingStep = 1000;
const routeColors = [
    "#ed684c",
    "#2878b5",
    "#8a5ac2",
    "#d18b1f",
    "#168b78",
    "#c44e86",
    "#5672bd",
    "#8c7a32",
    "#467c4b",
    "#b64b3c"
];
const carRouteStyle = {
    stroke: "#ed684c",
    strokeWidth: 5,
    strokeOpacity: 0.95
};
const routeChoiceElement = document.getElementById("route-choice");
const randomRouteButton = document.getElementById("random-route");
const originNameElement = document.getElementById("origin-name");
const destinationNameElement = document.getElementById("destination-name");
const distanceElement = document.getElementById("route-distance");
const durationElement = document.getElementById("route-duration");
const vertexCountElement = document.getElementById("route-vertices");
const fareElement = document.getElementById("route-fare");
const routeNoteElement = document.getElementById("route-note");
const routeCountElement = document.getElementById("route-count");
const statusElement = document.getElementById("data-status");
const focusButton = document.getElementById("focus-route");
const overviewButton = document.getElementById("toggle-overview");

let routeData;
let selectedRoute;
let showingOverview = false;

createMap(mapId, { center: [107.58, -6.9], zoom: 12 });

function setStatus(message, isError = false) {
    statusElement.textContent = message;
    statusElement.dataset.state = isError ? "error" : "ready";
}

function formatDistance(meters) {
    return `${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(meters / 1000)} km`;
}

function formatRupiah(amount) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(amount);
}

function formatDuration(seconds) {
    const totalMinutes = Math.max(1, Math.round(seconds / 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0 ? `${hours} jam ${minutes} mnt` : `${totalMinutes} menit`;
}

function getCurrentRoute() {
    return routeData.features.find((feature) => feature.properties.id === routeChoiceElement.value);
}

function getRouteColor(routeId) {
    const index = routeData.features.findIndex((route) => route.properties.id === routeId);
    return routeColors[index] ?? carRouteStyle.stroke;
}

function createRouteMarkers(routes) {
    return {
        type: "FeatureCollection",
        features: routes.flatMap((route) => {
            const coordinates = route.geometry.coordinates;
            return [
                {
                    type: "Feature",
                    properties: { id: route.properties.id, marker_type: "origin", name: `Awal: ${route.properties.origin_name}` },
                    geometry: { type: "Point", coordinates: coordinates[0] }
                },
                {
                    type: "Feature",
                    properties: { id: route.properties.id, marker_type: "destination", name: `Tujuan: ${route.properties.destination_name}` },
                    geometry: { type: "Point", coordinates: coordinates[coordinates.length - 1] }
                }
            ];
        })
    };
}

function addRouteMarkers(route) {
    const markers = createRouteMarkers([route]);

    addGeoJSON(mapId, markers, {
        style: (feature) => feature.properties.marker_type === "origin"
            ? { fill: "#087e69", stroke: "#ffffff", strokeWidth: 3, radius: 7 }
            : { fill: "#ed684c", stroke: "#ffffff", strokeWidth: 3, radius: 7 }
    });
}

function setOverviewMode(isOverview) {
    showingOverview = isOverview;
    overviewButton.textContent = isOverview ? "Kembali ke rute pilihan" : "Lihat semua 10 rute";
    overviewButton.setAttribute("aria-pressed", String(isOverview));
}

function showAllRoutes() {
    clearMap(mapId);
    addGeoJSON(mapId, routeData, {
        style: (feature) => ({ stroke: getRouteColor(feature.properties.id), strokeWidth: 4, strokeOpacity: 0.85 }),
        popup: (feature) =>
            `${feature.properties.name} · ${formatDistance(feature.properties.distance_m)} · ${formatDuration(feature.properties.duration_s)}`
    });

    const markers = createRouteMarkers(routeData.features);
    addGeoJSON(mapId, markers, {
        style: (feature) => feature.properties.marker_type === "origin"
            ? { fill: "#087e69", stroke: "#ffffff", strokeWidth: 2, radius: 5 }
            : { fill: "#ed684c", stroke: "#ffffff", strokeWidth: 2, radius: 5 },
        popup: (feature) => feature.properties.name
    });
    setOverviewMode(true);
    setStatus("Menampilkan seluruh 10 rute; klik rute atau marker untuk memilih detail.");
    fitMap(mapId, routeData, 48);
}

function showSelectedRoute() {
    const route = getCurrentRoute();
    if (!route) {
        setStatus(`Rute dengan ID "${routeChoiceElement.value}" tidak ditemukan di GeoJSON.`, true);
        return;
    }
    selectedRoute = route;

    const { origin_name: originName, destination_name: destinationName, distance_m: distance } = selectedRoute.properties;
    const roundedDistanceFare = Math.ceil(
        ((distance / 1000) * estimatedFarePerKilometer) / fareRoundingStep
    ) * fareRoundingStep;
    const estimatedFare = Math.max(fareSimulation, roundedDistanceFare);
    clearMap(mapId);
    addGeoJSON(mapId, selectedRoute, {
        style: { ...carRouteStyle, stroke: getRouteColor(selectedRoute.properties.id) },
        popup: (feature) => `${feature.properties.name} · ${formatDistance(feature.properties.distance_m)} · ${formatDuration(feature.properties.duration_s)}`
    });
    addRouteMarkers(selectedRoute);
    setOverviewMode(false);

    originNameElement.textContent = originName;
    destinationNameElement.textContent = destinationName;
    distanceElement.textContent = formatDistance(distance);
    durationElement.textContent = formatDuration(selectedRoute.properties.duration_s);
    vertexCountElement.textContent = selectedRoute.properties.vertex_count.toLocaleString("id-ID");
    fareElement.textContent = formatRupiah(estimatedFare);
    routeNoteElement.textContent =
        `Estimasi ilustrasi: minimum ${formatRupiah(fareSimulation)}, ${formatRupiah(estimatedFarePerKilometer)}/km dibulatkan ke atas per ${formatRupiah(fareRoundingStep)}. Bukan harga resmi GoCar; cek tarif di aplikasi Gojek.`;
    fitMap(mapId, selectedRoute, 48);
    setStatus(`Menampilkan rute ${routeChoiceElement.selectedOptions[0].text} dari ${originName}.`);
}

overviewButton.addEventListener("click", () => {
    if (!routeData) {
        return;
    }

    if (showingOverview) {
        showSelectedRoute();
    } else {
        showAllRoutes();
    }
});

randomRouteButton.addEventListener("click", () => {
    if (!routeData || routeData.features.length < 2) {
        return;
    }

    const otherRoutes = routeData.features.filter(
        (feature) => feature.properties.id !== routeChoiceElement.value
    );
    const randomRoute = otherRoutes[Math.floor(Math.random() * otherRoutes.length)];
    routeChoiceElement.value = randomRoute.properties.id;
    showSelectedRoute();
});

routeChoiceElement.addEventListener("change", showSelectedRoute);
focusButton.addEventListener("click", () => {
    if (selectedRoute) {
        fitMap(mapId, showingOverview ? routeData : selectedRoute, 48);
    }
});

onMapClick(mapId, (_position, feature) => {
    const clickedRouteId = feature?.properties?.id;
    if (typeof clickedRouteId !== "string" || !routeData?.features.some((route) => route.properties.id === clickedRouteId)) {
        return;
    }

    if (routeChoiceElement.value !== clickedRouteId || showingOverview) {
        routeChoiceElement.value = clickedRouteId;
        showSelectedRoute();
    }
});

getGeoJSON(routeDataUrl, (response) => {
    if (!response.data) {
        setStatus(
            `GeoJSON rute gagal dimuat (status ${response.status}). Jalankan halaman melalui server web dan pastikan file data tersedia.`,
            true
        );
        routeCountElement.textContent = "Data rute tidak tersedia";
        return;
    }

    const routeFeatures = response.data.features.filter((feature) =>
        feature.geometry.type === "LineString"
        && typeof feature.properties.id === "string"
        && Array.isArray(feature.geometry.coordinates)
        && feature.geometry.coordinates.length >= 10
        && Number.isFinite(feature.properties.distance_m)
        && Number.isFinite(feature.properties.duration_s)
        && Number.isInteger(feature.properties.vertex_count)
        && feature.properties.vertex_count === feature.geometry.coordinates.length
    );
    if (routeFeatures.length < 10) {
        setStatus(`GeoJSON hanya berisi ${routeFeatures.length} polyline valid; dibutuhkan setidaknya 10 rute dengan masing-masing minimal 1.000 titik.`, true);
        routeCountElement.textContent = `${routeFeatures.length} rute ditemukan`;
        return;
    }

    routeData = {
        ...response.data,
        features: routeFeatures
    };
    randomRouteButton.disabled = false;
    overviewButton.disabled = false;

    const routeIds = new Set(routeFeatures.map((feature) => feature.properties.id));
    const optionsMatchData = [...routeChoiceElement.options].every((option) => routeIds.has(option.value));
    if (!optionsMatchData) {
        setStatus("Daftar pilihan HTML tidak cocok dengan ID rute pada GeoJSON.", true);
        return;
    }

    const vertexCount = routeFeatures.reduce((sum, feature) => sum + feature.geometry.coordinates.length, 0);
    routeCountElement.textContent = `${routeFeatures.length} rute · ${vertexCount.toLocaleString("id-ID")} titik polyline`;
    showSelectedRoute();
    const totalVertices = routeFeatures.reduce((sum, feature) => sum + feature.properties.vertex_count, 0);
    setStatus(`${routeFeatures.length} rute jalan berhasil dimuat dengan ${totalVertices.toLocaleString("id-ID")} titik polyline.`);
});
