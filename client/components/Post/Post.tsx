import React, { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import cn from 'classnames';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Post.module.scss';
import PostActions from '../PostActions/PostActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { IPost, IPostProfile, ResponsePostUser } from '../../types/post';
import { Api, baseUrl, takePostsForSearchPage } from '../../utils/api';
import Button from '../Button/Button';
import { motion, Variants } from 'framer-motion';
import { useActions } from '../../hooks/useActions';
import { editorParser } from '../../utils/editorParser';
import Tooltip from '../Tooltip/Tooltip';
import { RolesForUsers } from '../../types/user';

interface PostProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	imageUrl?: string;
	post: IPost | IPostProfile;
	userId?: number;
	user?: ResponsePostUser;
	category?: string;
	usage?:
		| 'mainPage'
		| 'userPage'
		| 'userPageBookmarks'
		| 'categoryPage'
		| 'searchPage';
	userPage?: boolean;
	postUserId?: number;
	searchParam?: string;
}

const hoverVariants: Variants = {
	hover: { color: '#1d83e2', transition: { duration: 0 } },
	rest: { color: '#000000', transition: { duration: 0 } },
};

const Post: FC<PostProps> = ({
	searchParam,
	postUserId,
	userPage,
	category,
	usage,
	user,
	userId,
	post,
	imageUrl,
	className,
	...props
}) => {
	const { userInfo } = useTypedSelector((state) => state.user);
	const {
		postsOnPage,
		userPosts,
		postsInCategory,
		searchPagePosts,
		searchPagePostsLeft,
		searchPagePostsTotal,
	} = useTypedSelector((state) => state.post);
	const {
		setPostOnPageData,
		setPostLeftTotalData,
		setUserPostData,
		setCommentsData,
		setUserPostTotalData,
		setPostInCategoryData,
		setPostInCategoryTotalData,
		setPostInCategoryTotalDataAll,
		setPostInBookmarksData,
		setPostInBookmarksTotalData,
		setSearchPagePostData,
		setSearchPagePostTotalData,
		setSearchPagePostLeftData,
	} = useActions();
	const handleRemove = async (id: number) => {
		try {
			await Api().post.remove(id);
			if (usage === 'mainPage') {
				const { posts, left } = await Api().post.getAllPag(
					postsOnPage.length,
					postsOnPage[0].id,
					true
				);
				setPostOnPageData(posts);
				setPostLeftTotalData(left - postsOnPage.length);
				const comments = await Api().comment.getAll();
				setCommentsData(comments.comments);
			} else if (usage === 'userPage') {
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
			} else if (usage === 'userPageBookmarks') {
				if (userId) {
					const posts = await Api().user.getBookmark(userId);
					setPostInBookmarksData(posts.posts);
					setPostInBookmarksTotalData(posts.total);
				}
			} else if (usage === 'categoryPage') {
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
			} else if (usage === 'searchPage') {
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
					setSearchPagePostTotalData(posts.total);
				}
			}
		} catch (e: any) {
			console.log(e?.response?.data.message);
		}
	};

	return (
		<div className={cn(className, styles.post)} {...props}>
			<h5 className={styles.title}>
				<Link href={`/news/${post.id}`}>
					<a>{post.title}</a>
				</Link>
			</h5>
			<div className={styles.postDescription}>
				{editorParser(post.description)}
			</div>

			<PostActions
				postId={post.id}
				usage='listPosts'
				postViews={post.views}
				commentsCount={post.commentsCount}
				ratingCount={post?.ratingCount || 0}
				className={styles.postActionsBlock}
				userPage={usage === 'userPageBookmarks' ? true : false}
				additionUsage={usage}
				userId={userId}
				postUserId={
					usage === 'userPageBookmarks' ? postUserId : undefined
				}
				searchParam={usage === 'searchPage' ? searchParam : undefined}
			/>
			{user && (
				<div className={styles.userInfo}>
					<div className={styles.imageContainer}>
						<Image
							alt={'user avatar'}
							src={`${baseUrl}${user.picture}`}
							width={24}
							height={24}
							objectFit='cover'
							layout='fixed'
						/>
					</div>

					<motion.div
						className={styles.linkItem}
						whileHover='hover'
						animate='rest'
						initial='rest'
					>
						<Link href={`/profile/${user?.id}`} passHref>
							<motion.a variants={hoverVariants}>
								<b>{user.nickName}</b>
							</motion.a>
						</Link>
					</motion.div>
				</div>
			)}
			{post.createdAt !== post.updatedAt && (
				<div className={styles.postIsEdited}>edited</div>
			)}
			{(userInfo?.role === RolesForUsers.ADMIN ||
				userInfo?.role === RolesForUsers.MODERATOR) && (
				<Button
					typeButton='postIconButton'
					aria-label='кнопка удалить пост'
					className={styles.delete}
					onClick={() => handleRemove(post.id)}
				>
					<Tooltip text='удалить пост' moveSide='left'>
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
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='32'
								d='M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320'
							></path>
							<path
								strokeLinecap='round'
								strokeMiterlimit='10'
								strokeWidth='32'
								d='M80 112h352'
							></path>
							<path
								fill='none'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='32'
								d='M192 112V72h0a23.93 23.93 0 0124-24h80a23.93 23.93 0 0124 24h0v40m-64 64v224m-72-224l8 224m136-224l-8 224'
							></path>
						</svg>
					</Tooltip>
				</Button>
			)}
		</div>
	);
};

export default React.memo(Post);
