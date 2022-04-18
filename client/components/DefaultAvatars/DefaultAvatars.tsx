import React, {
	DetailedHTMLProps,
	Dispatch,
	FC,
	HTMLAttributes,
	SetStateAction,
} from 'react';
import cn from 'classnames';
import styles from './DefaultAvatars.module.scss';
import Image from 'next/image';
import Link from 'next/link';

interface DefaultAvatarsProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	imageSrc: string | null;
	setImageSrc: Dispatch<SetStateAction<string | null>>;
	picture: Blob | null;
	setPicture: Dispatch<SetStateAction<Blob | null>>;
}

const DefaultAvatars: FC<DefaultAvatarsProps> = ({
	imageSrc,
	picture,
	setPicture,
	setImageSrc,
	className,
	...props
}) => {
	const defaultPicturies = [
		{ id: 1, title: 'первый', path: '/defaultAvatars/defaultAvatar.jpg' },
		{ id: 2, title: 'второй', path: '/defaultAvatars/defaultAvatar2.jpg' },
		{ id: 3, title: 'третий', path: '/defaultAvatars/defaultAvatar3.jpg' },
		{
			id: 4,
			title: 'четвертый',
			path: '/defaultAvatars/defaultAvatar4.jpg',
		},
		{ id: 5, title: 'пятый', path: '/defaultAvatars/defaultAvatar5.jpg' },
		{ id: 6, title: 'шестой', path: '/defaultAvatars/defaultAvatar6.jpg' },
		{ id: 7, title: 'седьмой', path: '/defaultAvatars/defaultAvatar7.jpg' },
	];
	const clickHandle = (path: string) => {
		if (picture) {
			setPicture(null);
		}
		if (imageSrc !== path) {
			setImageSrc(path);
		}
	};
	return (
		<div className={cn(className, styles.defaultAvatars)} {...props}>
			{defaultPicturies.map((picture) => {
				return (
					<div
						key={picture.id}
						className={styles.imageContainer}
						onClick={() => clickHandle(picture.path)}
					>
						<Image
							alt={'user avatar'}
							src={picture.path}
							width={100}
							height={100}
							objectFit='cover'
							layout='fixed'
							priority
						/>
					</div>
				);
			})}
		</div>
	);
};

export default DefaultAvatars;
