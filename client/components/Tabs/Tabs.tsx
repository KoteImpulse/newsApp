import React, { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import cn from 'classnames';
import styles from './Tabs.module.scss';
import { AnimateSharedLayout, motion, Variants } from 'framer-motion';
import { useActions } from '../../hooks/useActions';
import { Api } from '../../utils/api';
import { useTypedSelector } from '../../hooks/useTypedSelector';

interface TabsProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	tabs: ITabs[];
	usage: 'FullPost' | 'UserProfile' | 'RatingPage' | 'CategoryPage';
}

export interface ITabs {
	title: string;
	id: number;
}

const variantsLink: Variants = {
	active: {
		color: 'var(--colorBlue)',
	},
	inactive: {
		color: '#000000',
	},
};

const Tabs: FC<TabsProps> = ({ usage, tabs, className, ...props }) => {
	const option = useTypedSelector((state) => state.option);
	const { userInfo } = useTypedSelector((state) => state.user);
	const { userActiveTabOption, commentsSortOption, ratingActiveTabOption } =
		useTypedSelector((state) => state.option);
	const { setUserActiveTab, setCommentsSort, setRatingActiveTab } =
		useActions();

	const optionsTab = (usage: string) => {
		switch (usage) {
			case 'UserProfile':
				return userActiveTabOption;
			case 'FullPost':
				return commentsSortOption;
			case 'RatingPage':
				return ratingActiveTabOption;
			case 'CategoryPage':
				return 'categoryActiveTabOption';
			default:
				break;
		}
	};

	const tabOption = optionsTab(usage);

	const onTabClick = async (index: any) => {
		if (tabOption === index) {
			return;
		}
		if (usage === 'UserProfile') {
			setUserActiveTab(index);
		} else if (usage === 'FullPost') {
			setCommentsSort(index);
		} else if (usage === 'RatingPage') {
			setRatingActiveTab(index);
		}

		try {
			if (usage === 'FullPost') {
				userInfo &&
					userInfo.isActivated &&
					(await Api().user.updateOptions(
						{
							...option,
							commentsSortOption: index,
						},
						userInfo.id
					));
			} else if (usage === 'UserProfile') {
				userInfo &&
					userInfo.isActivated &&
					(await Api().user.updateOptions(
						{
							...option,
							userActiveTabOption: index,
						},
						userInfo.id
					));
			} else if (usage === 'RatingPage') {
				userInfo &&
					userInfo.isActivated &&
					(await Api().user.updateOptions(
						{
							...option,
							ratingActiveTabOption: index,
						},
						userInfo.id
					));
			}
		} catch (e: any) {
			console.log(e?.response?.data.message);
			alert(`${e?.response?.data.message}`);
		}
	};

	return (
		<div className={cn(className, styles.tabs)} {...props}>
			<AnimateSharedLayout>
				<ul className={styles.tabLinks}>
					{tabs.map((tab) => (
						<motion.li
							key={tab?.id}
							className={styles.tab}
							animate={
								tabOption === tab?.id ? 'active' : 'inactive'
							}
							variants={variantsLink}
						>
							<button
								className={styles.tabLink}
								onClick={() => onTabClick(tab.id)}
							>
								<motion.span
									className={styles.tabTitle}
									animate={
										tabOption === tab?.id
											? 'active'
											: 'inactive'
									}
									variants={variantsLink}
								>
									{tab?.title}
								</motion.span>
							</button>
							{tabOption === tab?.id ? (
								<motion.div
									className={styles.underline}
									layoutId='underline'
									transition={{
										type: 'spring',
										duration: 0.5,
									}}
								/>
							) : null}
						</motion.li>
					))}
				</ul>
			</AnimateSharedLayout>
		</div>
	);
};

export default Tabs;
