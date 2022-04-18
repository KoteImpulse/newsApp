import React, { DetailedHTMLProps, FC, HTMLAttributes, ReactNode } from 'react';
import cn from 'classnames';
import styles from './MainLayout.module.scss';
import LeftColumn from '../components/LeftColumn/LeftColumn';
import RightColumn from '../components/RightColumn/RightColumn';
import Head from 'next/head';
import { useTypedSelector } from '../hooks/useTypedSelector';

interface MainLayoutProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	children: ReactNode;
	hideComments?: boolean;
	hideMenu?: boolean;
	contentFullWidth?: boolean;
	title?: string;
	description?: string;
	keywords?: string;
}

const MainLayout: FC<MainLayoutProps> = ({
	keywords,
	description,
	title,
	contentFullWidth,
	hideComments,
	hideMenu,
	className,
	children,
	...props
}) => {
	const { menuIsOpenOption } = useTypedSelector((state) => state.option);

	return (
		<>
			<Head>
				<title>{title || 'Blog Project'}</title>
				<meta name='description' content={`${description}`} />
				<meta
					name='keywords'
					content={
						keywords ||
						'Blog, post, article, comment, user, profile'
					}
				/>
			</Head>
			<div
				className={cn(className, styles.mainLayout, {
					[styles.hideComments]: hideComments,
					[styles.hideMenu]: hideMenu,
				})}
				{...props}
			>
				{!hideMenu && (
					<div
						className={cn(styles.leftSide, {
							[styles.active]: menuIsOpenOption,
						})}
					>
						<LeftColumn />
					</div>
				)}
				<div
					className={cn(styles.content, {
						[styles.contentFull]: contentFullWidth,
						[styles.active]: menuIsOpenOption,
					})}
				>
					{children}
				</div>
				{!hideComments && (
					<div className={styles.rightSide}>
						<RightColumn />
					</div>
				)}
			</div>
		</>
	);
};

export default MainLayout;
