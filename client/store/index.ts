import { createStore, AnyAction, Store } from 'redux';
import { createWrapper, Context } from 'next-redux-wrapper';
import { reducer, RootState } from './reducers';
import { ThunkDispatch } from 'redux-thunk';

const makeStore = (context: Context) => createStore(reducer);

export const wrapper = createWrapper<Store<RootState>>(makeStore, {
	debug: false,
});
export type NextThunkDispatch = ThunkDispatch<RootState, void, AnyAction>;
