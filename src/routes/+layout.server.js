import { getAll } from '#lib/server/database.js';

export function load() {
	const all = getAll();
	return {
		all,
		pins: all
			.filter(
				(restaurant) =>
					restaurant.listing_status === 'published' &&
					restaurant.latitude !== null &&
					restaurant.longitude !== null
			)
			.map(({ latitude, longitude }) => ({ latitude, longitude }))
	};
}
