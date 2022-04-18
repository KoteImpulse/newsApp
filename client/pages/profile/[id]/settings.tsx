import React from 'react';
import MainLayout from '../../../layout/MainLayout';
import { NextPage } from 'next';
import SettingsForm from '../../../components/SettingsForm/SettingsForm';
import { wrapper } from '../../../store';
import { Api } from '../../../utils/api';
import { IUserProfile, Permission } from '../../../types/user';

interface SettingsPageProps {
	user: IUserProfile;
}
const Settings: NextPage<SettingsPageProps> = () => {
	return (
		<MainLayout
			hideComments
			contentFullWidth
			title={`Настройки пользователя`}
			description='user settings'
		>
			<SettingsForm />
		</MainLayout>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(
	(store) =>
		async (context: any): Promise<any> => {
			const id = context?.params.id;
			try {
				const user = await Api().user.getUserProfile(id);
				const userFromToken = await Api(context).user.refresh();

				if (
					user.data.id !== userFromToken.data.user.id ||
					!userFromToken.data.user.permissions.includes(
						Permission.CHANGEPROFILEOPTIONS
					)
				) {
					return {
						props: {},
						redirect: {
							destination: '/',
							permanent: false,
						},
					};
				}
				if (
					user.data.id === userFromToken.data.user.id &&
					userFromToken.data.user.permissions.includes(
						Permission.CHANGEPROFILEOPTIONS
					)
				) {
					return {
						props: {},
					};
				}
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

export default Settings;
