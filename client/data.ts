export const data = {
	comments: {
		popular: [
			{
				id: 1,
				user: {
					id: 1,
					fullname: 'User1',
					avatarUrl: '/userAvatar.jpg',
				},
				text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo, nesciunt.',
				post: {
					id: 1,
					title: 'Lorem ipsum dolor sit',
				},
				createdAt: '01/01/2021',
			},
			{
				id: 2,
				user: {
					id: 2,
					fullname: 'User2',
					avatarUrl: '/userAvatar.jpg',
				},
				text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo, nesciunt.',
				post: {
					id: 1,
					title: 'Lorem ipsum dolor sit',
				},
				createdAt: '01/01/2021',
			},
		],
		new: [
			{
				id: 1,
				user: {
					id: 3,
					fullname: 'User3',
					avatarUrl: '/userAvatar.jpg',
				},
				text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo, nesciunt.',
				post: {
					id: 1,
					title: 'Lorem ipsum dolor sit',
				},
				createdAt: '01/01/2021',
			},
		],
	},
};
