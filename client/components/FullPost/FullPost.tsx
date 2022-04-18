import React, {
	DetailedHTMLProps,
	FC,
	HTMLAttributes,
	useEffect,
	useState,
} from 'react';
import cn from 'classnames';
import styles from './FullPost.module.scss';
import PostActions from '../PostActions/PostActions';
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import Button from '../Button/Button';
import { useRouter } from 'next/router';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { Api, baseUrl } from '../../utils/api';
import { editorParser } from '../../utils/editorParser';
import Tooltip from '../Tooltip/Tooltip';
import { useActions } from '../../hooks/useActions';
interface FullPostProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const hoverVariants: Variants = {
	hover: { color: '#1d83e2', transition: { duration: 0 } },
	rest: { color: '#000000', transition: { duration: 0 } },
};

const FullPost: FC<FullPostProps> = ({ className, ...props }) => {
	const [fetching, setFetching] = useState(false);

	const { userInfo } = useTypedSelector((state) => state.user);
	const { fullPost } = useTypedSelector((state) => state.post);
	const router = useRouter();
	const { title, body, user } = fullPost;
	const clickHandle = () => {
		router.push(`/write/${fullPost.id}`);
	};

	const { setUserData } = useActions();

	useEffect(() => {}, [fullPost]);

	const subscribeHandle = async () => {
		setFetching(true);
		try {
			const user1 = await Api().user.subscribe(user.id);
			setUserData(user1);
		} catch (e: any) {
			console.log(e?.response?.data?.message);
		} finally {
			setFetching(false);
		}
	};

	return (
		<div className={cn(className, styles.fullPost)} {...props}>
			{fullPost && (
				<div className={styles.container}>
					<div className={styles.mainText}>
						<h4 className={styles.postTitle}>{title}</h4>
						<div className={styles.postText}>
							{body.map((block) => {
								return editorParser(block);
							})}
						</div>
						{userInfo && userInfo.id === user.id && (
							<Button
								typeButton='postIconButton'
								aria-label='кнопка редактировать'
								className={styles.editButton}
								onClick={clickHandle}
							>
								<Tooltip text={`Редактировать пост`}>
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
						)}
					</div>
					<div className={styles.postActions}>
						<PostActions
							usage='fullPost'
							postViews={fullPost.views}
							postId={fullPost.id}
							commentsCount={fullPost.commentsCount}
							ratingCount={fullPost?.ratingCount || 0}
							additionUsage={'fullPost'}
							userId={fullPost.user.id}
						/>
					</div>
					<div className={styles.underPostBlock}>
						<div className={styles.userInfo}>
							<div className={styles.imageContainer}>
								<Image
									alt={'user avatar'}
									src={`${baseUrl}${fullPost.user.picture}`}
									width={50}
									height={50}
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
								<Link
									href={`/profile/${fullPost.user.id}`}
									passHref
								>
									<motion.a variants={hoverVariants}>
										<b className={styles.name}>
											{fullPost.user.nickName}
										</b>
									</motion.a>
								</Link>
							</motion.div>
						</div>
						{userInfo?.id !== user.id && (
							<motion.div className={styles.buttonsBlock}>
								{/* <Button
								typeButton='fullPostButton'
								className={styles.textButton}
								aria-label='кнопка написать'
							>
								<span className={styles.text}>Написать</span>
							</Button> */}
								<Button
									typeButton='fullPostButton'
									className={styles.subButton}
									aria-label='кнопка подписаться'
									onClick={subscribeHandle}
									disabled={fetching}
								>
									<span className={styles.icon}>
										<svg
											stroke='currentColor'
											fill='none'
											strokeWidth='0'
											viewBox='0 0 24 24'
											height='1em'
											width='1em'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth='2'
												d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
											></path>
										</svg>
									</span>
									<span className={styles.text}>
										{!userInfo?.subscriptions
											.map((item) => item.subscription.id)
											.includes(user.id)
											? 'Подписаться'
											: 'Отписаться'}
									</span>
								</Button>
							</motion.div>
						)}
					</div>
				</div>
			)}
			{!fullPost && <p>Не удалось загрузить пост</p>}
		</div>
	);
};

export default FullPost;
