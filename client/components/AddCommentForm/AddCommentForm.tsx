import React, {
	DetailedHTMLProps,
	Dispatch,
	FC,
	HTMLAttributes,
	SetStateAction,
	useState,
} from 'react';
import cn from 'classnames';
import styles from './AddCommentForm.module.scss';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { motion, Variants } from 'framer-motion';
import Button from '../Button/Button';
import { Api } from '../../utils/api';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useActions } from '../../hooks/useActions';
interface AddCommentFormProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	postId: number;
	isEditComment?: boolean;
	prevText?: string;
	commentId?: number;
	setIsEditComment?: Dispatch<SetStateAction<boolean>>;
}

interface Inputs {
	text: string;
}

const schema = yup.object().shape({
	text: yup
		.string()
		.required('Перед отправкой необходимо заполнить поле комментария')
		.trim('В начале и конце не должно быть пробелов')
		.strict(true)
		.min(1, 'Минимум 1 символа')
		.max(400, 'Максимум 400 символов'),
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

const AddCommentForm: FC<AddCommentFormProps> = ({
	setIsEditComment,
	commentId,
	prevText,
	isEditComment,
	postId,
	className,
	...props
}) => {
	const [clicked, setClicked] = useState<boolean>(false);
	const [isHover, setIsHover] = useState<boolean>(false);

	const { userInfo } = useTypedSelector((state) => state.user);
	const {
		setCommentsData,
		setPostCommentData,
		setPostCommentTotal,
		setFullPost,
	} = useActions();
	const { commentsSortOption } = useTypedSelector((state) => state.option);
	const { postComments, postCommentsLeft } = useTypedSelector(
		(state) => state.comment
	);

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<Inputs>({
		resolver: yupResolver(schema),
		mode: 'onSubmit',
		defaultValues: {
			text: isEditComment ? prevText : '',
		},
	});

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		try {
			if (isEditComment && commentId) {
				await Api().comment.update(
					{
						text: data.text,
					},
					commentId
				);
			} else {
				await Api().comment.create({
					text: data.text,
					postId: postId,
				});
			}
			if (isEditComment && setIsEditComment) {
				setIsEditComment(false);
			}
			setClicked(false);
			setValue('text', '');
			const { comments, total } = await Api().comment.getAllInPost(
				postId,
				commentsSortOption === 0 ? 'DESC' : 'ASC',
				postCommentsLeft > 0
					? postComments.length
					: postComments.length + 1
			);
			setPostCommentData(comments);
			setPostCommentTotal(total);
			const allComments = await Api().comment.getAll();
			setCommentsData(allComments.comments);
			const post = await Api().post.findOnePost(postId);
			setFullPost(post);
		} catch (e: any) {
			console.log(e.response?.data.message);
			if (isEditComment && setIsEditComment) {
				setIsEditComment(false);
			}
		}
	};

	if (!userInfo) {
		return null;
	}

	return (
		<div className={cn(className, styles.addCommentForm)} {...props}>
			<motion.form
				className={styles.commentForm}
				onSubmit={handleSubmit(onSubmit)}
				style={clicked ? { height: 'auto' } : { height: '100px' }}
			>
				<motion.textarea
					disabled={isSubmitting}
					className={styles.formInput}
					{...register('text')}
					placeholder='Написать комментарий...'
					rows={clicked ? 5 : 1}
					onFocus={() => setClicked(true)}
					onHoverStart={() => {
						setIsHover(true);
					}}
					onHoverEnd={() => {
						setIsHover(false);
					}}
					variants={hoverVariants}
					whileFocus={'focus'}
					animate={isHover ? 'hover' : 'rest'}
				/>
				{errors?.text?.message && (
					<span className={styles.formError}>
						{errors?.text?.message}
					</span>
				)}
				{clicked && (
					<Button
						className={styles.submitButton}
						type='submit'
						typeButton='textButton'
						aria-label={`кнопка Отправить`}
						disabled={isSubmitting}
					>
						Отправить
					</Button>
				)}
			</motion.form>
		</div>
	);
};

export default AddCommentForm;
