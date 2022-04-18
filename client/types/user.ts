// import { IPost } from './../../server/dist/client/types/post.d';
import { ICommentProfile } from './comment';
import { IPost, IPostProfile } from './post';
import { IOption } from './userOptions';

export interface UpdateUserDto {
	nickName: string;
	a?: string;
	b?: string;
}

export enum RolesForUsers {
	ADMIN = 'ADMIN',
	MODERATOR = 'MODERATOR',
	USER = 'USER',
	GHOST = 'GHOST',
}

export enum PostPermission {
	CREATEPOST = 'CREATEPOST',
	DELETEPOST = 'DELETEPOST',
	EDITPOST = 'EDITPOST',
}

export enum CommentPermission {
	CREATECOMMENT = 'CREATECOMMENT',
	DELETECOMMENT = 'DELETECOMMENT',
	EDITCOMMENT = 'EDITCOMMENT',
}

export enum UserPermission {
	GIVEROLE = 'GIVEROLE',
	CHANGEPROFILEOPTIONS = 'CHANGEPROFILEOPTIONS',
}

export const Permission = {
	...PostPermission,
	...CommentPermission,
	...UserPermission,
};

type Permission = PostPermission | CommentPermission | UserPermission;

export interface IRating {
	id: number;
	post: IPost;
}
export interface IRatingPost {
	id: number;
	createdAt: string;
	rating: boolean;
	updatedAt: string;
}
export interface AllUserPost {
	id: number;
	ratingCount: number;
	rating: IRatingPost[];
}
export interface IUserSub {
	id: number;
	picture: string;
	nickName: string;
}
export interface ISubscription {
	id: number;
	subscription: IUserSub;
	createdAt: string;
	updatedAt: string;
}
export interface IUserLogin {
	id: number;
	nickName: string;
	picture: string;
	role: RolesForUsers;
	permissions: Permission[];
	createdAt: string;
	updatedAt: string;
	bookmarks: number[];
	rating: IRating[];
	subscriptions: ISubscription[];
}
export interface IUser {
	id: number;
	isActivated?: boolean;
	nickName: string;
	picture: string;
	role: RolesForUsers;
	permissions: Permission[];
	createdAt: string;
	updatedAt: string;
	option: IOption;
	bookmarks: number[];
	rating: IRating[];
	subscriptions: ISubscription[];
}
export interface IUserProfile {
	id: number;
	nickName: string;
	picture: string;
	createdAt: string;
	updatedAt: string;
	option: IOption;
	subscriptions: ISubscription[];
}

export interface IUserAll {
	id: number;
	picture: string;
	nickName: string;
	createdAt: string;
	commentsCount?: number;
	post: AllUserPost[];
	rating: number;
}

export interface UserResponse {
	user: IUser;
}

export interface UserState {
	userInfo: IUser | null;
	bookmarks: number[];
	usersRating: IUserAll[];
	userSubscriptions: ISubscription[];
}

export enum UserActionTypes {
	SET_USER_DATA = 'SET_USER_DATA',
	SET_USERS_RATING = 'SET_USERS_RATING',
	SET_USER_BOOKMARKS = 'SET_USER_BOOKMARKS',
	SET_USER_SUBSCRIPTIONS = 'SET_USER_SUBSCRIPTIONS',
}

interface SetUserDataAction {
	type: UserActionTypes.SET_USER_DATA;
	payload: IUser | null;
}
interface SetUsersRatingAction {
	type: UserActionTypes.SET_USERS_RATING;
	payload: IUserAll[] | [];
}
interface SetUserBookmarksAction {
	type: UserActionTypes.SET_USER_BOOKMARKS;
	payload: number[];
}

interface SetUsersSubscriptionsAction {
	type: UserActionTypes.SET_USER_SUBSCRIPTIONS;
	payload: ISubscription[] | [];
}

export type UserAction =
	| SetUserDataAction
	| SetUserBookmarksAction
	| SetUsersRatingAction
	| SetUsersSubscriptionsAction;
