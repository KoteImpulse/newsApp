import { CommentApi } from './comment';
import { GetServerSidePropsContext, NextPageContext } from 'next';
import { UserApi } from './user';
import axios from 'axios';
import { PostApi } from './post';

export type ApiReturnType = {
	user: ReturnType<typeof UserApi>;
	post: ReturnType<typeof PostApi>;
	comment: ReturnType<typeof CommentApi>;
};

export const takeAllPosts = 10;
export const takePostsInUser = 10;
export const takePostsInCategory = 10;
export const takePostsForSearchPage = 10;
export const takeCommentsInUser = 8;
export const takeCommentsInPost = 8;

export const baseUrl = 'http://localhost:5000/';
export const clientUrl = 'http://localhost:3000/';
export const allUrls = {
	register: 'auth/registration',
	login: 'auth/login',
	logout: 'auth/logout',
	refresh: 'auth/refresh',
	posts: 'post',
	findOnePost: 'post/find',
	postsPag: 'post/p/all',
	postsUploadImage: 'post/uploadImageForPost',
	postsInUser: 'post/user',
	postsInCategory: 'post/category/',
	search: 'post/search',
	comments: 'comment',
	commentsAll: 'comment/all',
	commentsPost: 'comment/post',
	commentsUser: 'comment/user',
	profile: 'user/profile',
	changeProfilePicture: 'user/change/profileAvatar/',
	changeProfilePictureDefault: 'user/change/profileAvatarDefault/',
	changeProfileNickname: 'user/change/profileNickname/',
	changeProfileOptions: 'user/change/profileOptions/',
	setBookmark: 'user/set/bookmarks',
	getBookmark: 'user/get/bookmarks',
	users: 'user',
	sendLink: 'mail/resendLink',
	setLike: 'rating/setLike',
	subscribe: 'subscription/subscribe'
};

export const Api = (
	ctx?: NextPageContext | GetServerSidePropsContext
): ApiReturnType => {
	const headers = ctx?.req?.headers.cookie
		? { Cookie: ctx?.req?.headers.cookie }
		: undefined;

	const instance = axios.create({
		baseURL: baseUrl,
		withCredentials: true,
		headers: headers,
	});

	instance.interceptors.response.use(
		(config: any) => {
			return config;
		},
		async (error) => {
			const originalRequest = error.config;
			if (
				error.response.status == 401 &&
				error.config &&
				!error.config._isRetry
			) {
				originalRequest._isRetry = true;
				try {
					const response = await axios.get(
						baseUrl + allUrls.refresh,
						{ withCredentials: true }
					);
					return instance.request(originalRequest);
				} catch (e: any) {
					console.log(e?.response?.data.message);
				}
			}
			throw error;
		}
	);

	return {
		user: UserApi(instance),
		post: PostApi(instance),
		comment: CommentApi(instance),
	};
};
