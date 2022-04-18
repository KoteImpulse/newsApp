import React, { DetailedHTMLProps, FC, HTMLAttributes, useState } from 'react';
import cn from 'classnames';
import styles from './Comment.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { IComment } from '../../types/comment';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { Api, baseUrl } from '../../utils/api';
import { useActions } from '../../hooks/useActions';
import { formatDate } from '../../utils/formatDate';
import Button from '../Button/Button';
import Tooltip from '../Tooltip/Tooltip';
import AddCommentForm from '../AddCommentForm/AddCommentForm';
import { RolesForUsers } from '../../types/user';

interface CommentProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	comment: IComment;
	postId: number;
}

const hoverVariants: Variants = {
	hover: { color: '#1d83e2', transition: { duration: 0 } },
	rest: { color: '#000000', transition: { duration: 0 } },
};

const Comment: FC<CommentProps> = ({
	comment,
	postId,
	className,
	...props
}) => {
	const { userInfo } = useTypedSelector((state) => state.user);
	const {
		setCommentsData,
		setPostCommentData,
		setPostCommentTotal,
		setPostCommentLeft,
	} = useActions();
	const { commentsSortOption } = useTypedSelector((state) => state.option);
	const { year, day, month } = formatDate(comment.createdAt.toString());
	const { user, text, post } = comment;

	const { postComments } = useTypedSelector((state) => state.comment);
	const { setFullPost } = useActions();
	const [isEditComment, setIsEditComment] = useState<boolean>(false);

	const handleCommentRemove = async (commentId: number) => {
		try {
			await Api().comment.remove(commentId);
			const { comments, total } = await Api().comment.getAllInPost(
				postId,
				commentsSortOption === 0 ? 'DESC' : 'ASC',
				postComments.length,
				undefined,
				true
			);
			setPostCommentData(comments);
			setPostCommentLeft(total - comments.length);
			setPostCommentTotal(total);
			const allComments = await Api().comment.getAll();
			setCommentsData(allComments.comments);
			const post = await Api().post.findOnePost(postId);
			setFullPost(post);
		} catch (e: any) {
			console.log(e?.response?.data.message);
		}
	};

	const handleCommentEdit = () => {
		setIsEditComment(true);
	};

	return (
		<div className={cn(className, styles.сomment)} {...props}>
			<div className={styles.userInfo}>
				<div className={styles.imageContainer}>
					<Image
						alt={'user avatar'}
						src={`${baseUrl}${comment.user.picture}`}
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
					<Link href={`/profile/${user.id}`} passHref>
						<motion.a variants={hoverVariants}>
							<b>{user.nickName}</b>
						</motion.a>
					</Link>
				</motion.div>
				<span
					className={styles.createDate}
				>{`${year}.${day}.${month}`}</span>
			</div>
			{!isEditComment && <p className={styles.postText}>{text}</p>}
			{isEditComment && (
				<AddCommentForm
					postId={post.id}
					prevText={text}
					commentId={comment.id}
					isEditComment={isEditComment}
					setIsEditComment={setIsEditComment}
				/>
			)}
			{userInfo?.id === user.id &&
				(!isEditComment ? (
					<Button
						typeButton='postIconButton'
						aria-label='кнопка редактировать'
						className={styles.editButton}
						onClick={() => handleCommentEdit()}
					>
						<Tooltip text={`Редактировать комментарий`}>
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
									d='M364.13 125.25L87 403l-23 45 44.99-23 277.76-277.13-22.62-22.62zm56.56-56.56l-22.62 22.62 22.62 22.63 22.62-22.63a16 16 0 000-22.62h0a16 16 0 00-22.62 0z'
								></path>
							</svg>
						</Tooltip>
					</Button>
				) : (
					<Button
						typeButton='postIconButton'
						aria-label={'отменить редактирование'}
						className={styles.cancelEdit}
						onClick={() => setIsEditComment(false)}
					>
						<Tooltip
							text={'отменить редактирование'}
							moveSide='left'
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
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='32'
									d='M368 368L144 144m224 0L144 368'
								></path>
							</svg>
						</Tooltip>
					</Button>
				))}
			{(userInfo?.role === RolesForUsers.ADMIN ||
				userInfo?.role === RolesForUsers.MODERATOR) && (
				<Button
					typeButton='postIconButton'
					aria-label='кнопка удалить комментарий'
					className={styles.delete}
					onClick={() => handleCommentRemove(comment.id)}
				>
					<Tooltip text='удалить комментарий' moveSide='left'>
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
			{comment.createdAt !== comment.updatedAt && (
				<div className={styles.commentIsEdited}>edited</div>
			)}
		</div>
	);
};

export default React.memo(Comment);
