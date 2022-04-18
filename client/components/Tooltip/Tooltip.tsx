import React, { ForwardedRef, forwardRef, ReactNode, useState } from 'react';
import cn from 'classnames';
import styles from './Tooltip.module.scss';
import {
	AnimatePresence,
	HTMLMotionProps,
	motion,
	useAnimation,
	Variants,
} from 'framer-motion';
import { useActions } from '../../hooks/useActions';

interface TooltipProps extends HTMLMotionProps<'div'> {
	children: ReactNode;
	text: string;
	timer?: number;
	moveSide?: 'left' | 'right' | 'top' | 'bottom';
}

const hoverVariants: Variants = {
	hover: { opacity: 1, transition: { duration: 0, delay: 0.5 } },
	rest: { opacity: 0, transition: { duration: 0 } },
};

const Tooltip = (
	{ moveSide, text, timer, className, children, ...props }: TooltipProps,
	ref: ForwardedRef<HTMLDivElement>
): JSX.Element => {
	const [isActive, setIsActive] = useState(false);

	const showTip = () => {
		setIsActive(true);
	};

	const hideTip = () => {
		setIsActive(false);
	};

	return (
		<motion.div
			className={cn(className, styles.tooltipWrapper)}
			{...props}
			onHoverStart={showTip}
			onHoverEnd={hideTip}
			ref={ref}
		>
			{children}
			<AnimatePresence exitBeforeEnter>
				{isActive && (
					<motion.p
						className={cn(styles.tooltip, {
							[styles.moveLeft]: moveSide === 'left',
							[styles.moveRight]: moveSide === 'right',
							[styles.moveTop]: moveSide === 'top',
							[styles.moveBottom]: moveSide === 'bottom',
						})}
						initial={'rest'}
						animate={'hover'}
						exit={'rest'}
						variants={hoverVariants}
					>
						{text || 'описание'}
					</motion.p>
				)}
			</AnimatePresence>
		</motion.div>
	);
};

export default React.memo(motion(forwardRef(Tooltip)));
