import {
	CommentAction,
	CommentActionTypes,
	CommentState,
} from './../../types/comment';

const initialState: CommentState = {
	allComments: [],
	postComments: [],
	postCommentsTotal: 0,
	postCommentsLeft: 0,
	userComments: [],
	userCommentsTotal: 0,
	userCommentsLeft: 0,
};

export const commentReducer = (
	state = initialState,
	action: CommentAction
): CommentState => {
	switch (action.type) {
		case CommentActionTypes.SET_COMMENT_DATA:
			return { ...state, allComments: action.payload };
		case CommentActionTypes.SET_POST_COMMENT_DATA:
			return { ...state, postComments: action.payload };
		case CommentActionTypes.SET_POST_COMMENT_DATA_TOTAL:
			return { ...state, postCommentsTotal: action.payload };
		case CommentActionTypes.SET_POST_COMMENT_DATA_LEFT:
			return { ...state, postCommentsLeft: action.payload };
		case CommentActionTypes.SET_USER_COMMENT_DATA:
			return { ...state, userComments: action.payload };
		case CommentActionTypes.SET_USER_COMMENT_DATA_TOTAL:
			return { ...state, userCommentsTotal: action.payload };
		case CommentActionTypes.SET_USER_COMMENT_DATA_LEFT:
			return { ...state, userCommentsLeft: action.payload };
		default:
			return state;
	}
};
