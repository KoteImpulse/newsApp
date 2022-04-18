import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import SearchHeader from '../components/SearchHeader/SearchHeader';
import { useActions } from '../hooks/useActions';
import { useTypedSelector } from '../hooks/useTypedSelector';
import MainLayout from '../layout/MainLayout';
import { wrapper } from '../store';
import {
	setSearchPagePostData,
	setSearchPagePostLeftData,
	setSearchPagePostTotalData,
	setSearchPostData,
	setSearchPostTotalData,
} from '../store/action-creators/post';
import { IPost } from '../types/post';
import { Api, takePostsForSearchPage } from '../utils/api';

interface SearchPagePageProps {
	title: string;
}

const SearchPage: NextPage<SearchPagePageProps> = ({ title }) => {
	const [fetching, setFetching] = useState(false);
	const router = useRouter();
	const query = router.query;
	const searchParam = query.title as string;
	const {
		setSearchPagePostData,
		setSearchPagePostTotalData,
		setSearchPagePostLeftData,
	} = useActions();

	const { searchPagePosts, searchPagePostsLeft, searchPagePostsTotal } =
		useTypedSelector((state) => state.post);

	useEffect(() => {}, [searchPagePosts]);

	useEffect(() => {
		(async () => {
			try {
				const posts = await Api().post.search({
					title: searchParam,
					skip: 0,
					take: 10,
				});
				setSearchPagePostData(posts.posts);
				setSearchPagePostTotalData(posts.total);
				setSearchPagePostLeftData(posts.total - takePostsForSearchPage);
			} catch (e: any) {
				console.log(e?.response?.data?.message);
			} finally {
				setFetching(false);
			}
		})();
	}, [router.asPath]);

	useEffect(() => {
		(async () => {
			try {
				if (fetching === true) {
					const posts = await Api().post.search({
						title: searchParam,
						skip: 0,
						take: takePostsForSearchPage,
						lastPostId:
							searchPagePosts[searchPagePosts.length - 1].id,
					});
					setSearchPagePostLeftData(
						searchPagePostsLeft - takePostsForSearchPage
					);
					setSearchPagePostData([...searchPagePosts, ...posts.posts]);
				}
			} catch (e: any) {
				console.log(e?.response?.data?.message);
			} finally {
				setFetching(false);
			}
		})();
	}, [fetching]);

	useEffect(() => {
		document.addEventListener('scroll', scrollHandlerPost);
		return () => {
			document.removeEventListener('scroll', scrollHandlerPost);
		};
	}, [searchPagePostsLeft]);

	const scrollHandlerPost = (e: any) => {
		if (
			e?.target?.documentElement?.scrollHeight -
				(e?.target?.documentElement?.scrollTop + window.innerHeight) <
			100
		) {
			if (searchPagePostsLeft > 0) {
				setFetching(true);
			}
		}
	};

	return (
		<MainLayout
			contentFullWidth
			title={`Результат поиска ${title}`}
			description='список постов результатов поиска'
		>
			<SearchHeader searchParam={searchParam} fetching={fetching} />
		</MainLayout>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(
	(store) =>
		async (context: any): Promise<any> => {
			const { title } = context?.query;
			const dispatch = store.dispatch;
			try {
				const posts = await Api().post.search({
					title,
					skip: 0,
					take: takePostsForSearchPage,
				});
				dispatch(setSearchPagePostData(posts.posts));
				dispatch(setSearchPagePostTotalData(posts.total));
				dispatch(
					setSearchPagePostLeftData(
						posts.total - takePostsForSearchPage
					)
				);

				return {
					props: {
						title,
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

export default SearchPage;
