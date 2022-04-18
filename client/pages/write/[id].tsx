import React from 'react';
import { NextPage } from 'next';
import MainLayout from '../../layout/MainLayout';
import WriteForm from '../../components/WriteForm/WriteForm';
import { Api } from '../../utils/api';
import { IPost } from '../../types/post';
import { wrapper } from '../../store';

interface UpdatePageProps {
	post: IPost;
}

const UpdatePage: NextPage<UpdatePageProps> = ({ post }) => {
	return (
		<MainLayout
			hideMenu
			hideComments
			contentFullWidth
			title={`Редактирование ${post.id}`}
			description={`edit post ${post.id}`}
		>
			<WriteForm postData={post} />
		</MainLayout>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(
	(store) =>
		async (context: any): Promise<any> => {
			const id = context?.params.id;
			try {
				const post = await Api(context).post.getOne(+id);
				const user = await (await Api(context).user.getProfile()).data;
				if (post.user.id !== user.id) {
					return {
						props: {},
						redirect: {
							destination: '/',
							permanent: false,
						},
					};
				}
				return {
					props: {
						post,
					},
				};
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

export default UpdatePage;
