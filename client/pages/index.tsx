import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import TabLoader from '../components/Loader/TabLoader/TabLoader';
import Post from '../components/Post/Post';
import { useActions } from '../hooks/useActions';
import { useTypedSelector } from '../hooks/useTypedSelector';
import MainLayout from '../layout/MainLayout';
import { wrapper } from '../store';
import {
	setPostLeftTotalData,
	setPostOnPageData,
} from '../store/action-creators/post';
import { Api, takeAllPosts } from '../utils/api';

interface HomeProps {}

const Home: NextPage<HomeProps> = () => {
	const [fetching, setFetching] = useState(false);
	const { postsOnPage, postsLeft } = useTypedSelector((state) => state.post);
	const { setPostOnPageData, setPostLeftTotalData } = useActions();

	useEffect(() => {}, [postsOnPage]);

	useEffect(() => {
		(async () => {
			try {
				if (fetching === true) {
					const { posts, left } = await Api()
						.post.getAllPag(
							takeAllPosts,
							postsOnPage[postsOnPage.length - 1].id
						)
						.finally(() => setFetching(false));
					setPostOnPageData([...postsOnPage, ...posts]);
					setPostLeftTotalData(left - takeAllPosts);
				}
			} catch (e: any) {
				console.log(e?.response?.data?.message);
			}
		})();
	}, [fetching]);

	useEffect(() => {
		document.addEventListener('scroll', scrollHandler);
		return () => {
			document.removeEventListener('scroll', scrollHandler);
		};
	}, [postsOnPage, postsLeft]);

	const scrollHandler = (e: any) => {
		if (
			e?.target?.documentElement?.scrollHeight -
				(e?.target?.documentElement?.scrollTop + window.innerHeight) <
				100 &&
			postsLeft > 0
		) {
			setFetching(true);
		}
	};

	return (
		<MainLayout
			title={'Список постов / главная страница'}
			description={`main page of this blog`}
		>
			{postsOnPage &&
				postsOnPage.length > 0 &&
				postsOnPage.map((post) => (
					<Post
						key={post.id}
						post={post}
						userId={post.user.id}
						user={post.user}
						usage='mainPage'
					/>
				))}
			{fetching && <TabLoader />}
			{postsOnPage.length === 0 && (
				<span>Не удалось загрузить статьи</span>
			)}
		</MainLayout>
	);
};
export const getServerSideProps = wrapper.getServerSideProps(
	(store) =>
		async (context): Promise<any> => {
			const dispatch = store.dispatch;
			try {
				const { posts, left } = await Api().post.getAllPag(
					takeAllPosts
				);
				dispatch(setPostOnPageData(posts));
				dispatch(setPostLeftTotalData(left - takeAllPosts));
			} catch (e: any) {
				console.log(e?.response?.data?.message);
				return { props: {} };
			}
			return { props: {} };
		}
);

export default Home;
