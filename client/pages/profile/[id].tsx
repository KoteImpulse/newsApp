import React, { useEffect, useState } from 'react';
import MainLayout from '../../layout/MainLayout';
import { NextPage } from 'next';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import {
	Api,
	takeCommentsInPost,
	takeCommentsInUser,
	takePostsInUser,
} from '../../utils/api';
import { IUserProfile } from '../../types/user';
import { wrapper } from '../../store';
import {
	setUserCommentData,
	setUserCommentLeft,
	setUserCommentTotal,
} from '../../store/action-creators/comment';
import {
	setPostInBookmarksData,
	setPostInBookmarksTotalData,
	setUserPostData,
	setUserPostTotalData,
} from '../../store/action-creators/post';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { TabUserProfile } from '../../types/userOptions';
import { setUsersSubscriptions } from '../../store/action-creators/user';

interface ProfileIdPageProps {
	user: IUserProfile;
}

const ProfileId: NextPage<ProfileIdPageProps> = ({ user }) => {
	const [fetching, setFetching] = useState(false);
	const {
		setUserPostData,
		setUserPostTotalData,
		setUserCommentData,
		setUserCommentLeft,
	} = useActions();
	const { userPosts, userPostsTotal } = useTypedSelector(
		(state) => state.post
	);
	const { userComments, userCommentsLeft } = useTypedSelector(
		(state) => state.comment
	);
	const { userActiveTabOption } = useTypedSelector((state) => state.option);

	useEffect(() => {}, [user.id, userActiveTabOption]);
	
	useEffect(() => {
		(async () => {
			try {
				if (fetching === true) {
					if (userActiveTabOption === TabUserProfile.POST) {
						const { posts, total: totalPosts } = await Api()
							.post.getAllInUser(
								user.id,
								'DESC',
								takePostsInUser,
								userPosts[userPosts.length - 1].id
							)
							.finally(() => setFetching(false));
						setUserPostData([...userPosts, ...posts]);
						setUserPostTotalData(totalPosts - takePostsInUser);
					}
					if (userActiveTabOption === TabUserProfile.COMMENT) {
						const { comments, total: totalComments } = await Api()
							.comment.getAllInUser(
								user.id,
								'DESC',
								takeCommentsInUser,
								userComments[userComments.length - 1].id
							)
							.finally(() => setFetching(false));
						setUserCommentData([...userComments, ...comments]);
						setUserCommentLeft(totalComments - takeCommentsInUser);
					}
				}
			} catch (e: any) {
				console.log(e?.response?.data?.message);
			}
		})();
	}, [fetching, userActiveTabOption]);

	useEffect(() => {
		document.addEventListener('scroll', scrollHandlerPost);
		return () => {
			document.removeEventListener('scroll', scrollHandlerPost);
		};
	}, [
		userPosts,
		userPostsTotal,
		userComments,
		userCommentsLeft,
		userActiveTabOption,
	]);

	const scrollHandlerPost = (e: any) => {
		if (
			e?.target?.documentElement?.scrollHeight -
				(e?.target?.documentElement?.scrollTop + window.innerHeight) <
			100
		) {
			if (
				userActiveTabOption === TabUserProfile.POST &&
				userPostsTotal > 0
			) {
				setFetching(true);
			}
			if (
				userActiveTabOption === TabUserProfile.COMMENT &&
				userCommentsLeft > 0
			) {
				setFetching(true);
			}
		}
	};

	return (
		<MainLayout
			contentFullWidth
			hideComments
			title={`Пользователь ${user.nickName}`}
			description={`user profile ${user.nickName}`}
		>
			<ProfileHeader user={user} fetching={fetching} />
		</MainLayout>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(
	(store) =>
		async (context: any): Promise<any> => {
			const id = context?.params.id;
			const dispatch = store.dispatch;
			try {
				const user = await Api().user.getUserProfile(id);
				dispatch(setUsersSubscriptions(user.data.subscriptions));
				try {
					const { comments, total: totalComments } =
						await Api().comment.getAllInUser(
							+id,
							'DESC',
							takeCommentsInUser,
							undefined
						);
					dispatch(setUserCommentData(comments));
					dispatch(setUserCommentTotal(totalComments));
					dispatch(
						setUserCommentLeft(totalComments - takeCommentsInPost)
					);
					const { posts, total: totalPosts } =
						await Api().post.getAllInUser(
							+id,
							'DESC',
							takePostsInUser
						);
					dispatch(setUserPostData(posts));
					dispatch(
						setUserPostTotalData(totalPosts - takePostsInUser)
					);
					const { posts: bookmarks, total: totalBookmarks } =
						await Api().user.getBookmark(user.data.id);
					dispatch(setPostInBookmarksData(bookmarks || []));
					dispatch(setPostInBookmarksTotalData(totalBookmarks || 0));

					return {
						props: {
							user: user.data,
						},
					};
				} catch (e: any) {
					console.log(e?.response?.data?.message);
					return {
						props: {
							user: user.data,
						},
					};
				}
			} catch (e: any) {
				console.log(e?.response?.data?.message);
				return {
					props: {},
					redirect: {
						destination: '/404',
						permanent: false,
					},
				};
			}
		}
);

export default ProfileId;
