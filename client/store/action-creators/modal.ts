import { ModalAction, ModalActionTypes } from '../../types/modal';

export const setModalOpen = (): ModalAction => {
	return { type: ModalActionTypes.SET_MODAL_OPEN };
};
export const setModalClose = (): ModalAction => {
	return { type: ModalActionTypes.SET_MODAL_CLOSE };
};
// export const setCommentsOpen = (): ModalAction => {
// 	return { type: ModalActionTypes.SET_COMMETNS_OPEN };
// };
// export const setCommentsClose = (): ModalAction => {
// 	return { type: ModalActionTypes.SET_COMMENTS_CLOSE };
// };
