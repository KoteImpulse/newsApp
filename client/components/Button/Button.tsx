import React, { ForwardedRef, forwardRef, ReactNode } from 'react';
import cn from 'classnames';
import styles from './Button.module.scss';
import { HTMLMotionProps, motion, useAnimation, Variants } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<'button'> {
	children: ReactNode;
	typeButton:
		| 'iconButton'
		| 'textButton'
		| 'postIconButton'
		| 'leftMenuButton'
		| 'fullPostButton'
		| 'followButton'
		| 'loginFormButton'
		| 'submitFormButton'
		| 'closeButton';
}

const hoverVariants: Variants = {
	hover1: { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
	rest1: { backgroundColor: 'rgba(0, 0, 0, 0)' },
	hover2: {
		color: '#1d83e2',
		transition: { duration: 0 },
	},
	rest2: { color: '#000000', transition: { duration: 0 } },
};

const Button = (
	{ typeButton, className, children, ...props }: ButtonProps,
	ref: ForwardedRef<HTMLButtonElement>
): JSX.Element => {
	const hoverControls = useAnimation();

	const animateHover = () => {
		if (typeButton === 'iconButton') {
			hoverControls.start(hoverVariants.hover1);
		} else if (typeButton === 'submitFormButton') {
		} else {
			hoverControls.start(hoverVariants.hover2);
		}
	};
	const animateEndHover = () => {
		if (typeButton === 'iconButton') {
			hoverControls.start(hoverVariants.rest1);
		} else if (typeButton === 'submitFormButton') {
		} else {
			hoverControls.start(hoverVariants.rest2);
		}
	};

	return (
		<motion.button
			className={cn(className, styles.button, {
				[styles.iconButton]: typeButton === 'iconButton',
				[styles.textButton]: typeButton === 'textButton',
				[styles.postIconButton]: typeButton === 'postIconButton',
				[styles.menuButton]: typeButton === 'leftMenuButton',
				[styles.fullPostButton]: typeButton === 'fullPostButton',
				[styles.followButton]: typeButton === 'followButton',
				[styles.loginFormButton]: typeButton === 'loginFormButton',
				[styles.closeButton]: typeButton === 'closeButton',
				[styles.submitFormButton]: typeButton === 'submitFormButton',
			})}
			{...props}
			aria-label={`кнопка ${typeButton}`}
			animate={hoverControls}
			variants={hoverVariants}
			onHoverStart={() => {
				animateHover();
			}}
			onHoverEnd={() => {
				animateEndHover();
			}}
			ref={ref}
		>
			{typeButton === 'fullPostButton' && (
				<span className={styles.buttonLabel}>
					<b>{children}</b>
				</span>
			)}
			{typeButton !== 'fullPostButton' && (
				<span className={styles.buttonLabel}>{children}</span>
			)}
		</motion.button>
	);
};

export default motion(forwardRef(Button));
