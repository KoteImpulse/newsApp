import {
	IOptionUpdate,
	OptionAction,
	OptionActionTypes,
	TabComment,
	TabRating,
	TabUserProfile,
} from '../../types/userOptions';

export const setSidePanelIsOpen = (): OptionAction => {
	return { type: OptionActionTypes.SET_SIDE_PANEL_IS_OPEN };
};
export const setSidePanelIsClose = (): OptionAction => {
	return { type: OptionActionTypes.SET_SIDE_PANEL_IS_CLOSE };
};
export const setMenuIsOpen = (): OptionAction => {
	return { type: OptionActionTypes.SET_MENU_IS_OPEN };
};
export const setMenuIsClose = (): OptionAction => {
	return { type: OptionActionTypes.SET_MENU_IS_CLOSE };
};
export const setCommentsSort = (payload: TabComment): OptionAction => {
	return { type: OptionActionTypes.SET_COMMENTS_SORT, payload };
};
export const setUserActiveTab = (payload: TabUserProfile): OptionAction => {
	return { type: OptionActionTypes.SET_USER_ACTIVE_TAB, payload };
};
export const setRatingActiveTab = (payload: TabRating): OptionAction => {
	return { type: OptionActionTypes.SET_RATING_ACTIVE_TAB, payload };
};
export const setOption = (payload: IOptionUpdate): OptionAction => {
	return { type: OptionActionTypes.SET_OPTION, payload };
};
