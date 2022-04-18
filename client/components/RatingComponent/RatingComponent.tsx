import React, {
	DetailedHTMLProps,
	FC,
	HTMLAttributes,
	useEffect,
	useState,
} from 'react';
import cn from 'classnames';
import styles from './RatingComponent.module.scss';
import Tabs, { ITabs } from '../Tabs/Tabs';
import FollowButton from '../FollowButton/FollowButton';
import Image from 'next/image';
import { Api, baseUrl, clientUrl } from '../../utils/api';
import { daysOpt, TabRating } from '../../types/userOptions';
import Link from 'next/link';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useActions } from '../../hooks/useActions';

interface RatingComponentProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const RatingComponent: FC<RatingComponentProps> = ({ className, ...props }) => {
	const [fetching, setFetching] = useState(false);
	const { ratingActiveTabOption } = useTypedSelector((state) => state.option);
	const { usersRating, userInfo } = useTypedSelector((state) => state.user);
	const { setUsersRating } = useActions();

	const tabs: ITabs[] = [
		{
			title: 'За все время',
			id: TabRating.FIRSTOPT,
		},
		{
			title: `За ${daysOpt[0]} дней`,
			id: TabRating.SECONDOPT,
		},
		{
			title: `За ${daysOpt[1]} дней`,
			id: TabRating.THIRDOPT,
		},
	];

	useEffect(() => {
		(async () => {
			setFetching(true);
			try {
				if (ratingActiveTabOption === TabRating.FIRSTOPT) {
					const { data } = await Api()
						.user.getAll()
						.finally(() => setFetching(false));
					setUsersRating(data);
				} else if (ratingActiveTabOption === TabRating.SECONDOPT) {
					const { data } = await Api()
						.user.getAll(daysOpt[0])
						.finally(() => setFetching(false));
					setUsersRating(data);
				} else if (ratingActiveTabOption === TabRating.THIRDOPT) {
					const { data } = await Api()
						.user.getAll(daysOpt[1])
						.finally(() => setFetching(false));
					setUsersRating(data);
				}
			} catch (e: any) {
				console.log(e?.response?.data?.message);
			}
		})();
	}, [ratingActiveTabOption]);

	usersRating
		.filter((item) => item.post.length > 0)
		.filter((item) => {
			item.rating = item.post
				.map((item) => item.rating.length)
				.reduce((a, c) => (a = a + c));
			return item;
		});
	usersRating.sort((a, b) => b.rating - a.rating);

	return (
		<div className={cn(className, styles.ratingComponent)} {...props}>
			<div className={styles.pageHeader}>
				<h5 className={styles.title}>Рейтинг сообществ и блогов</h5>
				<p className={styles.textContent}>
					Десять лучших авторов и комментаторов, а также
					администраторы первых десяти сообществ из рейтинга 
				</p>
				<Tabs tabs={tabs} usage='RatingPage' />
			</div>
			<div className={styles.tableContent}>
				<div className={styles.tableHeader}>
					<div className={styles.col1}>Имя пользователя</div>
					<div className={styles.col2}>Рейтинг</div>
					<div className={styles.col3}></div>
				</div>
				{usersRating &&
					usersRating.map(
						(user) =>
							user.post.length > 0 && (
								<div className={styles.tableRow} key={user.id}>
									<div className={styles.col1}>
										<span>{user.id}</span>
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
										<Link
											href={`${clientUrl}profile/${user.id}`}
										>
											<a>
												<span
													className={
														styles.profileLink
													}
												>
													{user.nickName}
												</span>
											</a>
										</Link>
									</div>
									<div className={styles.col2}>
										{user.rating ? user.rating : 0}
									</div>
									<div className={styles.col3}>
										{userInfo?.id !== user.id && (
											<FollowButton userId={user.id} />
										)}
									</div>
								</div>
							)
					)}
				{usersRating.length === 0 && (
					<p>Нет результатов, удовлетворяющих условию</p>
				)}
			</div>
		</div>
	);
};

export default RatingComponent;
