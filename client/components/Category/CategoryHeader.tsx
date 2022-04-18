import React, { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import cn from 'classnames';
import styles from './CategoryHeader.module.scss';
import Image from 'next/image';
import Post from '../Post/Post';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { TabCategory } from '../../types/userOptions';
import TabLoader from '../Loader/TabLoader/TabLoader';
import { CategoryList } from '../../types/category';
import Subscribers from '../Subscribers/Subscribers';

interface CategoryHeaderProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	category: CategoryList;
	fetching: boolean;
}

const CategoryHeader: FC<CategoryHeaderProps> = ({
	fetching,
	category,
	className,
	...props
}) => {
	const { postsInCategory, postsInCategoryTotal } = useTypedSelector(
		(state) => state.post
	);

	return (
		<div className={cn(className, styles.profileHeader)} {...props}>
			<div className={styles.container}>
				<div className={styles.categoryInfo}>
					<div className={styles.imageContainer}>
						<Image
							alt={'category avatar'}
							src={`${category.image}`}
							width={120}
							height={120}
							objectFit='cover'
							layout='fixed'
						/>
					</div>
					<div className={styles.linkItem}>
						<h4 className={styles.categoryTitle}>
							{category.title}
						</h4>
					</div>
				</div>
				<div className={styles.categoryStats}>
					<div className={styles.cont}>
						<p className={styles.countPosts}>
							Постов: {postsInCategoryTotal}
						</p>
						{/* <p className={styles.subs}>2 подписчика</p> */}
					</div>
					<p className={styles.description}>{category.description}</p>
				</div>
				<div className={styles.tabsBlock}>
					{/* <Tabs tabs={tabs} usage='CategoryPage' /> */}
				</div>
			</div>
			<div className={styles.contentBlock}>
				<div className={styles.texts}>
					{postsInCategory &&
						postsInCategory.length > 0 &&
						postsInCategory.map((post) => (
							<Post
								key={post.id}
								post={post}
								userId={post.user.id}
								user={post.user}
								usage='categoryPage'
								category={category.slug}
							/>
						))}
					{fetching && <TabLoader />}
					{postsInCategory.length === 0 && (
						<span>В этой категории еще нет постов</span>
					)}
				</div>
				{/* <Subscribers /> */}
			</div>
		</div>
	);
};

export default CategoryHeader;
