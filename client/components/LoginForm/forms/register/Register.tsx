import React, {
	DetailedHTMLProps,
	Dispatch,
	FC,
	HTMLAttributes,
	SetStateAction,
	useState,
} from 'react';
import cn from 'classnames';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { motion, Variants } from 'framer-motion';
import Button from '../../../Button/Button';
import styles from './Register.module.scss';
import { CreateUserDto } from '../../../../types/auth';
import { useActions } from '../../../../hooks/useActions';
import { Api } from '../../../../utils/api';

interface RegisterProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	setFormType: Dispatch<SetStateAction<'main' | 'login' | 'register'>>;
	authType: 'loginType' | 'registerType';
}

const schema = yup.object().shape({
	email: yup
		.string()
		.email('Неверный формат почты')
		.trim('В начале и конце не должно быть пробелов')
		.required('Почта обязательна'),
	nickName: yup
		.string()
		.required('Поле обязательно')
		.trim('В начале и конце не должно быть пробелов')
		.strict(true)
		.min(3, 'Минимум 3 символа')
		.max(30, 'Максимум 30 символов'),
	password: yup
		.string()
		.trim('В начале и конце не должно быть пробелов')
		.min(6, 'Пароль должен быть не менее 6 символов')
		.required('Пароль обязателен'),
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

const Register: FC<RegisterProps> = ({
	authType,
	setFormType,
	className,
	...props
}) => {
	const [isHover1, setIsHover1] = useState<boolean>(false);
	const [isHover2, setIsHover2] = useState<boolean>(false);
	const [isHover3, setIsHover3] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<null | string>(null);

	const { setModalClose } = useActions();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isValid, isSubmitting },
	} = useForm<CreateUserDto>({
		resolver: yupResolver(schema),
		mode: 'onChange',
		defaultValues: {
			email: '',
			password: '',
			nickName: '',
		},
	});

	const onSubmit: SubmitHandler<CreateUserDto> = async (
		dto: CreateUserDto
	) => {
		try {
			await Api().user.register({
				email: dto.email.trim(),
				nickName: dto.nickName.trim(),
				password: dto.password.trim(),
			});
			setValue('email', '');
			setValue('password', '');
			setValue('nickName', '');
			setErrorMessage(null);
			setModalClose();
		} catch (error: any) {
			if (error.response) {
				setErrorMessage(error.response?.data?.message);
			}
		}
	};

	return (
		<div className={cn(className, styles.register)} {...props}>
			<form
				className={styles.formContent}
				onSubmit={handleSubmit(onSubmit)}
			>
				<motion.input
					className={styles.formInput}
					{...register('nickName')}
					placeholder='nickName'
					onHoverStart={() => {
						setIsHover3(true);
					}}
					onHoverEnd={() => {
						setIsHover3(false);
					}}
					variants={hoverVariants}
					whileFocus={'focus'}
					animate={isHover3 ? 'hover' : 'rest'}
				/>
				{errors?.nickName?.message && (
					<span className={styles.formError}>
						{errors?.nickName?.message}
					</span>
				)}
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
					disabled={!isValid || isSubmitting}
					aria-label={`кнопка регистрация`}
				>
					{isSubmitting ? 'Отправка данных' : 'Зарегистрироваться'}
				</Button>
			</form>
		</div>
	);
};

export default Register;
