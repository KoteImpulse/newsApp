import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { IComment, ResponseComments } from '../types/comment';
import { Api } from '../utils/api';

interface useCommentsProps {
	setComments: Dispatch<SetStateAction<IComment[]>>;
	comments: IComment[];
}

export const useComments = (
	type: 'all' | 'forPost',
	postId?: number
): useCommentsProps => {
	const [comments, setComments] = useState<IComment[]>([]);

	useEffect(() => {
		(async () => {
			try {
				const response =
					type === 'forPost' && postId
						? await Api().comment.getAllInPost(postId)
						: await Api().comment.getAll();

				setComments(response.comments);
			} catch (e: any) {
				console.log(e.response?.data.message);
			}
		})();
	}, []);

	// const onSuccessAdd = (comment: IComment) => {
	// 	setComments((prev) => [comment, ...prev]);
	// };
	// const onSuccessRemove = (commentId: number) => {
	// 	setComments((prev) => prev.filter((item) => item.id !== commentId));
	// };

	return { comments, setComments };
};
