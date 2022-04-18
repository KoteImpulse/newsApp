import React, {
	DetailedHTMLProps,
	FC,
	HTMLAttributes,
	useEffect,
	useState,
} from 'react';
import cn from 'classnames';
import Link from 'next/link';
import Image from 'next/image';
import styles from './LeftColumn.module.scss';
import {
	IoMenuOutline,
	IoTrendingUpOutline,
} from 'react-icons/io5';
import { HiOutlineFire } from 'react-icons/hi';
import Button from '../Button/Button';
import { motion, Variants } from 'framer-motion';
import { useRouter } from 'next/dist/client/router';
import { categories } from '../../types/category';

interface LeftColumnProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const menuItems = [
	{ text: 'Лента', icon: <HiOutlineFire />, path: '/' },
	{ text: 'Рейтинг', icon: <IoTrendingUpOutline />, path: '/rating' },
];

const hoverVariants: Variants = {
	hover: {
		background: 'rgba(255, 255, 255, 0.986)',
		transition: { duration: 0 },
	},
	rest: { background: 'var(--colorBackground)', transition: { duration: 0 } },
	active: {
		background: 'rgba(255, 255, 255, 0.986)',
		transition: { duration: 0 },
	},
};

const LeftColumn: FC<LeftColumnProps> = ({ className, ...props }) => {
	const router = useRouter();
	const [activeButton, setActiveButton] = useState<string>(router.asPath);

	useEffect(() => {
		setActiveButton(router.asPath);
	}, [router.asPath]);

	return (
		<div className={cn(className, styles.leftColumn)} {...props}>
			<div className={styles.menuHeader}>
				<div className={styles.menuButton}>
					<Button typeButton='iconButton' aria-label='кнопка меню'>
						<IoMenuOutline />
					</Button>
				</div>
				<Link href='/'>
					<a className={styles.logoLink}>
						<Image
							height={45}
							src={'/logo.jpg'}
							alt='Logo'
							width={45}
							objectFit='cover'
							layout='fixed'
						/>
					</a>
				</Link>
			</div>
			<div className={styles.menuScroll}>
				<div className={styles.scrollPart}>
					<ul className={styles.listItems}>
						{menuItems.map((item) => (
							<motion.li
								key={item.path}
								className={styles.listItem}
								whileHover='hover'
								animate={
									activeButton === item.path
										? 'active'
										: 'rest'
								}
								initial='rest'
								variants={hoverVariants}
								style={
									activeButton === item.path
										? {
												pointerEvents: 'none',
										  }
										: {}
								}
							>
								<Link href={item.path}>
									<a>
										<Button
											typeButton='leftMenuButton'
											className={styles.listButton}
											aria-label={`кнопка списка меню ${item.path}`}
										>
											<span className={styles.icon}>
												{item.icon}
											</span>
											<span className={styles.text}>
												{item.text}
											</span>
										</Button>
									</a>
								</Link>
							</motion.li>
						))}
					</ul>
					<ul className={styles.listCategoryItems}>
						{categories.map((item) => (
							<motion.li
								key={item.id}
								className={styles.listItem}
								whileHover='hover'
								animate={
									activeButton === `/category/${item.slug}`
										? 'active'
										: 'rest'
								}
								initial='rest'
								variants={hoverVariants}
								style={
									activeButton === item.slug
										? {
												pointerEvents: 'none',
												userSelect: 'none',
										  }
										: {}
								}
							>
								<Link href={`/category/${item.slug}`}>
									<a>
										<Button
											typeButton='leftMenuButton'
											className={styles.listButton}
											aria-label={`кнопка списка меню ${item.title}`}
										>
											<span
												className={
													styles.imageContainer
												}
											>
												<Image
													alt={'category avatar'}
													src={`${item.image}`}
													width={18}
													height={18}
													objectFit='cover'
													layout='fixed'
												/>
											</span>
											<span className={styles.text}>
												{item.title}
											</span>
										</Button>
									</a>
								</Link>
							</motion.li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default React.memo(LeftColumn);
