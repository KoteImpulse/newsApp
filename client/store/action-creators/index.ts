import * as UserActionCreators from './user';
import * as ModalActionCreators from './modal';
import * as CommentActionCreators from './comment';
import * as PostActionCreators from './post';
import * as OptionActionCreators from './option';

export default {
	...UserActionCreators,
	...ModalActionCreators,
	...CommentActionCreators,
	...PostActionCreators,
	...OptionActionCreators,
};
