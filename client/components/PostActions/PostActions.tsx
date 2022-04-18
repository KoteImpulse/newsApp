import React, {
	DetailedHTMLProps,
	FC,
	HTMLAttributes,
	useEffect,
	useState,
} from 'react';
import cn from 'classnames';
import styles from './PostActions.module.scss';
import Button from '../Button/Button';
import Link from 'next/link';
import Tooltip from '../Tooltip/Tooltip';
import { Api, clientUrl, takePostsForSearchPage } from '../../utils/api';
import { IoEyeOutline } from 'react-icons/io5';
import { AnimatePresence, motion, useAnimation, Variants } from 'framer-motion';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useActions } from '../../hooks/useActions';
import { useRouter } from 'next/router';

interface PostActionsProps
	extends DetailedHTMLProps<
		HTMLAttributes<HTMLUListElement>,
		HTMLUListElement
	> {
	postId?: number;
	usage?: 'listPosts' | 'fullPost' | 'userPageBookmarks';
	postViews?: number;
	commentsCount?: number;
	ratingCount?: number;
	userPage?: boolean;
	additionUsage?:
		| 'mainPage'
		| 'userPage'
		| 'userPageBookmarks'
		| 'categoryPage'
		| 'fullPost'
		| 'searchPage';
	userId?: number;
	postUserId?: number | undefined;
	searchParam?: string;
}

const clickVariants: Variants = {
	click: { opacity: 1, transition: { duration: 0, delay: 0 } },
	rest: { opacity: 0, transition: { duration: 0, delay: 1 } },
};

const PostActions: FC<PostActionsProps> = ({
	searchParam,
	postUserId,
	userId,
	additionUsage,
	userPage,
	ratingCount,
	commentsCount,
	postViews,
	usage = 'listPosts',
	postId,
	className,
	...props
}) => {
	const [copiedModal, setCopiedModal] = useState(false);
	const [fetching, setFetching] = useState(false);
	const controls = useAnimation();
	const { bookmarks, userInfo } = useTypedSelector((state) => state.user);
	const {
		setUserBookmarks,
		setPostInBookmarksData,
		setUserData,
		setFullPost,
		setPostOnPageData,
		setPostLeftTotalData,
		setPostInCategoryData,
		setPostInCategoryTotalData,
		setPostInCategoryTotalDataAll,
		setUserPostData,
		setUserPostTotalData,
		setSearchPagePostData,
		setSearchPagePostLeftData,
	} = useActions();
	const {
		postsOnPage,
		postsInCategory,
		userPosts,
		searchPagePosts,
		searchPagePostsLeft,
	} = useTypedSelector((state) => state.post);

	const category = useRouter().asPath.split('/')[2];

	const { fullPost } = useTypedSelector((state) => state.post);

	const showCopied = async () => {
		setCopiedModal(true);
		await controls.start('rest');
		setCopiedModal(false);
	};

	const shareHandler = (postId?: number) => {
		navigator.clipboard.writeText(`${clientUrl}news/${postId}`);
		showCopied();
	};

	const likeHandle = async (postId?: number) => {
		setFetching(true);
		try {
			if (postId) {
				const user = await Api().post.setLike(postId);
				setUserData(user);
				if (additionUsage === 'fullPost') {
					const post = await Api().post.findOnePost(postId);
					setFullPost(post);
				} else if (additionUsage === 'mainPage') {
					const { posts, left } = await Api().post.getAllPag(
						postsOnPage.length,
						postsOnPage[0].id,
						true
					);
					setPostOnPageData(posts);
					setPostLeftTotalData(left - postsOnPage.length);
				} else if (additionUsage === 'userPage') {
					if (userId) {
						const posts = await Api().post.getAllInUser(
							userId,
							'DESC',
							userPosts.length,
							userPosts[0].id,
							true
						);
						setUserPostData(posts.posts);
						setUserPostTotalData(posts.total - userPosts.length);
					}
				} else if (additionUsage === 'categoryPage') {
					if (category) {
						const posts = await Api().post.getAllInCategory(
							category,
							'DESC',
							postsInCategory.length,
							postsInCategory[0].id,
							true
						);
						setPostInCategoryData(posts.posts);
						setPostInCategoryTotalData(
							posts.total - postsInCategory.length
						);
						setPostInCategoryTotalDataAll(posts.total);
					}
				} else if (additionUsage === 'userPageBookmarks') {
					if (userId) {
						const bookmarks = await Api().user.getBookmark(userId);
						setPostInBookmarksData(bookmarks.posts);
					}
				} else if (additionUsage === 'searchPage') {
					if (searchParam) {
						const posts = await Api().post.search({
							title: searchParam,
							skip: 0,
							take: searchPagePosts.length,
							firstPostId: searchPagePosts[0].id,
						});
						setSearchPagePostLeftData(
							searchPagePostsLeft - takePostsForSearchPage
						);
						setSearchPagePostData(posts.posts);
					}
				}
			}
		} catch (e: any) {
			console.log(e?.response?.data?.message);
		} finally {
			setFetching(false);
		}
	};

	const bookmarkHandle = async (postId?: number) => {
		setFetching(true);
		try {
			if (postId) {
				const bookmarksFromApi = await Api().user.setBookmark(postId);
				setUserBookmarks(bookmarksFromApi);
				if (userPage && userInfo) {
					const bookmarks = await Api().user.getBookmark(userInfo.id);
					setPostInBookmarksData(bookmarks.posts);
				}
			}
		} catch (e: any) {
			console.log(e?.response?.data?.message);
		} finally {
			setFetching(false);
		}
	};

	// useEffect(() => {}, [fullPost]);

	return (
		<ul className={cn(className, styles.listItems)} {...props}>
			<li className={cn(styles.listItem, styles.views)}>
				<Tooltip text='Просмотры'>
					<Button
						typeButton='postIconButton'
						aria-label='просмотры количество'
					>
						<IoEyeOutline />
					</Button>
				</Tooltip>
				<p className={styles.text}>{`${postViews}`}</p>
			</li>
			{usage === 'listPosts' && (
				<Link href={`/news/${postId}#comment${postId}`} passHref>
					<li className={cn(styles.listItem, styles.comments)}>
						<Tooltip text='оставить комментарий'>
							<Button
								typeButton='postIconButton'
								aria-label='оставить комментарий'
							>
								<svg
									stroke='currentColor'
									fill='currentColor'
									strokeWidth='0'
									viewBox='0 0 512 512'
									height='1em'
									width='1em'
								>
									<path
										fill='none'
										strokeLinejoin='round'
										strokeWidth='32'
										d='M408 64H104a56.16 56.16 0 00-56 56v192a56.16 56.16 0 0056 56h40v80l93.72-78.14a8 8 0 015.13-1.86H408a56.16 56.16 0 0056-56V120a56.16 56.16 0 00-56-56z'
									></path>
								</svg>
							</Button>
						</Tooltip>
						<p className={styles.text}>{`${commentsCount}`}</p>
					</li>
				</Link>
			)}
			{usage === 'fullPost' && (
				<li className={cn(styles.listItem, styles.comments)}>
					<Tooltip text='оставить комментарий'>
						<Button
							typeButton='postIconButton'
							aria-label='оставить комментарий'
						>
							<svg
								stroke='currentColor'
								fill='currentColor'
								strokeWidth='0'
								viewBox='0 0 512 512'
								height='1em'
								width='1em'
							>
								<path
									fill='none'
									strokeLinejoin='round'
									strokeWidth='32'
									d='M408 64H104a56.16 56.16 0 00-56 56v192a56.16 56.16 0 0056 56h40v80l93.72-78.14a8 8 0 015.13-1.86H408a56.16 56.16 0 0056-56V120a56.16 56.16 0 00-56-56z'
								></path>
							</svg>
						</Button>
					</Tooltip>
					<p className={styles.text}>{`${commentsCount}`}</p>
				</li>
			)}

			<li className={cn(styles.listItem, styles.reposts)}>
				<Tooltip text='поставить like'>
					<Button
						typeButton='postIconButton'
						aria-label='кнопка like'
						onClick={() => likeHandle(postId)}
						disabled={fetching}
					>
						<svg
							stroke={
								userInfo?.rating
									.map((item) => item.post.id)
									.includes(postId!)
									? '#1d83e2'
									: 'currentColor'
							}
							fill='currentColor'
							strokeWidth='0'
							viewBox='0 0 512 512'
							height='1em'
							width='1em'
						>
							<path
								fill='none'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='32'
								d='M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0018 0c96.26-65.34 184.09-143.09 183-252.42-.54-52.67-42.32-96.81-95.08-96.81z'
							></path>
						</svg>
					</Button>
				</Tooltip>
				<p className={styles.text}>{`${ratingCount}`}</p>
			</li>
			{!userPage
				? userInfo?.id !== userId && (
						<li className={cn(styles.listItem, styles.favorite)}>
							<Tooltip text={`в${'\u00A0'}избранное`}>
								<Button
									typeButton='postIconButton'
									aria-label='кнопка в избранное'
									onClick={() => bookmarkHandle(postId)}
									disabled={copiedModal}
								>
									<svg
										stroke={
											bookmarks?.includes(postId!)
												? '#1d83e2'
												: 'currentColor'
										}
										fill='currentColor'
										strokeWidth='0'
										viewBox='0 0 512 512'
										height='1em'
										width='1em'
									>
										<path
											fill='none'
											strokeLinecap='round'
											strokeMiterlimit='10'
											strokeWidth='32'
											d='M80 464V68.14a8 8 0 014-6.9C91.81 56.66 112.92 48 160 48c64 0 145 48 192 48a199.53 199.53 0 0077.23-15.77 2 2 0 012.77 1.85v219.36a4 4 0 01-2.39 3.65C421.37 308.7 392.33 320 352 320c-48 0-128-32-192-32s-80 16-80 16'
										></path>
									</svg>
								</Button>
							</Tooltip>
						</li>
				  )
				: postUserId !== userInfo?.id && (
						<li className={cn(styles.listItem, styles.favorite)}>
							<Tooltip text={`в${'\u00A0'}избранное`}>
								<Button
									typeButton='postIconButton'
									aria-label='кнопка в избранное'
									onClick={() => bookmarkHandle(postId)}
									disabled={copiedModal}
								>
									<svg
										stroke={
											bookmarks?.includes(postId!)
												? '#1d83e2'
												: 'currentColor'
										}
										fill='currentColor'
										strokeWidth='0'
										viewBox='0 0 512 512'
										height='1em'
										width='1em'
									>
										<path
											fill='none'
											strokeLinecap='round'
											strokeMiterlimit='10'
											strokeWidth='32'
											d='M80 464V68.14a8 8 0 014-6.9C91.81 56.66 112.92 48 160 48c64 0 145 48 192 48a199.53 199.53 0 0077.23-15.77 2 2 0 012.77 1.85v219.36a4 4 0 01-2.39 3.65C421.37 308.7 392.33 320 352 320c-48 0-128-32-192-32s-80 16-80 16'
										></path>
									</svg>
								</Button>
							</Tooltip>
						</li>
				  )}
			<li className={cn(styles.listItem, styles.share)}>
				<AnimatePresence exitBeforeEnter>
					{copiedModal && (
						<motion.div
							className={styles.copiedModal}
							initial={'rest'}
							animate={'click'}
							exit={'rest'}
							variants={clickVariants}
						>
							Скопировано в буфер
						</motion.div>
					)}
				</AnimatePresence>
				<Tooltip text='поделиться'>
					<Button
						typeButton='postIconButton'
						aria-label='кнопка поделиться'
						onClick={() => shareHandler(postId)}
						// disabled={fetching}
					>
						<svg
							stroke='currentColor'
							fill='currentColor'
							strokeWidth='0'
							viewBox='0 0 512 512'
							height='1em'
							width='1em'
						>
							<circle
								cx='128'
								cy='256'
								r='48'
								fill='none'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='32'
							></circle>
							<circle
								cx='384'
								cy='112'
								r='48'
								fill='none'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='32'
							></circle>
							<circle
								cx='384'
								cy='400'
								r='48'
								fill='none'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='32'
							></circle>
							<path
								fill='none'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='32'
								d='M169.83 279.53l172.34 96.94m0-240.94l-172.34 96.94'
							></path>
						</svg>
					</Button>
				</Tooltip>
			</li>
		</ul>
	);
};

export default React.memo(PostActions);
