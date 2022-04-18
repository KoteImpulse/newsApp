import React from 'react';
import { NextPage } from 'next';
import MainLayout from '../../layout/MainLayout';
import WriteForm from '../../components/WriteForm/WriteForm';
import { wrapper } from '../../store';
import { Api } from '../../utils/api';
import { RolesForUsers } from '../../types/user';

const WritePage: NextPage = () => {
	return (
		<MainLayout
			hideMenu
			hideComments
			contentFullWidth
			title={`Создание статьи`}
			description={`write post`}
		>
			<WriteForm />
		</MainLayout>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(
	(store) =>
		async (context: any): Promise<any> => {
			try {
				const user = (await Api(context).user.getProfile()).data;

				if (user.role === RolesForUsers.GHOST) {
					return {
						props: {},
						redirect: {
							destination: '/',
							permanent: false,
						},
					};
				}
				return {
					props: {},
				};
			} catch (e: any) {
				console.log(e?.response?.data?.message);
				return {
					props: {},
					redirect: {
						destination: '/',
						permanent: false,
					},
				};
			}
		}
);

export default WritePage;
