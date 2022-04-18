import React, {
	ChangeEvent,
	DetailedHTMLProps,
	FC,
	HTMLAttributes,
	useRef,
	useState,
} from 'react';
import cn from 'classnames';
import styles from './SettingsForm.module.scss';
import Image from 'next/image';
import Button from '../Button/Button';

import { useTypedSelector } from '../../hooks/useTypedSelector';
import { Api, baseUrl, clientUrl } from '../../utils/api';
import Router from 'next/router';
import Tooltip from '../Tooltip/Tooltip';
import { motion, Variants } from 'framer-motion';
import DefaultAvatars from '../DefaultAvatars/DefaultAvatars';
import {
	daysOpt,
	TabComment,
	TabRating,
	TabUserProfile,
} from '../../types/userOptions';

interface SettingsFormProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const hoverVariants: Variants = {
	hover: {
		backgroundColor: 'rgba(255, 255, 255, 0.999)',
		borderColor: 'rgba(190, 230, 248, 0.741)',
		boxShadow: '0 0 0 3px rgba(64, 229, 138, 0.103)',
		transition: {
			duration: 0,
		},
	},
	focus: {
		backgroundColor: 'rgba(255, 255, 255, 0.999)',
		borderColor: 'rgba(22, 171, 240, 0.479)',
		boxShadow: '0 0 0 3px rgba(64, 229, 138, 0.103)',
		transition: {
			duration: 0,
		},
	},
	rest: {
		backgroundColor: '#f7f7f7',
		borderColor: 'rgba(0, 0, 0, 0)',
		boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.103)',
		transition: {
			duration: 0,
		},
	},
};

const SettingsForm: FC<SettingsFormProps> = ({ className, ...props }) => {
	const [picture, setPicture] = useState<Blob | null>(null);
	const [imageSrc, setImageSrc] = useState<string | null>(null);
	const [isHover, setIsHover] = useState<boolean>(false);
	const [clicked, setClicked] = useState<boolean>(false);

	const [picSending, setPicSending] = useState(false);
	const [nickSending, setNickSending] = useState(false);
	const [optSending, setOptSending] = useState(false);

	const { userInfo } = useTypedSelector((state) => state.user);
	const {
		commentsSortOption,
		userActiveTabOption,
		sidePanelIsOpenOption,
		menuIsOpenOption,
		ratingActiveTabOption,
	} = useTypedSelector((state) => state.option);
	const [nickNameValue, setNickNameValue] = useState<string>(
		userInfo ? userInfo.nickName : ''
	);
	const uploadFileInput = useRef<HTMLInputElement>(null);
	const [activeButton1, setActiveButton1] =
		useState<TabComment>(commentsSortOption);
	const [activeButton2, setActiveButton2] =
		useState<TabUserProfile>(userActiveTabOption);
	const [activeButton3, setActiveButton3] = useState<boolean>(
		sidePanelIsOpenOption
	);
	const [activeButton4, setActiveButton4] =
		useState<boolean>(menuIsOpenOption);
	const [activeButton5, setActiveButton5] = useState<TabRating>(
		ratingActiveTabOption
	);

	const onFileSelected = async (e: ChangeEvent<HTMLInputElement>) => {
		try {
			if (e.target.files) {
				setPicture(e?.target?.files[0]);
				const reader = new FileReader();
				reader.onload = (e) => {
					if (e.target) {
						setImageSrc(e.target.result as string);
					}
				};
				reader.readAsDataURL(e?.target?.files[0]);
			}
		} catch (e: any) {
			console.log(e?.response?.data?.message);
		}
	};

	const onSendDataPicture = async () => {
		setPicSending(true);
		if (picture) {
			try {
				const formData = new FormData();
				formData.append('picture', picture as Blob);
				if (userInfo) {
					await Api().user.updatePicture(formData, userInfo?.id);
				}
			} catch (e: any) {
				console.log(e?.response?.data?.message);
			}
		} else {
			try {
				if (userInfo && imageSrc && imageSrc.trim().length > 0) {
					await Api().user.setDefaultPicture(
						{ imageSrc: imageSrc },
						userInfo?.id
					);
				}
			} catch (e: any) {
				console.log(e?.response?.data?.message);
			}
		}
		Router.push(`${clientUrl}profile/${userInfo?.id}`);
	};

	const onSendDataNickName = async () => {
		setNickSending(true);
		try {
			if (
				nickNameValue.trim().length === 0 ||
				nickNameValue.trim().length === userInfo?.nickName.length
			) {
				return;
			}
			if (userInfo) {
				await Api().user.updateNickname(
					{ nickName: nickNameValue.trim() },
					userInfo?.id
				);
			}
		} catch (e: any) {
			console.log(e?.response?.data.message);
			alert(`${e?.response?.data.message}`);
		}
		Router.push(`${clientUrl}profile/${userInfo?.id}`);
	};

	const btnCheck =
		activeButton1 !== commentsSortOption ||
		activeButton2 !== userActiveTabOption ||
		activeButton3 !== sidePanelIsOpenOption ||
		activeButton4 !== menuIsOpenOption ||
		activeButton5 !== ratingActiveTabOption;

	const onSendDataOptions = async () => {
		setOptSending(true);
		try {
			if (btnCheck && userInfo) {
				await Api().user.updateOptions(
					{
						commentsSortOption: activeButton1,
						userActiveTabOption: activeButton2,
						sidePanelIsOpenOption: activeButton3,
						menuIsOpenOption: activeButton4,
						ratingActiveTabOption: activeButton5,
					},
					userInfo?.id
				);
			}
		} catch (e: any) {
			console.log(e?.response?.data?.message);
		}
		Router.push(`${clientUrl}profile/${userInfo?.id}`);
	};

	return (
		<div className={cn(className, styles.settingsForm)} {...props}>
			<div className={styles.changeAvatarBlock}>
				<h3 className={styles.blockHeader}>
					Изменение изображения пользователя
				</h3>
				<div className={styles.imageContainer}>
					<Image
						alt={'user avatar'}
						src={
							imageSrc
								? imageSrc
								: `${baseUrl}${userInfo?.picture}`
						}
						width={100}
						height={100}
						objectFit='cover'
						layout='fixed'
						priority
					/>
				</div>
				<h4 className={styles.blockSubHeader}>
					Выбрать стандартные изображения:
				</h4>

				<DefaultAvatars
					setImageSrc={setImageSrc}
					setPicture={setPicture}
					picture={picture}
					imageSrc={imageSrc}
				/>

				<input
					type={'file'}
					accept={'image/*'}
					style={{ display: 'none' }}
					ref={uploadFileInput}
					onChange={(e) => onFileSelected(e)}
				></input>
				<h4 className={styles.blockSubHeader}>или загрузить свое:</h4>

				<div className={styles.buttonsBlock}>
					<Button
						aria-label='кнопка настроек'
						typeButton='submitFormButton'
						type='button'
						className={styles.fileButton}
						onClick={() => uploadFileInput.current?.click()}
						whileHover={{ scale: 1.02 }}
					>
						Выбрать своё изображение
					</Button>
					<Tooltip text='Принять изменения'>
						<Button
							aria-label='кнопка настроек'
							className={styles.sendButton}
							typeButton='submitFormButton'
							type='button'
							onClick={onSendDataPicture}
							disabled={picSending || (!picture && !imageSrc)}
							whileHover={{ scale: 1.02 }}
						>
							Подтвердить
						</Button>
					</Tooltip>
				</div>
			</div>
			<div className={styles.nicknameBlock}>
				<h3 className={styles.blockHeader}>
					Изменение никнейма пользователя
				</h3>
				<motion.input
					className={styles.formNicknameChange}
					onFocus={() => setClicked(true)}
					onHoverStart={() => {
						setIsHover(true);
					}}
					onHoverEnd={() => {
						setIsHover(false);
					}}
					value={nickNameValue}
					variants={hoverVariants}
					whileFocus={'focus'}
					animate={isHover ? 'hover' : 'rest'}
					onChange={(e) =>
						setNickNameValue(e.target.value.trimLeft())
					}
				/>
				<Tooltip text='Принять изменения'>
					<Button
						aria-label='кнопка настроек'
						className={styles.sendButton}
						typeButton='submitFormButton'
						type='button'
						onClick={onSendDataNickName}
						disabled={
							nickNameValue.trim().length === 0 ||
							userInfo?.nickName === nickNameValue.trim() ||
							nickSending
						}
						whileHover={{ scale: 1.02 }}
					>
						Подтвердить
					</Button>
				</Tooltip>
			</div>
			<div className={styles.optionsBlock}>
				<h3 className={styles.blockHeader}>
					Изменение настроек пользователя
				</h3>
				<div className={styles.options}>
					<h4 className={styles.blockSubHeader}>
						Сортировка комментариев:
					</h4>
					<div className={styles.buttonsBlock}>
						<Button
							aria-label='кнопка настроек'
							typeButton='submitFormButton'
							type='button'
							className={styles.commentButton}
							animate={
								activeButton1 === TabComment.DESC
									? {
											border: '2px solid black',
											transition: { duration: 0 },
									  }
									: {
											border: '2px solid white',
											transition: { duration: 0 },
									  }
							}
							onClick={() => setActiveButton1(TabComment.DESC)}
						>
							DESC
						</Button>
						<Button
							aria-label='кнопка настроек'
							typeButton='submitFormButton'
							type='button'
							className={styles.commentButton}
							animate={
								activeButton1 === TabComment.ASC
									? {
											border: '2px solid black',
											transition: { duration: 0 },
									  }
									: {
											border: '2px solid white',
											transition: { duration: 0 },
									  }
							}
							onClick={() => setActiveButton1(TabComment.ASC)}
						>
							ASC
						</Button>
					</div>
					<h4 className={styles.blockSubHeader}>
						Вкладка в профиле:
					</h4>
					<div className={styles.buttonsBlock}>
						<Button
							aria-label='кнопка настроек'
							typeButton='submitFormButton'
							type='button'
							className={styles.userTabButton}
							animate={
								activeButton2 === TabUserProfile.POST
									? {
											border: '2px solid black',
											transition: { duration: 0 },
									  }
									: {
											border: '2px solid white',
											transition: { duration: 0 },
									  }
							}
							onClick={() =>
								setActiveButton2(TabUserProfile.POST)
							}
						>
							Посты
						</Button>
						<Button
							aria-label='кнопка настроек'
							typeButton='submitFormButton'
							type='button'
							className={styles.userTabButton}
							animate={
								activeButton2 === TabUserProfile.COMMENT
									? {
											border: '2px solid black',
											transition: { duration: 0 },
									  }
									: {
											border: '2px solid white',
											transition: { duration: 0 },
									  }
							}
							onClick={() =>
								setActiveButton2(TabUserProfile.COMMENT)
							}
						>
							Комментарии
						</Button>
						<Button
							aria-label='кнопка настроек'
							typeButton='submitFormButton'
							type='button'
							className={styles.userTabButton}
							animate={
								activeButton2 === TabUserProfile.BOOKMARK
									? {
											border: '2px solid black',
											transition: { duration: 0 },
									  }
									: {
											border: '2px solid white',
											transition: { duration: 0 },
									  }
							}
							onClick={() =>
								setActiveButton2(TabUserProfile.BOOKMARK)
							}
						>
							Закладки
						</Button>
					</div>
					<h4 className={styles.blockSubHeader}>
						Вкладка в рейтинге:
					</h4>
					<div className={styles.buttonsBlock}>
						<Button
							aria-label='кнопка настроек'
							typeButton='submitFormButton'
							type='button'
							className={styles.userTabButton}
							animate={
								activeButton5 === TabRating.FIRSTOPT
									? {
											border: '2px solid black',
											transition: { duration: 0 },
									  }
									: {
											border: '2px solid white',
											transition: { duration: 0 },
									  }
							}
							onClick={() => setActiveButton5(TabRating.FIRSTOPT)}
						>
							За все время
						</Button>
						<Button
							aria-label='кнопка настроек'
							typeButton='submitFormButton'
							type='button'
							className={styles.userTabButton}
							animate={
								activeButton5 === TabRating.SECONDOPT
									? {
											border: '2px solid black',
											transition: { duration: 0 },
									  }
									: {
											border: '2px solid white',
											transition: { duration: 0 },
									  }
							}
							onClick={() =>
								setActiveButton5(TabRating.SECONDOPT)
							}
						>
							{`За ${daysOpt[0]} дней`}
						</Button>
						<Button
							aria-label='кнопка настроек'
							typeButton='submitFormButton'
							type='button'
							className={styles.userTabButton}
							animate={
								activeButton5 === TabRating.THIRDOPT
									? {
											border: '2px solid black',
											transition: { duration: 0 },
									  }
									: {
											border: '2px solid white',
											transition: { duration: 0 },
									  }
							}
							onClick={() => setActiveButton5(TabRating.THIRDOPT)}
						>
							{`За ${daysOpt[1]} дней`}
						</Button>
					</div>
					<h4 className={styles.blockSubHeader}>
						Комментарии справа:
					</h4>
					<div className={styles.buttonsBlock}>
						<Button
							aria-label='кнопка настроек'
							typeButton='submitFormButton'
							type='button'
							className={styles.sideCommentsButton}
							animate={
								activeButton3 === false
									? {
											border: '2px solid black',
											transition: { duration: 0 },
									  }
									: {
											border: '2px solid white',
											transition: { duration: 0 },
									  }
							}
							onClick={() => setActiveButton3(false)}
						>
							Выкл
						</Button>
						<Button
							aria-label='кнопка настроек'
							typeButton='submitFormButton'
							type='button'
							className={styles.sideCommentsButton}
							animate={
								activeButton3 === true
									? {
											border: '2px solid black',
											transition: { duration: 0 },
									  }
									: {
											border: '2px solid white',
											transition: { duration: 0 },
									  }
							}
							onClick={() => setActiveButton3(true)}
						>
							Вкл
						</Button>
					</div>
					<h4 className={styles.blockSubHeader}>Меню слева:</h4>
					<div className={styles.buttonsBlock}>
						<Button
							aria-label='кнопка настроек'
							typeButton='submitFormButton'
							type='button'
							className={styles.menuButton}
							animate={
								activeButton4 === false
									? {
											border: '2px solid black',
											transition: { duration: 0 },
									  }
									: {
											border: '2px solid white',
											transition: { duration: 0 },
									  }
							}
							onClick={() => setActiveButton4(false)}
						>
							Выкл
						</Button>
						<Button
							aria-label='кнопка настроек'
							typeButton='submitFormButton'
							type='button'
							className={styles.menuButton}
							animate={
								activeButton4 === true
									? {
											border: '2px solid black',
											transition: { duration: 0 },
									  }
									: {
											border: '2px solid white',
											transition: { duration: 0 },
									  }
							}
							onClick={() => setActiveButton4(true)}
						>
							Вкл
						</Button>
					</div>
				</div>
				<Tooltip text='Принять изменения' moveSide='top'>
					<Button
						aria-label='кнопка настроек'
						className={styles.sendButton}
						typeButton='submitFormButton'
						type='button'
						onClick={onSendDataOptions}
						disabled={optSending || !btnCheck}
						whileHover={{ scale: 1.02 }}
					>
						Подтвердить
					</Button>
				</Tooltip>
			</div>
		</div>
	);
};

export default SettingsForm;
