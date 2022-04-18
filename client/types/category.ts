export interface ICategory {
	category: CategoryList;
}
export interface CategoryList {
	id: number;
	title: string;
	slug: string;
	description: string;
	image: string;
}

export const categories: CategoryList[] = [
	{
		id: 0,
		title: 'Прочее',
		slug: 'other',
		description: 'Все стать на разные темы',
		image: '/categoryLogo/logo0.jpg',
	},
	{
		id: 1,
		title: 'Музыка',
		slug: 'music',
		description: 'Описание категории',
		image: '/categoryLogo/logo1.jpg',
	},
	{
		id: 2,
		title: 'Фильмы',
		slug: 'cinema',
		description: 'Описание категории',
		image: '/categoryLogo/logo2.jpg',
	},
];
