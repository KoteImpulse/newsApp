import { OutputData } from '@editorjs/editorjs';

export interface CreateCommentDto {
	postId: number;
	text: string;
}
export interface UpdateCommentDto {
	text: string;
}

export interface ResponseComments {
	comments: IComment[];
	total: number;
}
export interface ResponseCommentUser {
	id: number;
	email: string;
	createdAt: string;
	picture: string;
	nickName: string;
}
export interface ResponseCommentPost {
	id: number;
	title: string;
}
export interface IComment {
	id: number;
	text: string;
	user: ResponseCommentUser;
	post: ResponseCommentPost;
	createdAt: string;
	updatedAt: string;
}

export interface ICommentProfile {
	id: number;
	text: string;
	createdAt: string;
}

export interface CommentState {
	allComments: IComment[] | [];
	postComments: IComment[] | [];
	postCommentsLeft: number;
	postCommentsTotal: number;
	userComments: IComment[] | [];
	userCommentsTotal: number;
	userCommentsLeft: number;
}

export enum CommentActionTypes {
	SET_COMMENT_DATA = 'SET_COMMENT_DATA',
	SET_POST_COMMENT_DATA = 'SET_POST_COMMENT_DATA',
	SET_POST_COMMENT_DATA_TOTAL = 'SET_POST_COMMENT_DATA_TOTAL',
	SET_POST_COMMENT_DATA_LEFT = 'SET_POST_COMMENT_DATA_LEFT',
	SET_USER_COMMENT_DATA = 'SET_USER_COMMENT_DATA',
	SET_USER_COMMENT_DATA_TOTAL = 'SET_USER_COMMENT_DATA_TOTAL',
	SET_USER_COMMENT_DATA_LEFT = 'SET_USER_COMMENT_DATA_LEFT',
}

interface SetCommentDataAction {
	type: CommentActionTypes.SET_COMMENT_DATA;
	payload: IComment[] | [];
}
interface SetPostCommentDataAction {
	type: CommentActionTypes.SET_POST_COMMENT_DATA;
	payload: IComment[] | [];
}
interface SetPostCommentTotalAction {
	type: CommentActionTypes.SET_POST_COMMENT_DATA_TOTAL;
	payload: number;
}
interface SetUserCommentDataAction {
	type: CommentActionTypes.SET_USER_COMMENT_DATA;
	payload: IComment[] | [];
}
interface SetUserCommentTotalAction {
	type: CommentActionTypes.SET_USER_COMMENT_DATA_TOTAL;
	payload: number;
}
interface SetUserCommentLeftAction {
	type: CommentActionTypes.SET_USER_COMMENT_DATA_LEFT;
	payload: number;
}
interface SetPostCommentLeftAction {
	type: CommentActionTypes.SET_POST_COMMENT_DATA_LEFT;
	payload: number;
}

export type CommentAction =
	| SetCommentDataAction
	| SetPostCommentDataAction
	| SetPostCommentTotalAction
	| SetUserCommentDataAction
	| SetUserCommentTotalAction
	| SetUserCommentLeftAction
	| SetPostCommentLeftAction;
