import React, {
	ChangeEvent,
	DetailedHTMLProps,
	FC,
	HTMLAttributes,
	useEffect,
	useRef,
	useState,
} from 'react';
import cn from 'classnames';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.scss';
import Button from '../Button/Button';
import {
	IoMenuOutline,
	IoNotificationsOutline,
	IoChatboxEllipsesOutline,
	IoSearchOutline,
	IoCloseOutline,
} from 'react-icons/io5';
import { motion, Variants } from 'framer-motion';
import Modal from '../Modal/Modal';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useActions } from '../../hooks/useActions';
import { Api, baseUrl } from '../../utils/api';
import { useRouter } from 'next/router';
import Tooltip from '../Tooltip/Tooltip';
import SearchBlock from '../SearchBlock/SearchBlock';
import { RolesForUsers } from '../../types/user';

interface HeaderProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const hoverVariants: Variants = {
	hover: {
		backgroundColor: 'rgba(255, 255, 255, 0.999)',
		borderColor: 'rgba(190, 230, 248, 0.741)',
		boxShadow: '0 0 0 3px rgba(64, 229, 138, 0.103)',
		transition: {
			duration: 0,
		},
	},
	focus: {
		backgroundColor: 'rgba(255, 255, 255, 0.999)',
		borderColor: 'rgba(22, 171, 240, 0.479)',
		boxShadow: '0 0 0 3px rgba(64, 229, 138, 0.103)',
		transition: {
			duration: 0,
		},
	},
	rest: {
		backgroundColor: 'rgba(0, 0, 0, 0.05)',
		borderColor: 'rgba(0, 0, 0, 0)',
		boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.103)',
		transition: {
			duration: 0,
		},
	},
};

const Header: FC<HeaderProps> = ({ className, ...props }) => {
	const [isHover, setIsHover] = useState<boolean>(false);
	const [activeSearch, setActiveSearch] = useState<boolean>(false);
	const [searchValue, setSearchValue] = useState<string>('');
	const [timer, setTimer] = useState<any>(null);
	const { userInfo } = useTypedSelector((state) => state.user);
	const { searchPosts, searchPostsTotal } = useTypedSelector(
		(state) => state.post
	);
	const { menuIsOpenOption } = useTypedSelector((state) => state.option);
	const {
		setModalOpen,
		setUserData,
		setSearchPostData,
		setSearchPostTotalData,
		setMenuIsClose,
		setMenuIsOpen,
	} = useActions();
	const ref = useRef<HTMLDivElement>(null);
	const router = useRouter();

	const toggleSearch = () => {
		setActiveSearch(!activeSearch);
	};

	const menuHandler = () => {
		if (menuIsOpenOption) {
			setMenuIsClose();
		} else {
			setMenuIsOpen();
		}
	};

	useEffect(() => {
		setSearchValue('');
		setSearchPostData([]);
		setSearchPostTotalData(0);
		activeSearch && setActiveSearch(false);
	}, [router.asPath]);

	useEffect(() => {
		if (!searchValue) return;

		function handleClick(event: any) {
			if (ref.current && !ref.current.contains(event.target)) {
				setSearchValue('');
				setSearchPostData([]);
				setSearchPostTotalData(0);
			}
		}
		window.addEventListener('click', handleClick);

		return () => window.removeEventListener('click', handleClick);
	}, [searchValue]);

	const handleChangeInput = async (e: ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
		if (e.target.value.length === 0) {
		}
		if (timer) {
			clearTimeout(timer);
		}
		try {
			setTimer(
				setTimeout(async () => {
					const posts = await Api().post.search({
						title: e.target.value,
						skip: 0,
						take: 5,
					});
					setSearchPostData(posts.posts);
					setSearchPostTotalData(posts.total);
				}, 1000)
			);
		} catch (e: any) {
			console.log(e?.response?.data.message);
		}
	};

	const logout = async () => {
		try {
			await Api().user.logout();
			setUserData(null);
			router.push({ pathname: '/' });
		} catch (error: any) {
			console.log(error?.response?.data.message);
		}
	};

	return (
		<div className={cn(className, styles.header)} {...props}>
			<div className={styles.menuButton}>
				<Button
					typeButton='iconButton'
					aria-label='кнопка меню открыть'
					onClick={menuHandler}
				>
					<IoMenuOutline />
				</Button>
			</div>
			<Link href='/'>
				<a className={styles.logo}>
					{/* <Image
						height={45}
						src={'/logo.jpg'}
						alt='Logo'
						width={45}
						objectFit='cover'
						layout='fixed'
					/> */}
					LOGO
				</a>
			</Link>
			<div className={styles.searchButton}>
				<Tooltip text='поиск'>
					<Button
						typeButton='iconButton'
						onClick={toggleSearch}
						aria-label='кнопка открыть поиск'
					>
						<IoSearchOutline />
					</Button>
				</Tooltip>
			</div>
			<div
				className={cn(styles.searchContainer, {
					[styles.active]: activeSearch,
				})}
			>
				<motion.div
					className={styles.search}
					onHoverStart={() => {
						setIsHover(true);
					}}
					onHoverEnd={() => {
						setIsHover(false);
					}}
					ref={ref}
				>
					<IoSearchOutline />
					<motion.input
						placeholder='Поиск'
						variants={hoverVariants}
						whileFocus={'focus'}
						animate={isHover ? 'hover' : 'rest'}
						value={searchValue}
						onChange={handleChangeInput}
					/>
					{searchValue && searchPostsTotal > 0 && (
						<SearchBlock queryForPage={searchValue} />
					)}
				</motion.div>
			</div>
			{userInfo?.role !== RolesForUsers.GHOST &&
				userInfo &&
				router.asPath !== '/write' && (
					<Link href='/write'>
						<a className={styles.leftButton}>
							<Button
								typeButton='textButton'
								aria-label='кнопка написать статью'
							>
								Новая статья
							</Button>
						</a>
					</Link>
				)}
			<div className={styles.notificationButton}>
				<Tooltip text={`Посмотреть${'\u000A'}уведомления`}>
					<Button
						typeButton='iconButton'
						aria-label='кнопка уведомления'
					>
						{/* <IoNotificationsOutline /> */}
					</Button>
				</Tooltip>
			</div>
			<div className={styles.chatButton}>
				<Tooltip
					text={`Посмотреть${'\u000A'}личные${'\u000A'}сообщения`}
				>
					<Button
						typeButton='iconButton'
						aria-label='кнопка сообщения'
					>
						{/* <IoChatboxEllipsesOutline /> */}
					</Button>
				</Tooltip>
			</div>
			<div className={styles.avatarBlock}>
				{userInfo ? (
					router.asPath !== `/profile/${userInfo.id}` ? (
						<>
							<Link href={`/profile/${userInfo.id}`}>
								<a className={styles.avatar}>
									<Image
										height={45}
										src={`${baseUrl}${userInfo.picture}`}
										alt='avatar'
										width={45}
										objectFit='cover'
										layout='fixed'
										priority
									/>
								</a>
							</Link>
							<Tooltip text={`Выйти`} moveSide='left'>
								<IoCloseOutline onClick={logout} />
							</Tooltip>
						</>
					) : (
						<>
							<span className={styles.avatar}>
								<Image
									height={45}
									src={`${baseUrl}${userInfo.picture}`}
									alt='avatar'
									width={45}
									objectFit='cover'
									layout='fixed'
									priority
								/>
							</span>
							<Tooltip text={`Выйти`} moveSide='left'>
								<IoCloseOutline onClick={logout} />
							</Tooltip>
						</>
					)
				) : (
					<Button
						typeButton='textButton'
						onClick={() => setModalOpen()}
						aria-label='кнопка логин'
					>
						Войти
					</Button>
				)}
			</div>
			<Modal />
		</div>
	);
};

export default Header;
