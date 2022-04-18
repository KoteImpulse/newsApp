import React, {
	DetailedHTMLProps,
	FC,
	HTMLAttributes,
	useEffect,
	useState,
} from 'react';
import cn from 'classnames';
import styles from './ProfileHeader.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import Button from '../Button/Button';
import Tabs, { ITabs } from '../Tabs/Tabs';
import Post from '../Post/Post';
import { IUserProfile } from '../../types/user';
import CommentProfile from '../CommentProfile/CommentProfile';
import { formatDate } from '../../utils/formatDate';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { Api, baseUrl, takePostsInUser } from '../../utils/api';
import Tooltip from '../Tooltip/Tooltip';
import { TabUserProfile } from '../../types/userOptions';
import TabLoader from '../Loader/TabLoader/TabLoader';
import Subscribers from '../Subscribers/Subscribers';
import { useActions } from '../../hooks/useActions';

interface ProfileHeaderProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	user: IUserProfile;
	fetching: boolean;
}

const ProfileHeader: FC<ProfileHeaderProps> = ({
	fetching,
	user,
	className,
	...props
}) => {
	const [fetching1, setFetching1] = useState(false);
	const [isSending, setIsSending] = useState(false);
	const { year, month, day } = formatDate(user.createdAt.toString());
	const { userInfo, userSubscriptions } = useTypedSelector(
		(state) => state.user
	);
	const { userPosts, postsInBookmarks, userPostsTotal } = useTypedSelector(
		(state) => state.post
	);
	const { userComments, userCommentsTotal: total } = useTypedSelector(
		(state) => state.comment
	);
	const { userActiveTabOption } = useTypedSelector((state) => state.option);
	const { setUserData } = useActions();

	useEffect(() => {}, [user.id, userPosts, postsInBookmarks]);

	const sendMailLink = async () => {
		try {
			setIsSending(true);
			await Api().user.sendLink();
			setIsSending(false);
		} catch (e: any) {
			console.log(e?.response?.data?.message);
		}
	};

	const subscribeHandle = async () => {
		setFetching1(true);
		try {
			const user1 = await Api().user.subscribe(user.id);
			setUserData(user1);
		} catch (e: any) {
			console.log(e?.response?.data?.message);
		} finally {
			setFetching1(false);
		}
	};

	const tabs: ITabs[] = [
		{
			title: 'Статьи',
			id: TabUserProfile.POST,
		},
		{
			title: 'Комментарии',
			id: TabUserProfile.COMMENT,
		},
		{
			title: 'Закладки',
			id: TabUserProfile.BOOKMARK,
		},
	];
	return (
		<div className={cn(className, styles.profileHeader)} {...props}>
			<div className={styles.container}>
				<div className={styles.userInfo}>
					<div className={styles.imageContainer}>
						<Image
							alt={'user avatar'}
							src={`${baseUrl}${user.picture}`}
							width={120}
							height={120}
							objectFit='cover'
							layout='fixed'
						/>
					</div>
					<div className={styles.linkItem}>
						<h4 className={styles.fullName}>{user.nickName}</h4>
					</div>
				</div>
				<div className={styles.buttonsBlock}>
					{userInfo?.id === user.id && userInfo?.isActivated && (
						<Link
							href={`/profile/${userInfo?.id}/settings`}
							passHref
						>
							<Button
								className={styles.settingsButton}
								typeButton='textButton'
								aria-label={`кнопка Настройки`}
							>
								Настройки
							</Button>
						</Link>
					)}
					{userInfo?.id === user.id && !userInfo.isActivated && (
						<Tooltip
							text='отправить ссылку активации повторно'
							moveSide='left'
							onClick={sendMailLink}
						>
							<Button
								className={styles.settingsButton}
								typeButton='textButton'
								aria-label={`кнопка оправить ссылку повторно`}
								disabled={isSending}
							>
								Отправить
							</Button>
						</Tooltip>
					)}
					{userInfo?.id !== user.id && (
						<Button
							className={styles.writeButton}
							typeButton='textButton'
							aria-label={`кнопка подписаться`}
							onClick={subscribeHandle}
							disabled={fetching1}
						>
							{!userInfo?.subscriptions
								.map((item) => item.subscription.id)
								.includes(user.id)
								? 'Подписаться'
								: 'Отписаться'}
						</Button>
					)}
				</div>

				<div className={styles.userStats}>
					<div className={styles.cont}>
						<p className={styles.rating}>{total} комментариев</p>
						<p className={styles.rating}>
							{userPostsTotal + takePostsInUser} постов
						</p>
						<p className={styles.subs}>{user?.subscriptions.length} subs</p>
					</div>
					<p
						className={styles.date}
					>{`На проекте с ${day}.${month}.${year} года`}</p>
				</div>
				<div className={styles.tabsBlock}>
					<Tabs tabs={tabs} usage='UserProfile' />
				</div>
			</div>
			<div className={styles.contentBlock}>
				<div className={styles.texts}>
					{userActiveTabOption === 0 &&
						userPosts.length > 0 &&
						userPosts.map((item) => {
							return (
								<Post
									key={item.id}
									post={item}
									userId={user.id}
									usage='userPage'
									userPage={false}
								/>
							);
						})}
					{userActiveTabOption === 1 &&
						userComments &&
						userComments.map((item) => {
							return (
								<CommentProfile
									key={item.id}
									comment={item}
									user={user}
								/>
							);
						})}
					{userActiveTabOption === 2 &&
						postsInBookmarks &&
						postsInBookmarks.map((item) => {
							return (
								<Post
									key={item.id}
									post={item}
									userId={user.id}
									usage='userPageBookmarks'
									userPage={true}
									postUserId={item.user.id}
								/>
							);
						})}
					{fetching && <TabLoader />}
				</div>
				<Subscribers />
			</div>
		</div>
	);
};

export default ProfileHeader;
