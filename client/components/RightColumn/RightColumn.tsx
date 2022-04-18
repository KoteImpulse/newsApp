import React, { FC, useEffect, useState } from 'react';
import cn from 'classnames';
import styles from './RightColumn.module.scss';
import { HTMLMotionProps, motion } from 'framer-motion';
import CommentItem from '../CommentItem/CommentItem';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useActions } from '../../hooks/useActions';
import { IComment } from '../../types/comment';
import { Api } from '../../utils/api';

interface RightColumnProps extends HTMLMotionProps<'div'> {}

const RightColumn: FC<RightColumnProps> = ({ className, ...props }) => {
	const [allComments, setAllComments] = useState<IComment[]>([]);
	const option = useTypedSelector((state) => state.option);
	const { userInfo } = useTypedSelector((state) => state.user);
	const { setSidePanelIsOpen, setSidePanelIsClose } = useActions();

	const { allComments: comments } = useTypedSelector(
		(state) => state.comment
	);

	useEffect(() => {
		setAllComments(comments);
	}, [comments]);

	const toggleVisible = async () => {
		try {
			if (option.sidePanelIsOpenOption) {
				setSidePanelIsClose();
				userInfo &&
					userInfo.isActivated &&
					(await Api().user.updateOptions(
						{ ...option, sidePanelIsOpenOption: false },
						userInfo.id
					));
			} else {
				setSidePanelIsOpen();
				userInfo &&
					userInfo.isActivated &&
					(await Api().user.updateOptions(
						{ ...option, sidePanelIsOpenOption: true },
						userInfo.id
					));
			}
		} catch (e: any) {
			console.log(e?.response?.data.message);
			alert(`${e?.response?.data.message}`);
		}
	};

	return (
		<motion.div
			className={cn(className, styles.rightColumn)}
			{...props}
			style={
				!option.sidePanelIsOpenOption
					? { width: '100px', justifySelf: 'end' }
					: { width: '100%' }
			}
		>
			<div className={styles.titleContainer}>
				<motion.h3
					className={styles.title}
					onClick={toggleVisible}
					style={
						!option.sidePanelIsOpenOption
							? {
									transform:
										'rotate(270deg) translateX(-50%)',
									marginBottom: 0,
							  }
							: {}
					}
				>
					<span className={styles.text}>Комментарии</span>
					<span className={styles.icon}>
						<motion.svg
							stroke='currentColor'
							fill='currentColor'
							strokeWidth='0'
							viewBox='0 0 512 512'
							height='1em'
							width='1em'
							style={
								!option.sidePanelIsOpenOption
									? { transform: 'rotate(180deg)' }
									: {}
							}
						>
							<path d='M256 294.1L383 167c9.4-9.4 24.6-9.4 33.9 0s9.3 24.6 0 34L273 345c-9.1 9.1-23.7 9.3-33.1.7L95 201.1c-4.7-4.7-7-10.9-7-17s2.3-12.3 7-17c9.4-9.4 24.6-9.4 33.9 0l127.1 127z'></path>
						</motion.svg>
					</span>
				</motion.h3>
			</div>
			<div className={styles.commentsArray}>
				<div className={styles.comments}>
					{option.sidePanelIsOpenOption &&
						comments &&
						allComments.map((comment) => (
							<CommentItem key={comment.id} comment={comment} />
						))}
				</div>
			</div>
		</motion.div>
	);
};

export default React.memo(RightColumn);
