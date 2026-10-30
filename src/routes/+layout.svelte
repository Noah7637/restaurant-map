<script>
	import { onMount } from 'svelte';
	import favicon from '#lib/assets/favicon.svg';
	import '#lib/leaflet/dist/leaflet.css';
	import '#lib/style.css';
	import SearchBar from '#lib/components/searchBar.svelte';


	/** @type {{children: import('svelte').Snippet; data: {pins: Array<{latitude: number; longitude: number}>}}} */
	let { children, data } = $props();

	/** @type {((latitude: number, longitude: number, pins: Array<{latitude: number; longitude: number}>) => void) | undefined} */
	let updateMap;
	/** @type {(() => void) | undefined} */
	let resetMap;

	/**
	 * @param {number} latitude1
	 * @param {number} longitude1
	 * @param {number} latitude2
	 * @param {number} longitude2
	 */
	function distanceInMeters(latitude1, longitude1, latitude2, longitude2) {
		const earthRadius = 6_371_000;
		/** @param {number} degrees */
		const toRadians = (degrees) => (degrees * Math.PI) / 180;
		const latitudeDelta = toRadians(latitude2 - latitude1);
		const longitudeDelta = toRadians(longitude2 - longitude1);
		const haversine =
			Math.sin(latitudeDelta / 2) ** 2 +
			Math.cos(toRadians(latitude1)) *
				Math.cos(toRadians(latitude2)) *
				Math.sin(longitudeDelta / 2) ** 2;

		return 2 * earthRadius * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
	}

	/** @param {{latitude: number; longitude: number}} location */
	function showNearbyRestaurants(location) {
		const { latitude, longitude } = location;
		if (!updateMap) {
			throw new Error("La carte n’est pas encore prête. Réessayez dans un instant.");
		}

		const nearbyPins = data.pins.filter(
			(pin) => distanceInMeters(latitude, longitude, pin.latitude, pin.longitude) <= 1000
		);

		updateMap(latitude, longitude, nearbyPins);

		return nearbyPins.length;
	}

	function showAllRestaurants() {
		if (!resetMap) {
			throw new Error("La carte n’est pas encore prête. Réessayez dans un instant.");
		}

		resetMap();
	}

	onMount(() => {
		let disposed = false;
		let cleanup = () => {};

		import('#lib/leaflet/dist/leaflet-src.esm.js').then((L) => {
			if (disposed) return;

			const map = L.map('map').setView([51.505, -0.09], 13);

			L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 19,
				attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
			}).addTo(map);

			const restaurantIcon = L.divIcon({
				className: 'restaurant-marker',
				html: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="52" viewBox="0 0 40 52" aria-hidden="true"><path d="M20 2C9.5 2 2 9.8 2 20.1 2 32.2 20 50 20 50s18-17.8 18-29.9C38 9.8 30.5 2 20 2Z" fill="#3e6b48" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><circle cx="20" cy="20" r="5" fill="#fff"/></svg>',
				iconSize: [40, 52],
				iconAnchor: [20, 50]
			});
			const restaurantMarkers = L.layerGroup().addTo(map);
			data.pins.forEach(({ latitude, longitude }) => {
				restaurantMarkers.addLayer(L.marker([latitude, longitude], { icon: restaurantIcon }));
			});
			const searchOverlays = L.layerGroup().addTo(map);
			updateMap = (latitude, longitude, pins) => {
				restaurantMarkers.clearLayers();
				pins.forEach(({ latitude: pinLatitude, longitude: pinLongitude }) => {
					restaurantMarkers.addLayer(
						L.marker([pinLatitude, pinLongitude], { icon: restaurantIcon })
					);
				});
				searchOverlays.clearLayers();
				searchOverlays.addLayer(
					L.circle([latitude, longitude], {
						radius: 1000,
						color: '#3e6b48',
						weight: 2,
						fillColor: '#3e6b48',
						fillOpacity: 0.08
					})
				);
				searchOverlays.addLayer(
					L.circleMarker([latitude, longitude], {
						radius: 6,
						color: '#fff',
						weight: 2,
						fillColor: '#3e6b48',
						fillOpacity: 1
					})
				);
				map.flyTo([latitude, longitude], 15);
			};
			resetMap = () => {
				restaurantMarkers.clearLayers();
				data.pins.forEach(({ latitude, longitude }) => {
					restaurantMarkers.addLayer(
						L.marker([latitude, longitude], { icon: restaurantIcon })
					);
				});
				searchOverlays.clearLayers();
				map.flyTo([51.505, -0.09], 13);
			};

			var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);
			cleanup = () => map.remove();
		});

		

		return () => {
			disposed = true;
			cleanup();
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div id="map"></div>


<SearchBar onLocationFound={showNearbyRestaurants} onReset={showAllRestaurants} />


{@render children()}
