import React, { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import cn from 'classnames';
import styles from './Subscribers.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { baseUrl } from '../../utils/api';
import { shimmer, toBase64 } from '../../utils/editorParser';

interface SubscribersProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const Subscribers: FC<SubscribersProps> = ({ className, ...props }) => {
	const { userSubscriptions } = useTypedSelector((state) => state.user);

	return (
		<div className={cn(className, styles.subscribers)} {...props}>
			<b className={styles.title}>{'Подписки'}</b>

			{userSubscriptions.length === 0 ? (
				<p>Подписок еще нет</p>
			) : (
				<div className={styles.list}>
					{userSubscriptions.length > 0 &&
						userSubscriptions.map((item) => (
							<Link
								href={`/profile/${item.subscription.id}`}
								key={item.subscription.id}
							>
								<a>
									<div className={styles.imageContainer}>
										<Image
											alt={'user avatar'}
											src={`${baseUrl}${item.subscription.picture}`}
											width={50}
											height={50}
											objectFit='cover'
											layout='fixed'
											placeholder='blur'
											blurDataURL={`data:image/svg+xml;base64,${toBase64(
												shimmer(700, 475)
											)}`}
										/>
									</div>
								</a>
							</Link>
						))}
				</div>
			)}
		</div>
	);
};

export default Subscribers;
