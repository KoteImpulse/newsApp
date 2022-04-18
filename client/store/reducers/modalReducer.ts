import { ModalAction, ModalActionTypes, ModalState } from '../../types/modal';

const initialState: ModalState = {
	isOpened: false,
	// commentsIsOpened: true,
};

export const modalReducer = (
	state = initialState,
	action: ModalAction
): ModalState => {
	switch (action.type) {
		case ModalActionTypes.SET_MODAL_OPEN:
			return { ...state, isOpened: true };
		case ModalActionTypes.SET_MODAL_CLOSE:
			return { ...state, isOpened: false };
		default:
			return state;
	}
};
