import { AxiosInstance, AxiosResponse } from 'axios';
import { CreateUserDto, LoginUserDto } from '../../types/auth';
import { IPost } from '../../types/post';
import {
	IUser,
	IUserAll,
	IUserLogin,
	IUserProfile,
	UpdateUserDto,
} from '../../types/user';
import { IOptionUpdate } from '../../types/userOptions';
import { allUrls } from './index';

export const UserApi = (instance: AxiosInstance) => ({
	async register(dto: CreateUserDto): Promise<AxiosResponse<string>> {
		const response = await instance.post<string>(allUrls.register, dto);
		return response;
	},

	async login(dto: LoginUserDto): Promise<AxiosResponse<IUser>> {
		const response = await instance.post<IUser>(allUrls.login, dto);
		return response;
	},

	async logout(): Promise<any> {
		await instance.post(allUrls.logout);
	},

	async refresh(): Promise<AxiosResponse<{ user: IUser; access: string }>> {
		const response = await instance.get<{ user: IUser; access: string }>(
			allUrls.refresh
		);
		return response;
	},

	async getProfile(): Promise<AxiosResponse<IUser>> {
		const response = await instance.get<IUser>(allUrls.profile);
		return response;
	},

	async getUserProfile(id: number): Promise<AxiosResponse<IUserProfile>> {
		const response = await instance.get<IUserProfile>(
			`${allUrls.users}/${id}`
		);
		return response;
	},

	async getAll(days?: number): Promise<AxiosResponse<IUserAll[]>> {
		const response = await instance.get<IUserAll[]>(allUrls.users, {
			params: { days: days },
		});
		return response;
	},

	async sendLink() {
		const response = await instance.post(allUrls.sendLink);
		return response;
	},

	async updatePicture(file: any, idUser: number) {
		const response = await instance.patch(
			`${allUrls.changeProfilePicture}${idUser}`,
			file
		);
		return response;
	},

	async setDefaultPicture(dto: any, idUser: number) {
		const response = await instance.patch(
			`${allUrls.changeProfilePictureDefault}${idUser}`,
			dto
		);
		return response;
	},

	async updateNickname(imageSrc: any, idUser: number) {
		const response = await instance.patch(
			`${allUrls.changeProfileNickname}${idUser}`,
			imageSrc
		);
		return response;
	},

	async updateOptions(dto: IOptionUpdate, idUser: number) {
		const response = await instance.patch(
			`${allUrls.changeProfileOptions}${idUser}`,
			dto
		);
		return response;
	},

	async setBookmark(postId: number) {
		const { data } = await instance.patch<number[]>(allUrls.setBookmark, {
			postToBookmarkId: postId,
		});
		return data;
	},

	async getBookmark(userId: number, del?: boolean) {
		const { data } = await instance.get<{ posts: IPost[]; total: number }>(
			allUrls.getBookmark,
			{ params: { userId, del } }
		);
		return data;
	},

	async subscribe(userId: number) {
		const { data } = await instance.get<IUser>(allUrls.subscribe, {
			params: { userToSubscribeId: userId },
		});
		return data;
	},
});
