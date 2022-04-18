import {
	IPost,
	PostAction,
	PostActionTypes,
	PostState,
} from '../../types/post';

const initialState: PostState = {
	allPosts: [],
	allPostsTotal: 0,
	searchPosts: [],
	searchPostsTotal: 0,
	searchPagePosts: [],
	searchPagePostsTotal: 0,
	searchPagePostsLeft: 0,
	userPosts: [],
	userPostsTotal: 0,
	postsOnPage: [],
	postsLeft: 0,
	postsInCategory: [],
	postsInCategoryLeft: 0,
	postsInCategoryTotal: 0,
	postsInBookmarks: [],
	postsInBookmarksLeft: 0,
	postsInBookmarksTotal: 0,
	fullPost: {} as IPost,
};

export const postReducer = (
	state = initialState,
	action: PostAction
): PostState => {
	switch (action.type) {
		case PostActionTypes.SET_POST_DATA:
			return { ...state, allPosts: action.payload };
		case PostActionTypes.SET_POST_TOTAL_DATA:
			return { ...state, allPostsTotal: action.payload };

		case PostActionTypes.SET_SEARCH_POST_DATA:
			return { ...state, searchPosts: action.payload };
		case PostActionTypes.SET_SEARCH_POST_TOTAL_DATA:
			return { ...state, searchPostsTotal: action.payload };

		case PostActionTypes.SET_SEARCH_PAGE_POST_DATA:
			return { ...state, searchPagePosts: action.payload };
		case PostActionTypes.SET_SEARCH_PAGE_POST_TOTAL_DATA:
			return { ...state, searchPagePostsTotal: action.payload };
		case PostActionTypes.SET_SEARCH_PAGE_POST_LEFT_DATA:
			return { ...state, searchPagePostsLeft: action.payload };

		case PostActionTypes.SET_USER_POST_DATA:
			return { ...state, userPosts: action.payload };
		case PostActionTypes.SET_USER_POST_TOTAL_DATA:
			return { ...state, userPostsTotal: action.payload };

		case PostActionTypes.SET_POST_ON_PAGE_DATA:
			return { ...state, postsOnPage: action.payload };
		case PostActionTypes.SET_POST_ON_PAGE_DATA_TOTAL:
			return { ...state, postsLeft: action.payload };

		case PostActionTypes.SET_POST_IN_CATEGORY_DATA:
			return { ...state, postsInCategory: action.payload };
		case PostActionTypes.SET_POST_IN_CATEGORY_DATA_TOTAL:
			return { ...state, postsInCategoryLeft: action.payload };
		case PostActionTypes.SET_POST_IN_CATEGORY_DATA_TOTAL_All:
			return { ...state, postsInCategoryTotal: action.payload };

		case PostActionTypes.SET_POST_IN_BOOKMARKS_DATA:
			return { ...state, postsInBookmarks: action.payload };
		case PostActionTypes.SET_POST_IN_BOOKMARKS_DATA_LEFT:
			return { ...state, postsInBookmarksLeft: action.payload };
		case PostActionTypes.SET_POST_IN_BOOKMARKS_DATA_TOTAL:
			return { ...state, postsInBookmarksTotal: action.payload };

		case PostActionTypes.SET_FULL_POST:
			return { ...state, fullPost: action.payload };
		default:
			return state;
	}
};
