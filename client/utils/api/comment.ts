import { AxiosInstance, AxiosResponse } from 'axios';
import {
	CreateCommentDto,
	IComment,
	UpdateCommentDto,
} from '../../types/comment';
import { allUrls } from './index';

export const CommentApi = (instance: AxiosInstance) => ({
	async getAll(): Promise<{ comments: IComment[]; total: number }> {
		const { data } = await instance.get<{
			comments: IComment[];
			total: number;
		}>(`${allUrls.commentsAll}`);
		return data;
	},

	async getAllInPost(
		postId: number,
		sortBy?: 'ASC' | 'DESC',
		take?: number,
		commentId?: number,
		del?: boolean
	): Promise<{ comments: IComment[]; total: number }> {
		const { data } = await instance.get<{
			comments: IComment[];
			total: number;
		}>(allUrls.commentsPost, {
			params: { postId, sortBy, take, commentId, del },
		});
		return data;
	},

	async getAllInUser(
		userId: number,
		sortBy?: 'ASC' | 'DESC',
		take?: number,
		commentId?: number,
		del?: boolean
	): Promise<{ comments: IComment[]; total: number }> {
		const { data } = await instance.get<{
			comments: IComment[];
			total: number;
		}>(allUrls.commentsUser, {
			params: { userId, sortBy, take, commentId, del },
		});
		return data;
	},

	async getOne(id: number): Promise<IComment> {
		const { data } = await instance.get<IComment>(
			`${allUrls.comments}/${id}`
		);
		return data;
	},

	async create(dto: CreateCommentDto): Promise<IComment> {
		const { data } = await instance.post<
			CreateCommentDto,
			{ data: IComment }
		>(allUrls.comments, dto);
		return data;
	},

	async update(dto: UpdateCommentDto, id: number): Promise<any> {
		const { data } = await instance.patch(`${allUrls.comments}/${id}`, dto);
		return data;
	},

	async remove(id: number): Promise<any> {
		const { data } = await instance.delete(`${allUrls.comments}/${id}`);
		return data;
	},
});
