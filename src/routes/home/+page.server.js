export async function load({ parent }) {
	const { all } = await parent();
	return { all };
}