import React, {
	DetailedHTMLProps,
	Dispatch,
	FC,
	HTMLAttributes,
	SetStateAction,
	useState,
} from 'react';
import cn from 'classnames';
import styles from './CategorySelector.module.scss';
import { categories, CategoryList } from '../../types/category';
import { AnimatePresence, motion, Variants } from 'framer-motion';

interface CategorySelectorProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	selectedCategory: CategoryList;
	setSelectedCategory: Dispatch<SetStateAction<CategoryList>>;
}

const hoverVariants: Variants = {
	hover: {
		background: '#9b9b9b94',
		transition: { duration: 0 },
	},
	rest: { background: '#fff', transition: { duration: 0 } },
};

const CategorySelector: FC<CategorySelectorProps> = ({
	selectedCategory,
	setSelectedCategory,
	className,
	...props
}) => {
	const [isActive, setIsActive] = useState(false);

	return (
		<div className={cn(className, styles.categorySelector)} {...props}>
			<div
				className={styles.selectorButton}
				onClick={() => setIsActive(!isActive)}
			>
				{selectedCategory.title}
			</div>
			<AnimatePresence exitBeforeEnter>
				{isActive && (
					<motion.div
						className={styles.selectorOptions}
						animate={{ opacity: 1 }}
						initial={{ opacity: 0 }}
						exit={{ opacity: 0 }}
					>
						{categories.map((category) => {
							return (
								<motion.div
									key={category.id}
									className={styles.selectotOption}
									whileHover={'hover'}
									animate={'rest'}
									initial={'rest'}
									variants={hoverVariants}
									onClick={() => {
										setSelectedCategory(category);
										setIsActive(false);
									}}
								>
									{category.title}
								</motion.div>
							);
						})}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default CategorySelector;
