import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import CategoryHeader from '../../components/Category/CategoryHeader';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import MainLayout from '../../layout/MainLayout';
import { wrapper } from '../../store';
import {
	setPostInCategoryData,
	setPostInCategoryTotalData,
	setPostInCategoryTotalDataAll,
} from '../../store/action-creators/post';
import { categories, CategoryList } from '../../types/category';
import { Api, takePostsInCategory } from '../../utils/api';

interface CategoryPagePageProps {
	category: string;
}

const CategoryPage: NextPage<CategoryPagePageProps> = ({ category }) => {
	const [fetching, setFetching] = useState(false);
	const { postsInCategory, postsInCategoryLeft } = useTypedSelector(
		(state) => state.post
	);
	const { setPostInCategoryData, setPostInCategoryTotalData } = useActions();

	const categoryFind = categories.find(
		(categoryItem) => categoryItem.slug === category
	);

	useEffect(() => {}, [postsInCategory]);

	useEffect(() => {
		(async () => {
			if (fetching === true) {
				try {
					const { posts, total } = await Api()
						.post.getAllInCategory(
							category,
							'DESC',
							takePostsInCategory,
							postsInCategory[postsInCategory.length - 1].id
						)
						.finally(() => setFetching(false));
					setPostInCategoryData([...postsInCategory, ...posts]);
					setPostInCategoryTotalData(total - takePostsInCategory);
				} catch (e: any) {
					console.log(e?.response?.data?.message);
				}
			}
		})();
	}, [fetching]);

	useEffect(() => {
		document.addEventListener('scroll', scrollHandler);
		return () => {
			document.removeEventListener('scroll', scrollHandler);
		};
	}, [setPostInCategoryData, postsInCategoryLeft]);

	const scrollHandler = (e: any) => {
		if (
			e?.target?.documentElement?.scrollHeight -
				(e?.target?.documentElement?.scrollTop + window.innerHeight) <
				100 &&
			postsInCategoryLeft > 0
		) {
			setFetching(true);
		}
	};
	return (
		<MainLayout
			contentFullWidth
			title={`Категория ${categoryFind?.title}`}
			description='список постов блога для категории'
		>
			<CategoryHeader
				fetching={fetching}
				category={categoryFind as CategoryList}
			/>
		</MainLayout>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(
	(store) =>
		async (context: any): Promise<any> => {
			const slug = context?.params.Slug;
			const dispatch = store.dispatch;
			try {
				const { posts, total } = await Api().post.getAllInCategory(
					slug,
					`DESC`,
					takePostsInCategory
				);
				dispatch(setPostInCategoryData(posts));
				dispatch(
					setPostInCategoryTotalData(total - takePostsInCategory)
				);
				dispatch(setPostInCategoryTotalDataAll(total));
				return {
					props: { category: slug },
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

export default CategoryPage;
