import React, {
	DetailedHTMLProps,
	Dispatch,
	FC,
	HTMLAttributes,
	SetStateAction,
} from 'react';
import cn from 'classnames';
import styles from './Main.module.scss';
import Button from '../../../Button/Button';

interface MainProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	setFormType: Dispatch<SetStateAction<'main' | 'login' | 'register'>>;
	authType: 'loginType' | 'registerType';
}

const Main: FC<MainProps> = ({
	authType,
	setFormType,
	className,
	...props
}) => {
	return (
		<div className={cn(className, styles.main)} {...props}>
			<div className={styles.mainButtonsContainer}>
				<Button
					typeButton='loginFormButton'
					type='button'
					aria-label='кнопка'
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
								fillRule='evenodd'
								d='M484.7 132c3.56-11.28 0-19.48-15.75-19.48h-52.37c-13.21 0-19.31 7.18-22.87 14.86 0 0-26.94 65.6-64.56 108.13-12.2 12.3-17.79 16.4-24.4 16.4-3.56 0-8.14-4.1-8.14-15.37V131.47c0-13.32-4.06-19.47-15.25-19.47H199c-8.14 0-13.22 6.15-13.22 12.3 0 12.81 18.81 15.89 20.84 51.76V254c0 16.91-3 20-9.66 20-17.79 0-61-66.11-86.92-141.44C105 117.64 99.88 112 86.66 112H33.79C18.54 112 16 119.17 16 126.86c0 13.84 17.79 83.53 82.86 175.77 43.21 63 104.72 96.86 160.13 96.86 33.56 0 37.62-7.69 37.62-20.5v-47.66c0-15.37 3.05-17.93 13.73-17.93 7.62 0 21.35 4.09 52.36 34.33C398.28 383.6 404.38 400 424.21 400h52.36c15.25 0 22.37-7.69 18.3-22.55-4.57-14.86-21.86-36.38-44.23-62-12.2-14.34-30.5-30.23-36.09-37.92-7.62-10.25-5.59-14.35 0-23.57-.51 0 63.55-91.22 70.15-122'
							></path>
						</svg>
					</span>
					<span className={styles.label}>ВКонтакте</span>
				</Button>
				<Button
					typeButton='loginFormButton'
					type='button'
					aria-label='кнопка'
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
							<path d='M473.16 221.48l-2.26-9.59H262.46v88.22H387c-12.93 61.4-72.93 93.72-121.94 93.72-35.66 0-73.25-15-98.13-39.11a140.08 140.08 0 01-41.8-98.88c0-37.16 16.7-74.33 41-98.78s61-38.13 97.49-38.13c41.79 0 71.74 22.19 82.94 32.31l62.69-62.36C390.86 72.72 340.34 32 261.6 32c-60.75 0-119 23.27-161.58 65.71C58 139.5 36.25 199.93 36.25 256s20.58 113.48 61.3 155.6c43.51 44.92 105.13 68.4 168.58 68.4 57.73 0 112.45-22.62 151.45-63.66 38.34-40.4 58.17-96.3 58.17-154.9 0-24.67-2.48-39.32-2.59-39.96z'></path>
						</svg>
					</span>
					<span className={styles.label}>Google</span>
				</Button>
				<Button
					typeButton='loginFormButton'
					aria-label='кнопка'
					type='button'
					onClick={() =>
						setFormType(
							authType === 'loginType' ? 'login' : 'register'
						)
					}
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
							<rect
								width='416'
								height='320'
								x='48'
								y='96'
								fill='none'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='32'
								rx='40'
								ry='40'
							></rect>
							<path
								fill='none'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='32'
								d='M112 160l144 112 144-112'
							></path>
						</svg>
					</span>
					<span className={styles.label}>Почта</span>
				</Button>
			</div>
			<div className={styles.secondaryButtonsContainer}>
				<Button
					typeButton='loginFormButton'
					type='button'
					aria-label='кнопка'
				>
					<svg
						stroke='currentColor'
						fill='currentColor'
						strokeWidth='0'
						viewBox='0 0 512 512'
						height='1em'
						width='1em'
					>
						<path
							fillRule='evenodd'
							d='M480 257.35c0-123.7-100.3-224-224-224s-224 100.3-224 224c0 111.8 81.9 204.47 189 221.29V322.12h-56.89v-64.77H221V208c0-56.13 33.45-87.16 84.61-87.16 24.51 0 50.15 4.38 50.15 4.38v55.13H327.5c-27.81 0-36.51 17.26-36.51 35v42h62.12l-9.92 64.77H291v156.54c107.1-16.81 189-109.48 189-221.31z'
						></path>
					</svg>
				</Button>
				<Button
					typeButton='loginFormButton'
					type='button'
					aria-label='кнопка'
				>
					<svg
						stroke='currentColor'
						fill='currentColor'
						strokeWidth='0'
						viewBox='0 0 512 512'
						height='1em'
						width='1em'
					>
						<path d='M496 109.5a201.8 201.8 0 01-56.55 15.3 97.51 97.51 0 0043.33-53.6 197.74 197.74 0 01-62.56 23.5A99.14 99.14 0 00348.31 64c-54.42 0-98.46 43.4-98.46 96.9a93.21 93.21 0 002.54 22.1 280.7 280.7 0 01-203-101.3A95.69 95.69 0 0036 130.4c0 33.6 17.53 63.3 44 80.7A97.5 97.5 0 0135.22 199v1.2c0 47 34 86.1 79 95a100.76 100.76 0 01-25.94 3.4 94.38 94.38 0 01-18.51-1.8c12.51 38.5 48.92 66.5 92.05 67.3A199.59 199.59 0 0139.5 405.6a203 203 0 01-23.5-1.4A278.68 278.68 0 00166.74 448c181.36 0 280.44-147.7 280.44-275.8 0-4.2-.11-8.4-.31-12.5A198.48 198.48 0 00496 109.5z'></path>
					</svg>
				</Button>
				<Button
					typeButton='loginFormButton'
					type='button'
					aria-label='кнопка'
				>
					<svg
						stroke='currentColor'
						fill='currentColor'
						strokeWidth='0'
						viewBox='0 0 512 512'
						height='1em'
						width='1em'
					>
						<path d='M349.13 136.86c-40.32 0-57.36 19.24-85.44 19.24-28.79 0-50.75-19.1-85.69-19.1-34.2 0-70.67 20.88-93.83 56.45-32.52 50.16-27 144.63 25.67 225.11 18.84 28.81 44 61.12 77 61.47h.6c28.68 0 37.2-18.78 76.67-19h.6c38.88 0 46.68 18.89 75.24 18.89h.6c33-.35 59.51-36.15 78.35-64.85 13.56-20.64 18.6-31 29-54.35-76.19-28.92-88.43-136.93-13.08-178.34-23-28.8-55.32-45.48-85.79-45.48z'></path>
						<path d='M340.25 32c-24 1.63-52 16.91-68.4 36.86-14.88 18.08-27.12 44.9-22.32 70.91h1.92c25.56 0 51.72-15.39 67-35.11 14.72-18.77 25.88-45.37 21.8-72.66z'></path>
					</svg>
				</Button>
			</div>
		</div>
	);
};

export default Main;
