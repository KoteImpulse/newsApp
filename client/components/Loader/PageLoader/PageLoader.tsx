import React, { FC, useEffect, useState } from 'react';
import styles from './PageLoader.module.scss';
import { HTMLMotionProps, motion } from 'framer-motion';
import { useRouter } from 'next/router';

interface PageLoaderProps extends HTMLMotionProps<'div'> {}

const PageLoader: FC<PageLoaderProps> = ({ className, ...props }) => {
	const router = useRouter();
	const [progress, setProgress] = useState(0);
	const [endThis, setEndThis] = useState(true);

	useEffect(() => {
		let timer: NodeJS.Timeout;

		const start = () => {
			setEndThis(false);
			setProgress(1);
			increment(1000, 500);
		};

		const increment = (max: number, min: number) => {
			max = Math.floor(max);
			min = Math.ceil(min);
			const timeout = Math.floor(Math.random() * (max - min + 1) + min);
			setProgress((progress) => {
				const percent = Math.round(Math.random() * 10);
				let next;
				if (endThis === true) {
					next = Math.max(progress + percent, 0);
				} else {
					next = Math.min(progress + percent, 90);
				}
				if (next <= 90) {
					timer = setTimeout(() => increment(1000, 500), timeout);
				} else {
				}
				return next;
			});
		};

		const complete = () => {
			setEndThis(true);
			clearTimeout(timer);
			setProgress(100);
		};

		router.events.on('routeChangeStart', start);
		router.events.on('routeChangeComplete', complete);
		router.events.on('routeChangeError', complete);

		return () => {
			clearTimeout(timer);
			router.events.off('routeChangeStart', start);
			router.events.off('routeChangeComplete', complete);
			router.events.off('routeChangeError', complete);
		};
	}, []);

	return (
		<motion.div className={styles.progress} {...props}>
			<motion.div
				className={styles.indicator}
				style={{
					width: `${progress}%`,
					opacity: progress > 0 && progress < 100 ? 1 : 0,
				}}
			/>
		</motion.div>
	);
};

export default PageLoader;
