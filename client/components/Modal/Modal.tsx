import React, { FC } from 'react';
import cn from 'classnames';
import styles from './Modal.module.scss';
import {
	AnimatePresence,
	HTMLMotionProps,
	motion,
	Variants,
} from 'framer-motion';
import LoginForm from '../LoginForm/LoginForm';
import Button from '../Button/Button';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useActions } from '../../hooks/useActions';

interface ModalProps extends HTMLMotionProps<'div'> {}

const backDrop: Variants = {
	visible: { opacity: 1 },
	hidden: { opacity: 0 },
};
const modalVariants: Variants = {
	visible: { y: '30vh', opacity: 1, transition: { delay: 0.5 } },
	hidden: { y: '-100vh', opacity: 0 },
};

const Modal: FC<ModalProps> = ({ className, ...props }) => {
	const { isOpened } = useTypedSelector((state) => state.modal);
	const { setModalClose } = useActions();
	
	return (
		<AnimatePresence exitBeforeEnter>
			{isOpened && (
				<motion.div
					className={cn(className, styles.modal)}
					{...props}
					variants={backDrop}
					initial='hidden'
					animate={'visible'}
					exit='hidden'
				>
					<motion.div
						className={styles.container}
						variants={modalVariants}
					>
						<div className={styles.formContainer}>
							<LoginForm />
							<div className={styles.controlButtons}></div>
						</div>
						<Button
							typeButton='closeButton'
							onClick={() => setModalClose()}
							className={styles.closeButton}
							aria-label='кнопка закрыть'
						>
							<span className={styles.icon}>
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
										d='M368 368L144 144m224 0L144 368'
									></path>
								</svg>
							</span>
						</Button>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default Modal;
