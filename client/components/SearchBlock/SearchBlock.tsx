import React, { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import cn from 'classnames';
import styles from './SearchBlock.module.scss';
import Link from 'next/link';
import { clientUrl } from '../../utils/api';
import { useRouter } from 'next/router';
import { formatComment } from '../../utils/formatComment';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import Button from '../Button/Button';

interface SearchBlockProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	queryForPage: string;
}

const SearchBlock: FC<SearchBlockProps> = ({
	queryForPage,
	className,
	...props
}) => {
	const router = useRouter();
	const { searchPosts, searchPostsTotal } = useTypedSelector(
		(state) => state.post
	);
	const clickHandler = () => {
		router.push(`${clientUrl}search?title=${queryForPage}`, undefined, {
			shallow: true,
		});
	};
	return (
		<div className={cn(className, styles.searchBlock)} {...props}>
			<ul className={styles.searchResult}>
				{searchPosts.map((post, index) => {
					if (router.asPath === `/news/${post.id}`) {
						return (
							<li key={post.id} className={styles.searchItem}>
								{index + 1} -{formatComment(post.title, 25, 30)}
							</li>
						);
					} else {
						return (
							<Link
								href={`${clientUrl}news/${post.id}`}
								key={post.id}
							>
								<a>
									<li className={styles.searchItem}>
										{index + 1} -
										{formatComment(post.title, 25, 30)}
									</li>
								</a>
							</Link>
						);
					}
				})}
			</ul>
			{searchPostsTotal > 5 && (
				<div>
					{/* <Link href={`${clientUrl}search`} passHref> */}
					<Button
						typeButton='submitFormButton'
						className={styles.searchMoreButton}
						onClick={clickHandler}
					>
						больше
					</Button>
					{/* </Link> */}
				</div>
			)}
		</div>
	);
};

export default SearchBlock;
