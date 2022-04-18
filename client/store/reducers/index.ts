import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';
import { commentReducer } from './commentReducer';
import { modalReducer } from './modalReducer';
import { optionReducer } from './optionReducer';
import { postReducer } from './postReducer';
import { userReducer } from './userReducer';

const rootReducer = combineReducers({
	user: userReducer,
	modal: modalReducer,
	comment: commentReducer,
	post: postReducer,
	option: optionReducer,
});

export const reducer = (state: any, action: any) => {
	if (action.type === HYDRATE) {
		const nextState = {
			...state, // use previous state
			...action.payload, // apply delta from hydration
		};
		if (state.count) nextState.count = state.count; // preserve count value on client side navigation
		return nextState;
	} else {
		return rootReducer(state, action);
	}
};

// export const reducer = (
// 	state: any = { app: 'init', page: 'init' },
// 	action: AnyAction
// ) => {
// 	switch (action.type) {
// 		case HYDRATE:
// 			if (action.payload.app === 'init') delete action.payload.app;
// 			if (action.payload.page === 'init') delete action.payload.page;
// 			return { ...state, ...action.payload };
// 		case 'APP':
// 			return { ...state, app: action.payload };
// 		case 'PAGE':
// 			return { ...state, page: action.payload };
// 		default:
// 			return rootReducer(state, action);
// 	}
// };

export type RootState = ReturnType<typeof rootReducer>;
