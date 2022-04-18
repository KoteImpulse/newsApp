import React, { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import styles from './CommentItem.module.scss';
import { IComment } from '../../types/comment';
import { baseUrl } from '../../utils/api';
import { formatComment } from '../../utils/formatComment';

interface CommentItemProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	comment: IComment;
}

const hoverVariants: Variants = {
	hover: { color: '#1d83e2', transition: { duration: 0 } },
	rest: { color: '#000000', transition: { duration: 0 } },
};
const CommentItem: FC<CommentItemProps> = ({
	className,
	comment,
	...props
}) => {
	const { user, text, post } = comment;
	return (
		<div className={cn(className, styles.commentItem)} {...props}>
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
			</div>
			<p className={styles.postText}>{formatComment(text, 50, 55)}</p>
			<Link href={`/news/${post.id}`} passHref>
				<motion.a whileHover='hover' animate='rest' initial='rest'>
					<motion.span
						className={styles.postTitle}
						variants={hoverVariants}
					>
						{formatComment(post.title, 30, 35)}
					</motion.span>
				</motion.a>
			</Link>
		</div>
	);
};

export default React.memo(CommentItem);
