import {
	OptionAction,
	OptionActionTypes,
	OptionState,
	TabComment,
	TabRating,
	TabUserProfile,
} from '../../types/userOptions';

const initialState: OptionState = {
	sidePanelIsOpenOption: true,
	menuIsOpenOption: true,
	commentsSortOption: TabComment.DESC,
	userActiveTabOption: TabUserProfile.POST,
	ratingActiveTabOption: TabRating.FIRSTOPT,
};

export const optionReducer = (
	state = initialState,
	action: OptionAction
): OptionState => {
	switch (action.type) {
		case OptionActionTypes.SET_SIDE_PANEL_IS_OPEN:
			return { ...state, sidePanelIsOpenOption: true };
		case OptionActionTypes.SET_SIDE_PANEL_IS_CLOSE:
			return { ...state, sidePanelIsOpenOption: false };
		case OptionActionTypes.SET_MENU_IS_OPEN:
			return { ...state, menuIsOpenOption: true };
		case OptionActionTypes.SET_MENU_IS_CLOSE:
			return { ...state, menuIsOpenOption: false };
		case OptionActionTypes.SET_COMMENTS_SORT:
			return { ...state, commentsSortOption: action.payload };
		case OptionActionTypes.SET_USER_ACTIVE_TAB:
			return { ...state, userActiveTabOption: action.payload };
		case OptionActionTypes.SET_RATING_ACTIVE_TAB:
			return { ...state, ratingActiveTabOption: action.payload };
		case OptionActionTypes.SET_OPTION:
			return { ...state, ...action.payload };

		default:
			return state;
	}
};
