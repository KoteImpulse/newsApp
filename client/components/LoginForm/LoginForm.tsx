import React, { DetailedHTMLProps, FC, HTMLAttributes, useState } from 'react';
import cn from 'classnames';
import styles from './LoginForm.module.scss';
import Button from '../Button/Button';
import Main from './forms/main/Main';
import Login from './forms/login/Login';
import Register from './forms/register/Register';

interface LoginFormProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const LoginForm: FC<LoginFormProps> = ({ className, ...props }) => {
	const [formType, setFormType] = useState<'main' | 'login' | 'register'>(
		'main'
	);
	const [authType, setAuthType] = useState<'loginType' | 'registerType'>(
		'loginType'
	);

	return (
		<div className={cn(className, styles.loginForm)} {...props}>
			<h2 className={styles.title}>
				{authType === 'loginType'
					? `Вход через${formType === 'login' ? ' почту' : ''}`
					: `Регистрация с помощью${
							formType === 'register' ? ' почты' : ''
					  }`}
			</h2>

			<div className={styles.formType}>
				{formType === 'main' && (
					<Main setFormType={setFormType} authType={authType} />
				)}
				{formType === 'login' && (
					<Login setFormType={setFormType} authType={authType} />
				)}
				{formType === 'register' && (
					<Register setFormType={setFormType} authType={authType} />
				)}
			</div>
			<div className={styles.buttonsBlock}>
				{formType === 'main' && (
					<Button
						typeButton='loginFormButton'
						className={styles.authTypeSwitch}
						onClick={() => {
							setAuthType(
								authType === 'loginType'
									? 'registerType'
									: 'loginType'
							);
						}}
					>
						{authType === 'loginType' ? 'Регистрация' : 'Вход'}
					</Button>
				)}
				{formType !== 'main' && (
					<Button
						typeButton='closeButton'
						onClick={() => setFormType('main')}
						className={styles.backToMainFormType}
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
								fill='none'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='48'
								d='M244 400L100 256l144-144M120 256h292'
							></path>
						</svg>
						Назад
					</Button>
				)}
			</div>
		</div>
	);
};

export default LoginForm;
