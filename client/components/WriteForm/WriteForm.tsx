import React, { DetailedHTMLProps, FC, HTMLAttributes, useState } from 'react';
import dynamic from 'next/dynamic';
import cn from 'classnames';
import * as yup from 'yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import styles from './WriteForm.module.scss';
import Button from '../Button/Button';
import { motion, Variants } from 'framer-motion';
import { OutputData } from '@editorjs/editorjs';
import { Api, clientUrl } from '../../utils/api';
import { IPost } from '../../types/post';
import { useRouter } from 'next/router';
import Tooltip from '../Tooltip/Tooltip';
import CategorySelector from '../CategorySelector/CategorySelector';
import { categories, CategoryList } from '../../types/category';

interface WriteFormProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	postData?: IPost;
}
interface Inputs {
	header: string;
}
const schema = yup.object().shape({
	header: yup
		.string()
		.trim('В начале и конце не должно быть пробелов')
		.strict(true)
		.min(3, 'Минимум 3 символа')
		.max(200, 'Максимум 200 символов')
		.required('Перед отправкой необходимо заполнить поле заголовка'),
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

const EditorComponent = dynamic(() => import('../Editor/Editor'), {
	ssr: false,
});

const WriteForm: FC<WriteFormProps> = ({ postData, className, ...props }) => {
	const [isHover1, setIsHover1] = useState<boolean>(false);
	const [isHover2, setIsHover2] = useState<boolean>(false);
	const [blocks, setBlocks] = useState<OutputData['blocks']>(
		postData ? postData?.body : []
	);
	const [selectedCategory, setSelectedCategory] = useState<CategoryList>(
		!postData ? categories[0] : postData.category
	);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<Inputs>({
		resolver: yupResolver(schema),
		mode: 'onSubmit',
		reValidateMode: 'onSubmit',
		defaultValues: {
			header: postData ? postData?.title : '',
		},
	});

	const handleCloseForm = () => {
		postData
			? router.push(`${clientUrl}news/${postData.id}`)
			: router.push(`${clientUrl}`);
	};

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		try {
			const title = data.header;
			if (!postData) {
				const post = await Api().post.create({
					title,
					body: blocks,
					category: selectedCategory,
				});
				await router.push(`/news/${post.id}`);
			} else {
				const post = await Api().post.update(
					{
						title,
						body: blocks,
						category: selectedCategory,
					},
					postData.id
				);
				await router.push(`/news/${postData.id}`);
			}
			setValue('header', postData ? data.header : '');
		} catch (e: any) {
			console.log(e?.response?.data.message);
			alert(`${e?.response?.data.message}`);
		}
	};

	return (
		<div className={cn(className, styles.writeForm)} {...props}>
			<Button
				typeButton='postIconButton'
				aria-label={
					postData ? 'отменить редактирование' : 'отменить создание'
				}
				className={styles.cancelEdit}
				onClick={() => handleCloseForm()}
				disabled={isSubmitting}
			>
				<Tooltip
					text={
						postData
							? 'отменить редактирование'
							: 'отменить создание'
					}
					moveSide='left'
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
							strokeWidth='32'
							d='M368 368L144 144m224 0L144 368'
						></path>
					</svg>
				</Tooltip>
			</Button>
			<form
				className={styles.commentForm}
				onSubmit={handleSubmit(onSubmit)}
			>
				<motion.input
					className={styles.formInput}
					{...register('header')}
					placeholder='Заголовок'
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
				{errors?.header?.message && (
					<span className={styles.formError}>
						{errors?.header?.message}
					</span>
				)}
				<div className={styles.editor}>
					{
						<EditorComponent
							onChange={(arr) => setBlocks(arr)}
							initialBlocks={postData ? postData?.body : []}
						/>
					}
				</div>
				<h4>{postData ? 'Категория:' : 'Выберете категорию:'}</h4>
				<CategorySelector
					className={styles.categorySelector}
					selectedCategory={selectedCategory}
					setSelectedCategory={setSelectedCategory}
				/>
				<Button
					typeButton='textButton'
					type='submit'
					aria-label={`кнопка Опубликовать`}
					disabled={isSubmitting || !blocks.length}
				>
					{postData ? 'Сохранить' : 'Опубликовать'}
				</Button>
			</form>
		</div>
	);
};

export default WriteForm;
