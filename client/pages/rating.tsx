import React from 'react';
import MainLayout from '../layout/MainLayout';
import { NextPage } from 'next';
import RatingComponent from '../components/RatingComponent/RatingComponent';
import { Api } from '../utils/api';
import { wrapper } from '../store';
import { setUsersRating } from '../store/action-creators/user';
import { daysOpt, TabRating } from '../types/userOptions';

interface RatingPageProps {}

const RatingPage: NextPage<RatingPageProps> = () => {
	return (
		<MainLayout title={`Страница рейтинга`}>
			<RatingComponent />
		</MainLayout>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(
	(store) =>
		async (context): Promise<any> => {
			const dispatch = store.dispatch;
			let sortOption;
			try {
				const user = await Api(context).user.getProfile();
				if (user.data) {
					sortOption = user.data.option.ratingActiveTabOption;
				}
			} catch (e: any) {
				console.log(e?.response?.data?.message);
			}
			try {
				const { data } = await Api().user.getAll(
					sortOption === TabRating.FIRSTOPT
						? undefined
						: sortOption === TabRating.SECONDOPT
						? daysOpt[0]
						: daysOpt[1]
				);

				dispatch(setUsersRating(data));
				return {
					props: {},
				};
			} catch (e: any) {
				console.log(e?.response?.data?.message);
				return {
					props: { users: null },
				};
			}
		}
);

export default RatingPage;
