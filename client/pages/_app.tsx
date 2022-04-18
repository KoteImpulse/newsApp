import React from 'react';
import Head from 'next/head';
import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import Header from '../components/Header/Header';
import { wrapper } from '../store';
import App from 'next/app';
import { setUserBookmarks, setUserData } from '../store/action-creators/user';
import { Api } from '../utils/api';
import Router from 'next/router';
import { parseCookies } from 'nookies';
import { setCommentsData } from '../store/action-creators/comment';
import { setOption } from '../store/action-creators/option';
import PageLoader from '../components/Loader/PageLoader/PageLoader';

const WrappedApp = ({ Component, pageProps }: AppProps) => {
	return (
		<>
			<Head>
				<title>NewProject</title>
				<link rel='icon' href='/favicon.ico' />
				<link rel='preconnect' href='https://fonts.googleapis.com' />
				<link
					rel='preconnect'
					href='https://fonts.gstatic.com'
					crossOrigin=''
				/>
				<meta name='robots' content='index' />
				<meta name='viewport' content='width=device-width' />
			</Head>
			<Header />
			<PageLoader />
			<Component {...pageProps} />
		</>
	);
};

WrappedApp.getInitialProps = wrapper.getInitialAppProps(
	(store) => async (context) => {
		const { ctx } = context;
		const dispatch = store.dispatch;
		try {
			if (ctx.req?.headers) {
				const response = await Api(ctx).user.refresh();
				dispatch(setUserData(response.data.user));
				dispatch(setOption(response.data.user.option));
				dispatch(setUserBookmarks(response.data.user.bookmarks));
				const cookie = parseCookies(ctx);
				if (!cookie.Authentication) {
					ctx?.res?.setHeader('Set-Cookie', response.data.access);
				}
			} else {
				const response = await Api().user.getProfile();
				dispatch(setUserData(response.data));
			}
		} catch (e: any) {
			ctx?.res?.setHeader(
				'Set-Cookie',
				'Authentication=; HttpOnly; Path=/; Secure; SameSite=Lax; Max-Age=0'
			);
			if (ctx.res && ctx.asPath === '/write') {
				ctx.res?.writeHead(302, {
					Location: '/404',
				});
				ctx.res?.end();
			} else if (!ctx.res && ctx.asPath === '/write') {
				Router.push('/404');
			}
			console.log(e.response?.data.message);
		}

		try {
			const response = await Api().comment.getAll();
			dispatch(setCommentsData(response.comments));
		} catch (e: any) {
			console.log(e.response?.data.message);
		}
		return {
			pageProps: {
				...(await App.getInitialProps(context)).pageProps,
				pathname: ctx.pathname,
			},
		};
	}
);

export default wrapper.withRedux(WrappedApp);
