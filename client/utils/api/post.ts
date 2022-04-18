import { AxiosInstance, AxiosResponse } from 'axios';
import {
	CreatePostDto,
	IPost,
	SearchPostDto,
	UpdatePostDto,
} from '../../types/post';
import { allUrls } from './index';

export const PostApi = (instance: AxiosInstance) => ({
	async getAll(
		take?: number,
		skip?: number
	): Promise<{ posts: IPost[]; total: number }> {
		const { data } = await instance.get<{
			posts: IPost[];
			total: number;
		}>(`${allUrls.posts}`, {
			params: { take, skip },
		});
		return data;
	},
	async getAllPag(
		take?: number,
		postId?: number,
		del?: boolean
	): Promise<{ posts: IPost[]; left: number }> {
		const { data } = await instance.get<{
			posts: IPost[];
			left: number;
		}>(`${allUrls.postsPag}`, {
			params: { take, postId, del },
		});
		return data;
	},
	async getAllInUser(
		userId: number,
		sortBy?: 'ASC' | 'DESC',
		take?: number,
		postId?: number,
		del?: boolean
	): Promise<{ posts: IPost[]; total: number }> {
		const { data } = await instance.get<{
			posts: IPost[];
			total: number;
		}>(allUrls.postsInUser, {
			params: { userId, sortBy, take, postId, del },
		});
		return data;
	},
	async getAllInCategory(
		slug: string,
		sortBy?: 'ASC' | 'DESC',
		take?: number,
		postId?: number,
		del?: boolean
	): Promise<{ posts: IPost[]; total: number }> {
		const { data } = await instance.get<{
			posts: IPost[];
			total: number;
		}>(`${allUrls.postsInCategory}${slug}`, {
			params: { sortBy, take, postId, del },
		});
		return data;
	},
	async getOne(id: number): Promise<IPost> {
		const { data } = await instance.get<IPost>(`${allUrls.posts}/${id}`);
		return data;
	},
	async findOnePost(id: number): Promise<IPost> {
		const { data } = await instance.get<IPost>(
			`${allUrls.findOnePost}/${id}`
		);
		return data;
	},
	async create(dto: CreatePostDto): Promise<IPost> {
		const { data } = await instance.post<CreatePostDto, { data: IPost }>(
			allUrls.posts,
			dto
		);
		return data;
	},
	async update(dto: UpdatePostDto, id: number): Promise<any> {
		const { data } = await instance.patch(`${allUrls.posts}/${id}`, dto);
		return data;
	},

	async remove(id: number): Promise<any> {
		const { data } = await instance.delete(`${allUrls.posts}/${id}`);
		return data;
	},

	async search(
		dto: SearchPostDto
	): Promise<{ posts: IPost[]; total: number }> {
		const { data } = await instance.get<{ posts: IPost[]; total: number }>(
			`${allUrls.search}`,
			{
				params: dto,
			}
		);
		return data;
	},

	async uploadPostImage(file: any): Promise<any> {
		const { data } = await instance.post(
			`${allUrls.postsUploadImage}`,
			file
		);
		return data;
	},

	async setLike(postId: number) {
		const { data } = await instance.post(
			`${allUrls.setLike}?postId=${postId}`
		);
		return data;
	},
});
