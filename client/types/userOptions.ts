export enum TabComment {
	DESC = 0,
	ASC = 1,
}
export enum TabUserProfile {
	POST = 0,
	COMMENT = 1,
	BOOKMARK = 2,
}
export enum TabCategory {
	POST = 0,
	COMMENT = 1,
	BOOKMARK = 2,
}
export enum TabRating {
	FIRSTOPT = 0,
	SECONDOPT = 1,
	THIRDOPT = 2,
}

export const daysOpt = [10, 30];
export interface IOption {
	id: number;
	sidePanelIsOpenOption: boolean;
	menuIsOpenOption: boolean;
	commentsSortOption: TabComment;
	userActiveTabOption: TabUserProfile;
	ratingActiveTabOption: TabRating;
}
export interface IOptionUpdate {
	sidePanelIsOpenOption?: boolean;
	menuIsOpenOption?: boolean;
	commentsSortOption?: TabComment;
	userActiveTabOption?: TabUserProfile;
	ratingActiveTabOption?: TabRating;
}
export interface OptionState {
	sidePanelIsOpenOption: boolean;
	menuIsOpenOption: boolean;
	commentsSortOption: TabComment;
	userActiveTabOption: TabUserProfile;
	ratingActiveTabOption: TabRating;
}

export enum OptionActionTypes {
	SET_SIDE_PANEL_IS_OPEN = 'SET_SIDE_PANEL_IS_OPEN',
	SET_SIDE_PANEL_IS_CLOSE = 'SET_SIDE_PANEL_IS_CLOSE',
	SET_MENU_IS_OPEN = 'SET_MENU_IS_OPEN',
	SET_MENU_IS_CLOSE = 'SET_MENU_IS_CLOSE',
	SET_COMMENTS_SORT = 'SET_COMMENTS_SORT',
	SET_USER_ACTIVE_TAB = 'SET_USER_ACTIVE_TAB',
	SET_RATING_ACTIVE_TAB = 'SET_RATING_ACTIVE_TAB',
	SET_OPTION = 'SET_OPTION',
}

interface SetSidePanelIsOpenAction {
	type: OptionActionTypes.SET_SIDE_PANEL_IS_OPEN;
}
interface SetSidePanelIsCloseAction {
	type: OptionActionTypes.SET_SIDE_PANEL_IS_CLOSE;
}
interface SetMenuIsOpenAction {
	type: OptionActionTypes.SET_MENU_IS_OPEN;
}
interface SetMenuIsCloseAction {
	type: OptionActionTypes.SET_MENU_IS_CLOSE;
}
interface SetCommentsSortAction {
	type: OptionActionTypes.SET_COMMENTS_SORT;
	payload: TabComment;
}
interface SetUserActiveTabAction {
	type: OptionActionTypes.SET_USER_ACTIVE_TAB;
	payload: TabUserProfile;
}
interface SetRatingActiveTabOption {
	type: OptionActionTypes.SET_RATING_ACTIVE_TAB;
	payload: TabRating;
}
interface SetOptionAction {
	type: OptionActionTypes.SET_OPTION;
	payload: IOptionUpdate;
}

export type OptionAction =
	| SetSidePanelIsOpenAction
	| SetSidePanelIsCloseAction
	| SetMenuIsOpenAction
	| SetMenuIsCloseAction
	| SetCommentsSortAction
	| SetUserActiveTabAction
	| SetOptionAction
	| SetRatingActiveTabOption;
