import React, {
	DetailedHTMLProps,
	Dispatch,
	FC,
	HTMLAttributes,
	SetStateAction,
	useState,
} from 'react';
import cn from 'classnames';
import styles from './Login.module.scss';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { motion, Variants } from 'framer-motion';
import Button from '../../../Button/Button';
import { LoginUserDto } from '../../../../types/auth';
import { UserApi } from '../../../../utils/api/user';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { useActions } from '../../../../hooks/useActions';
import { setCookie } from 'nookies';
import { Api } from '../../../../utils/api';

interface LoginProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	setFormType: Dispatch<SetStateAction<'main' | 'login' | 'register'>>;
	authType: 'loginType' | 'registerType';
}

const schema = yup.object().shape({
	email: yup.string().required('Почта обязательна'),
	password: yup.string().required('Пароль обязателен'),
});

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

const Login: FC<LoginProps> = ({
	authType,
	setFormType,
	className,
	...props
}) => {
	const [isHover1, setIsHover1] = useState<boolean>(false);
	const [isHover2, setIsHover2] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<null | string>(null);

	const { userInfo } = useTypedSelector((state) => state.user);
	const { setUserData, setModalClose, setOption, setUserBookmarks } =
		useActions();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isValid, isSubmitting },
	} = useForm<LoginUserDto>({
		resolver: yupResolver(schema),
		mode: 'onChange',
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit: SubmitHandler<LoginUserDto> = async (dto: LoginUserDto) => {
		try {
			const response = await Api().user.login(dto);
			setUserData(response.data);
			setOption(response.data.option);
			setUserBookmarks(response.data.bookmarks);
			setValue('email', '');
			setValue('password', '');
			setErrorMessage(null);
			setModalClose();
		} catch (error: any) {
			if (error.response) {
				setErrorMessage(error.response?.data?.message);
			}
		}
	};

	return (
		<div className={cn(className, styles.login)} {...props}>
			<form
				className={styles.formContent}
				onSubmit={handleSubmit(onSubmit)}
			>
				<motion.input
					className={styles.formInput}
					{...register('email')}
					placeholder='email'
					onHoverStart={() => {
						setIsHover1(true);
					}}
					onHoverEnd={() => {
						setIsHover1(false);
					}}
					variants={hoverVariants}
					whileFocus={'focus'}
					animate={isHover1 ? 'hover' : 'rest'}
				/>
				{errors?.email?.message && (
					<span className={styles.formError}>
						{errors?.email?.message}
					</span>
				)}
				<motion.input
					className={styles.formInput}
					{...register('password')}
					placeholder='password'
					onHoverStart={() => {
						setIsHover2(true);
					}}
					onHoverEnd={() => {
						setIsHover2(false);
					}}
					variants={hoverVariants}
					whileFocus={'focus'}
					animate={isHover2 ? 'hover' : 'rest'}
				/>
				{errors?.password?.message && (
					<span className={styles.formError}>
						{errors?.password?.message}
					</span>
				)}
				{errorMessage && (
					<span className={styles.formError}>{errorMessage}</span>
				)}
				<Button
					typeButton='submitFormButton'
					type='submit'
					className={styles.loginButton}
					aria-label={`кнопка войти`}
					disabled={!isValid || isSubmitting}
				>
					Войти
				</Button>
			</form>
		</div>
	);
};

export default Login;
