export const formatComment = (
	str: string,
	maxCount?: number,
	slice?: number
) => {
	return str.length > (maxCount || 0)
		? str.slice(0, slice || 50).concat('...')
		: str;
};
