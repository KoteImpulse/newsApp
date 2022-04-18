import React, { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import cn from 'classnames';
import styles from './TabLoader.module.scss';

interface TabLoaderProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const TabLoader: FC<TabLoaderProps> = ({ className, ...props }) => {
	return (
		<div className={cn(className, styles.tabLoader)} {...props}>
			Идет загрузка данных...
		</div>
	);
};

export default TabLoader;
