export const formatDate = (str: string) => {
	const newFormat = str.split('T')[0].split('-');
	const year = newFormat[0];
	const month = newFormat[1];
	const day = newFormat[2];

	return { year, month, day ,newFormat};
};
