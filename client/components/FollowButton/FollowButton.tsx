import React, { DetailedHTMLProps, FC, HTMLAttributes, useState } from 'react';
import cn from 'classnames';
import styles from './FollowButton.module.scss';
import { IoCheckmarkOutline, IoAddOutline } from 'react-icons/io5';
import Button from '../Button/Button';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { Api } from '../../utils/api';
import { useActions } from '../../hooks/useActions';
import Tooltip from '../Tooltip/Tooltip';

interface FollowButtonProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	userId: number;
}

const FollowButton: FC<FollowButtonProps> = ({
	userId,
	className,
	...props
}) => {
	const [fetching, setFetching] = useState(false);

	const { userInfo } = useTypedSelector((state) => state.user);
	const followed = userInfo?.subscriptions
		.map((item) => item.subscription.id)
		.includes(userId);
	const { setUserData } = useActions();

	const subscribeHandle = async () => {
		setFetching(true);
		try {
			const user1 = await Api().user.subscribe(userId);
			setUserData(user1);
		} catch (e: any) {
			console.log(e?.response?.data?.message);
		} finally {
			setFetching(false);
		}
	};

	return (
		<div className={cn(className, styles.followButton)} {...props}>
			<Button
				typeButton='followButton'
				onClick={subscribeHandle}
				disabled={fetching}
			>
				{followed ? (
					<span className={styles.checkButton}>
						<Tooltip text='Отписаться' moveSide='left'>
							<IoCheckmarkOutline />
						</Tooltip>
					</span>
				) : (
					<span className={styles.addButton}>
						<Tooltip text='Подписаться' moveSide='left'>
							<IoAddOutline />
						</Tooltip>
					</span>
				)}
			</Button>
		</div>
	);
};

export default FollowButton;
