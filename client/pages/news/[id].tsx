import { NextPage } from 'next';
import React from 'react';
import PostComments from '../../components/PostComments/PostComments';
import MainLayout from '../../layout/MainLayout';
import { wrapper } from '../../store';
import {
	setPostCommentData,
	setPostCommentLeft,
	setPostCommentTotal,
} from '../../store/action-creators/comment';
import FullPost from '../../components/FullPost/FullPost';
import { IPost } from '../../types/post';
import { Api, takeCommentsInPost } from '../../utils/api';
import { setFullPost } from '../../store/action-creators/post';

interface PostPageProps {
	post: IPost;
}

const PostPage: NextPage<PostPageProps> = ({ post }) => {
	return (
		<MainLayout title={`Пост ${post.id}`} description='список постов блога'>
			<FullPost/>
			<PostComments />
		</MainLayout>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(
	(store) =>
		async (context: any): Promise<any> => {
			const id = context?.params.id;
			const dispatch = store.dispatch;
			try {
				const post = await Api(context).post.getOne(+id);
				dispatch(setFullPost(post));
				let sortOption;
				try {
					const user = await Api(context).user.getProfile();
					if (user.data) {
						sortOption = user.data.option.commentsSortOption;
					}
				} catch (e: any) {
					console.log(e?.response?.data?.message);
				}

				try {
					const { comments, total } =
						await Api().comment.getAllInPost(
							+id,
							`${sortOption === 0 ? 'DESC' : 'ASC'}`,
							takeCommentsInPost
						);
					dispatch(setPostCommentData(comments));
					dispatch(setPostCommentTotal(total));
					dispatch(setPostCommentLeft(total - takeCommentsInPost));
					return {
						props: {
							post,
						},
					};
				} catch (e: any) {
					console.log(e?.response?.data?.message);
					return {
						props: {
							post,
						},
					};
				}
			} catch (e: any) {
				console.log(e?.response?.data?.message);
				return {
					props: {},
					redirect: {
						destination: '/404',
						permanent: false,
					},
				};
			}
		}
);

export default PostPage;
