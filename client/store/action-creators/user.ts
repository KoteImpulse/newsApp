import {
	UserActionTypes,
	IUser,
	IUserAll,
	ISubscription,
} from './../../types/user';
import { UserAction } from '../../types/user';

export const setUserData = (payload: IUser | null): UserAction => {
	return { type: UserActionTypes.SET_USER_DATA, payload };
};
export const setUsersRating = (payload: IUserAll[]): UserAction => {
	return { type: UserActionTypes.SET_USERS_RATING, payload };
};
export const setUserBookmarks = (payload: number[]): UserAction => {
	return { type: UserActionTypes.SET_USER_BOOKMARKS, payload };
};
export const setUsersSubscriptions = (payload: ISubscription[]): UserAction => {
	return { type: UserActionTypes.SET_USER_SUBSCRIPTIONS, payload };
};
