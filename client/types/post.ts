import { CategoryList } from './../../server/src/post/types';
import { OutputBlockData, OutputData } from '@editorjs/editorjs';

export interface CreatePostDto {
	title: string;
	body: OutputData['blocks'];
	category: CategoryList;
}
export interface UpdatePostDto {
	title: string;
	body: OutputData['blocks'];
	category: CategoryList;
}

export interface ResponsePostUser {
	id: number;
	email: string;
	createdAt: string;
	picture: string;
	nickName: string;
}

export interface EditorData {
	id?: string;
	type?: string;
	data?: any;
}
export interface IPost {
	id: number;
	title: string;
	body: OutputData['blocks'];
	description: OutputBlockData;
	category: CategoryList;
	views: number;
	user: ResponsePostUser;
	tags: null | string;
	createdAt: string;
	updatedAt: string;
	commentsCount?: number;
	ratingCount?: number;
}

export interface IPostProfile {
	id: number;
	title: string;
	body: OutputData['blocks'];
	description: OutputBlockData;
	category: CategoryList;
	views: number;
	createdAt: string;
	updatedAt: string;
	commentsCount?: number;
	ratingCount?: number;
}

export interface SearchPostDto {
	title?: string;
	body?: string;
	description?: string;
	views?: 'DESC' | 'ASC';
	tags?: string;
	take?: number;
	skip?: number;
	tag?: string;
	lastPostId?: number;
	firstPostId?: number;
}

export interface PostState {
	allPosts: IPost[] | [];
	allPostsTotal: number;
	searchPosts: IPost[] | [];
	searchPostsTotal: number;

	searchPagePosts: IPost[] | [];
	searchPagePostsTotal: number;
	searchPagePostsLeft: number;

	userPosts: IPost[] | [];
	userPostsTotal: number;
	postsOnPage: IPost[] | [];
	postsLeft: number;
	postsInCategory: IPost[] | [];
	postsInCategoryLeft: number;
	postsInCategoryTotal: number;
	postsInBookmarks: IPost[] | [];
	postsInBookmarksLeft: number;
	postsInBookmarksTotal: number;
	fullPost: IPost;
}

export enum PostActionTypes {
	SET_POST_DATA = 'SET_POST_DATA',
	SET_POST_TOTAL_DATA = 'SET_POST_TOTAL_DATA',

	SET_SEARCH_POST_DATA = 'SET_SEARCH_POST_DATA',
	SET_SEARCH_POST_TOTAL_DATA = 'SET_SEARCH_POST_TOTAL_DATA',

	SET_SEARCH_PAGE_POST_DATA = 'SET_SEARCH_PAGE_POST_DATA',
	SET_SEARCH_PAGE_POST_TOTAL_DATA = 'SET_SEARCH_PAGE_POST_TOTAL_DATA',
	SET_SEARCH_PAGE_POST_LEFT_DATA = 'SET_SEARCH_PAGE_POST_LEFT_DATA',

	SET_USER_POST_DATA = 'SET_USER_POST_DATA',
	SET_USER_POST_TOTAL_DATA = 'SET_USER_POST_TOTAL_DATA',

	SET_POST_ON_PAGE_DATA = 'SET_POST_ON_PAGE_DATA',
	SET_POST_ON_PAGE_DATA_TOTAL = 'SET_POST_ON_PAGE_DATA_TOTAL',

	SET_POST_IN_CATEGORY_DATA = 'SET_POST_IN_CATEGORY_DATA',
	SET_POST_IN_CATEGORY_DATA_TOTAL = 'SET_POST_IN_CATEGORY_DATA_TOTAL',
	SET_POST_IN_CATEGORY_DATA_TOTAL_All = 'SET_POST_IN_CATEGORY_DATA_TOTAL_All',

	SET_POST_IN_BOOKMARKS_DATA = 'SET_POST_IN_BOOKMARKS_DATA',
	SET_POST_IN_BOOKMARKS_DATA_LEFT = 'SET_POST_IN_BOOKMARKS_DATA_LEFT',
	SET_POST_IN_BOOKMARKS_DATA_TOTAL = 'SET_POST_IN_BOOKMARKS_DATA_TOTAL',

	SET_FULL_POST = 'SET_FULL_POST',
}

interface SetPostDataAction {
	type: PostActionTypes.SET_POST_DATA;
	payload: IPost[] | [];
}
interface SetPostTotalDataAction {
	type: PostActionTypes.SET_POST_TOTAL_DATA;
	payload: number;
}
interface SetSearchPostDataAction {
	type: PostActionTypes.SET_SEARCH_POST_DATA;
	payload: IPost[] | [];
}
interface SetSearchPostTotalDataAction {
	type: PostActionTypes.SET_SEARCH_POST_TOTAL_DATA;
	payload: number;
}
interface SetSearchPagePostDataAction {
	type: PostActionTypes.SET_SEARCH_PAGE_POST_DATA;
	payload: IPost[] | [];
}
interface SetSearchPagePostTotalDataAction {
	type: PostActionTypes.SET_SEARCH_PAGE_POST_TOTAL_DATA;
	payload: number;
}
interface SetSearchPagePostLeftDataAction {
	type: PostActionTypes.SET_SEARCH_PAGE_POST_LEFT_DATA;
	payload: number;
}
interface SetUserPostDataAction {
	type: PostActionTypes.SET_USER_POST_DATA;
	payload: IPost[] | [];
}
interface SetUserPostTotalDataAction {
	type: PostActionTypes.SET_USER_POST_TOTAL_DATA;
	payload: number;
}
interface SetPostOnPageDataAction {
	type: PostActionTypes.SET_POST_ON_PAGE_DATA;
	payload: IPost[] | [];
}
interface SetPostLeftTotalDataAction {
	type: PostActionTypes.SET_POST_ON_PAGE_DATA_TOTAL;
	payload: number;
}
interface SetPostInCategoryDataAction {
	type: PostActionTypes.SET_POST_IN_CATEGORY_DATA;
	payload: IPost[] | [];
}
interface SetPostInCategoryTotalDataAction {
	type: PostActionTypes.SET_POST_IN_CATEGORY_DATA_TOTAL;
	payload: number;
}
interface SetPostInCategoryTotalAllDataAction {
	type: PostActionTypes.SET_POST_IN_CATEGORY_DATA_TOTAL_All;
	payload: number;
}

interface SetPostInBookmarksDataAction {
	type: PostActionTypes.SET_POST_IN_BOOKMARKS_DATA;
	payload: IPost[] | [];
}
interface SetPostInBookmarksTotalDataAction {
	type: PostActionTypes.SET_POST_IN_BOOKMARKS_DATA_TOTAL;
	payload: number;
}
interface SetPostInBookmarksLeftDataAction {
	type: PostActionTypes.SET_POST_IN_BOOKMARKS_DATA_LEFT;
	payload: number;
}

interface SetFullPostData {
	type: PostActionTypes.SET_FULL_POST;
	payload: IPost;
}

export type PostAction =
	| SetPostDataAction
	| SetPostTotalDataAction
	| SetSearchPostTotalDataAction
	| SetSearchPostDataAction
	| SetUserPostDataAction
	| SetUserPostTotalDataAction
	| SetPostOnPageDataAction
	| SetPostLeftTotalDataAction
	| SetPostInCategoryDataAction
	| SetPostInCategoryTotalDataAction
	| SetPostInCategoryTotalAllDataAction
	| SetPostInBookmarksDataAction
	| SetPostInBookmarksTotalDataAction
	| SetPostInBookmarksLeftDataAction
	| SetFullPostData
	| SetSearchPagePostDataAction
	| SetSearchPagePostTotalDataAction
	| SetSearchPagePostLeftDataAction;
