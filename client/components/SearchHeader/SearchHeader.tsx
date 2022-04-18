import React, {
	DetailedHTMLProps,
	FC,
	HTMLAttributes,
	useEffect,
	useState,
} from 'react';
import cn from 'classnames';
import styles from './SearchHeader.module.scss';
import Post from '../Post/Post';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import TabLoader from '../Loader/TabLoader/TabLoader';
import { IPost } from '../../types/post';
import { route } from 'next/dist/server/router';
import { useRouter } from 'next/router';
import { useActions } from '../../hooks/useActions';
import { Api } from '../../utils/api';

interface SearchHeaderProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	searchParam: string;
	fetching: boolean;
}

const SearchHeader: FC<SearchHeaderProps> = ({
	fetching,
	searchParam,
	className,
	...props
}) => {
	const { searchPagePosts, searchPagePostsLeft, searchPagePostsTotal } =
		useTypedSelector((state) => state.post);

	return (
		<div className={cn(className, styles.searchHeader)} {...props}>
			<div className={styles.container}>
				<div className={styles.searchInfo}>
					<div className={styles.linkItem}>
						<h4
							className={styles.categoryTitle}
						>{`Надены посты по запросу: ${searchParam}`}</h4>
					</div>
				</div>
				<div className={styles.searchStats}>
					<div className={styles.cont}>
						<p className={styles.countPosts}>
							Найдено постов: {searchPagePostsTotal}
						</p>
					</div>
				</div>
			</div>
			<div className={styles.contentBlock}>
				<div className={styles.texts}>
					{searchPagePosts &&
						searchPagePosts.length > 0 &&
						searchPagePosts.map((post) => (
							<Post
								key={post.id}
								post={post}
								userId={post.user.id}
								user={post.user}
								usage='searchPage'
								searchParam={searchParam}
							/>
						))}
					{fetching && <TabLoader />}
					{searchPagePosts.length === 0 && (
						<span>В этой категории еще нет постов</span>
					)}
				</div>
			</div>
		</div>
	);
};

export default SearchHeader;
