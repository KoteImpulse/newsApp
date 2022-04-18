import {
	CommentAction,
	IComment,
	CommentActionTypes,
} from './../../types/comment';

export const setCommentsData = (payload: IComment[] | []): CommentAction => {
	return { type: CommentActionTypes.SET_COMMENT_DATA, payload };
};
export const setPostCommentData = (payload: IComment[] | []): CommentAction => {
	return { type: CommentActionTypes.SET_POST_COMMENT_DATA, payload };
};
export const setPostCommentTotal = (payload: number): CommentAction => {
	return { type: CommentActionTypes.SET_POST_COMMENT_DATA_TOTAL, payload };
};
export const setPostCommentLeft = (payload: number): CommentAction => {
	return { type: CommentActionTypes.SET_POST_COMMENT_DATA_LEFT, payload };
};
export const setUserCommentData = (payload: IComment[] | []): CommentAction => {
	return { type: CommentActionTypes.SET_USER_COMMENT_DATA, payload };
};
export const setUserCommentTotal = (payload: number): CommentAction => {
	return { type: CommentActionTypes.SET_USER_COMMENT_DATA_TOTAL, payload };
};
export const setUserCommentLeft = (payload: number): CommentAction => {
	return { type: CommentActionTypes.SET_USER_COMMENT_DATA_LEFT, payload };
};
