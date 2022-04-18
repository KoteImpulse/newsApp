import React, { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import cn from 'classnames';
import styles from './CommentProfile.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { IComment } from '../../types/comment';
import { IUserProfile, RolesForUsers } from '../../types/user';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { Api, baseUrl } from '../../utils/api';
import { formatDate } from '../../utils/formatDate';
import Button from '../Button/Button';
import { useActions } from '../../hooks/useActions';
import Tooltip from '../Tooltip/Tooltip';

interface CommentProfileProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	comment: IComment;
	user: IUserProfile;
}

const hoverVariants: Variants = {
	hover: { color: '#1d83e2', transition: { duration: 0 } },
	rest: { color: '#000000', transition: { duration: 0 } },
};

const CommentProfile: FC<CommentProfileProps> = ({
	comment,
	user,
	className,
	...props
}) => {
	const { userInfo } = useTypedSelector((state) => state.user);
	const { setUserCommentData, setUserCommentTotal, setUserCommentLeft } =
		useActions();
	const { userComments } = useTypedSelector((state) => state.comment);

	const { year, day, month } = formatDate(comment.createdAt.toString());

	const handleCommentRemove = async (commentId: number) => {
		try {
			await Api().comment.remove(commentId);
			const { comments, total } = await Api().comment.getAllInUser(
				user.id,
				'DESC',
				userComments.length,
				userComments[0].id,
				true
			);
			setUserCommentData(comments);
			setUserCommentLeft(total - comments.length);
			setUserCommentTotal(total);
		} catch (e: any) {
			console.log(e?.response?.data.message);
		}
	};

	return (
		<div className={cn(className, styles.сomment)} {...props}>
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
			<p className={styles.postText}>{comment.text}</p>
			<Link href={`/news/${comment.post.id}`} passHref>
				<motion.a whileHover='hover' animate='rest' initial='rest'>
					<motion.span
						className={styles.postTitle}
						variants={hoverVariants}
					>
						{comment.post.title}
					</motion.span>
				</motion.a>
			</Link>

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

export default React.memo(CommentProfile);
