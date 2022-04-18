import { IPost, PostAction, PostActionTypes } from '../../types/post';

export const setPostData = (payload: IPost[] | []): PostAction => {
	return { type: PostActionTypes.SET_POST_DATA, payload };
};
export const setPostTotalData = (payload: number): PostAction => {
	return { type: PostActionTypes.SET_POST_TOTAL_DATA, payload };
};

export const setSearchPostData = (payload: IPost[] | []): PostAction => {
	return { type: PostActionTypes.SET_SEARCH_POST_DATA, payload };
};
export const setSearchPostTotalData = (payload: number): PostAction => {
	return { type: PostActionTypes.SET_SEARCH_POST_TOTAL_DATA, payload };
};

export const setUserPostData = (payload: IPost[] | []): PostAction => {
	return { type: PostActionTypes.SET_USER_POST_DATA, payload };
};
export const setUserPostTotalData = (payload: number): PostAction => {
	return { type: PostActionTypes.SET_USER_POST_TOTAL_DATA, payload };
};

export const setPostOnPageData = (payload: IPost[] | []): PostAction => {
	return { type: PostActionTypes.SET_POST_ON_PAGE_DATA, payload };
};
export const setPostLeftTotalData = (payload: number): PostAction => {
	return { type: PostActionTypes.SET_POST_ON_PAGE_DATA_TOTAL, payload };
};

export const setPostInCategoryData = (payload: IPost[] | []): PostAction => {
	return { type: PostActionTypes.SET_POST_IN_CATEGORY_DATA, payload };
};
export const setPostInCategoryTotalData = (payload: number): PostAction => {
	return { type: PostActionTypes.SET_POST_IN_CATEGORY_DATA_TOTAL, payload };
};
export const setPostInCategoryTotalDataAll = (payload: number): PostAction => {
	return {
		type: PostActionTypes.SET_POST_IN_CATEGORY_DATA_TOTAL_All,
		payload,
	};
};

export const setPostInBookmarksData = (payload: IPost[] | []): PostAction => {
	return { type: PostActionTypes.SET_POST_IN_BOOKMARKS_DATA, payload };
};
export const setPostInBookmarksTotalData = (payload: number): PostAction => {
	return { type: PostActionTypes.SET_POST_IN_BOOKMARKS_DATA_TOTAL, payload };
};
export const setPostInBookmarksLeftData = (payload: number): PostAction => {
	return { type: PostActionTypes.SET_POST_IN_BOOKMARKS_DATA_LEFT, payload };
};

export const setFullPost = (payload: IPost): PostAction => {
	return { type: PostActionTypes.SET_FULL_POST, payload };
};

export const setSearchPagePostData = (payload: IPost[] | []): PostAction => {
	return { type: PostActionTypes.SET_SEARCH_PAGE_POST_DATA, payload };
};
export const setSearchPagePostTotalData = (payload: number): PostAction => {
	return { type: PostActionTypes.SET_SEARCH_PAGE_POST_TOTAL_DATA, payload };
};
export const setSearchPagePostLeftData = (payload: number): PostAction => {
	return { type: PostActionTypes.SET_SEARCH_PAGE_POST_LEFT_DATA, payload };
};
