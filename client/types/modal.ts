export interface ModalState {
	isOpened: boolean;
	// commentsIsOpened: boolean;
}

export enum ModalActionTypes {
	SET_MODAL_OPEN = 'SET_MODAL_OPEN',
	SET_MODAL_CLOSE = 'SET_MODAL_CLOSE',
	// SET_COMMETNS_OPEN = 'SET_COMMETNS_OPEN',
	// SET_COMMENTS_CLOSE = 'SET_COMMENTS_CLOSE',
}

interface SetModalOpenAction {
	type: ModalActionTypes.SET_MODAL_OPEN;
}
interface SetModalCloseAction {
	type: ModalActionTypes.SET_MODAL_CLOSE;
}
// interface SetCommentsOpenAction {
// 	type: ModalActionTypes.SET_COMMETNS_OPEN;
// }
// interface SetCommentsCloseAction {
// 	type: ModalActionTypes.SET_COMMENTS_CLOSE;
// }

export type ModalAction =
	| SetModalOpenAction
	| SetModalCloseAction
	// | SetCommentsOpenAction
	// | SetCommentsCloseAction;
