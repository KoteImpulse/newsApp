import React, {
	DetailedHTMLProps,
	FC,
	HTMLAttributes,
	useEffect,
	useState,
} from 'react';
import cn from 'classnames';
import styles from './PostComments.module.scss';
import AddCommentForm from '../AddCommentForm/AddCommentForm';
import Tabs, { ITabs } from '../Tabs/Tabs';
import Comment from '../Comment/Comment';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { IComment } from '../../types/comment';
import { TabComment } from '../../types/userOptions';
import { useActions } from '../../hooks/useActions';
import { Api, takeCommentsInPost } from '../../utils/api';
import TabLoader from '../Loader/TabLoader/TabLoader';

interface PostCommentsProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const PostComments: FC<PostCommentsProps> = ({ className, ...props }) => {
	const [fetching, setFetching] = useState(false);
	const { userInfo } = useTypedSelector((state) => state.user);
	const { postComments, postCommentsTotal, postCommentsLeft } =
		useTypedSelector((state) => state.comment);
	const { setPostCommentData, setPostCommentLeft } = useActions();
	const { commentsSortOption } = useTypedSelector((state) => state.option);
	const [isLoading, setIsLoading] = useState(false);

	const { fullPost } = useTypedSelector((state) => state.post);

	useEffect(() => {
		(async () => {
			try {
				if (
					commentsSortOption === TabComment.DESC &&
					postCommentsTotal > 0
				) {
					setIsLoading(true);
					const { comments, total } = await Api()
						.comment.getAllInPost(
							fullPost.id,
							'DESC',
							takeCommentsInPost
						)
						.finally(() => setFetching(false));
					setPostCommentData(comments);
					setPostCommentLeft(total - takeCommentsInPost);
					setIsLoading(false);
				} else if (
					commentsSortOption === TabComment.ASC &&
					postCommentsTotal > 0
				) {
					setIsLoading(true);
					const { comments, total } = await Api()
						.comment.getAllInPost(
							fullPost.id,
							'ASC',
							takeCommentsInPost
						)
						.finally(() => setFetching(false));
					setPostCommentData(comments);
					setPostCommentLeft(total - takeCommentsInPost);
					setIsLoading(false);
				}
			} catch (e: any) {
				console.log(e?.response?.data?.message);
			}
		})();
	}, [commentsSortOption]);

	useEffect(() => {
		(async () => {
			if (fetching === true) {
				try {
					if (commentsSortOption === TabComment.DESC) {
						const { comments, total } = await Api()
							.comment.getAllInPost(
								fullPost.id,
								'DESC',
								takeCommentsInPost,
								postComments[postComments.length - 1].id
							)
							.finally(() => setFetching(false));
						setPostCommentData([...postComments, ...comments]);
						setPostCommentLeft(total - takeCommentsInPost);
					} else {
						const { comments, total } = await Api()
							.comment.getAllInPost(
								fullPost.id,
								'ASC',
								takeCommentsInPost,
								postComments[postComments.length - 1].id
							)
							.finally(() => setFetching(false));
						setPostCommentData([...postComments, ...comments]);
						setPostCommentLeft(total - takeCommentsInPost);
					}
				} catch (e: any) {
					console.log(e?.response?.data?.message);
				}
			}
		})();
	}, [fetching, commentsSortOption]);

	useEffect(() => {
		document.addEventListener('scroll', scrollHandlerPost);
		return () => {
			document.removeEventListener('scroll', scrollHandlerPost);
		};
	}, [postComments, postCommentsLeft, commentsSortOption]);

	const scrollHandlerPost = (e: any) => {
		if (
			e?.target?.documentElement?.scrollHeight -
				(e?.target?.documentElement?.scrollTop + window.innerHeight) <
			100
		) {
			if (
				commentsSortOption === TabComment.DESC &&
				postCommentsLeft > 0
			) {
				setFetching(true);
			}
			if (commentsSortOption === TabComment.ASC && postCommentsLeft > 0) {
				setFetching(true);
			}
		}
	};

	const tabs: ITabs[] = [
		{
			title: 'Сначала новые',
			id: TabComment.DESC,
		},
		{
			title: 'Сначала старые',
			id: TabComment.ASC,
		},
	];

	return (
		<div
			id={`comment${fullPost.id}`}
			className={cn(className, styles.postComments)}
			{...props}
		>
			<div
				className={cn(styles.container, {
					[styles.notAuth]: !userInfo || !userInfo.isActivated,
					[styles.auth]: userInfo,
				})}
			>
				<h6 className={styles.title}>{`${
					postCommentsTotal ? postCommentsTotal : 0
				} ${postCommentsTotal === 1 ? 'comment' : 'comments'}`}</h6>
				<div className={styles.tabsBlock}>
					<Tabs tabs={tabs} usage='FullPost' />
				</div>
				{userInfo && userInfo.isActivated && (
					<div className={styles.formInputBlock}>
						<AddCommentForm postId={fullPost.id} />
					</div>
				)}
				{!userInfo && (
					<h4>
						Дя отправки комментария необходимо зарегистрироваться и
						подтвердить почту
					</h4>
				)}
				<div className={styles.commentsBlock}>
					{isLoading && <TabLoader />}
					{postComments &&
						postComments.map((comment: IComment, index) => (
							<Comment
								key={`${comment.id}/${index}`}
								comment={comment}
								postId={fullPost.id}
							/>
						))}
					{fetching && <TabLoader />}
					{!postComments && (
						<span>{`Не удалось загрузить комментарии`}</span>
					)}
				</div>
			</div>
		</div>
	);
};

export default PostComments;
