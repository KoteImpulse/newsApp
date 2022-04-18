import React, { FC } from 'react';
import MainLayout from '../layout/MainLayout';

interface NotFoundProps {}

const NotFound: FC<NotFoundProps> = () => {
	return (
		<MainLayout title={`Ошибка 404`} description={`error page`}>
			<h1>Ошибка 404</h1>
			<h2>К сожалению, произошла непредвиденная ошибка</h2>
		</MainLayout>
	);
};

export default NotFound;
