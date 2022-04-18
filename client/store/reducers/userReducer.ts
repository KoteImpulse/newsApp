import { UserActionTypes } from './../../types/user';
import { UserState, UserAction } from '../../types/user';

const initialState: UserState = {
	userInfo: null,
	bookmarks: [],
	usersRating: [],
	userSubscriptions: [],
};

export const userReducer = (
	state = initialState,
	action: UserAction
): UserState => {
	switch (action.type) {
		case UserActionTypes.SET_USER_DATA:
			return { ...state, userInfo: action.payload };
		case UserActionTypes.SET_USERS_RATING:
			return { ...state, usersRating: action.payload };
		case UserActionTypes.SET_USER_BOOKMARKS:
			return { ...state, bookmarks: action.payload };
		case UserActionTypes.SET_USER_SUBSCRIPTIONS:
			return { ...state, userSubscriptions: action.payload };
		default:
			return state;
	}
};
