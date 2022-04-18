import { NextPage } from 'next';
import React from 'react';
import MainLayout from '../layout/MainLayout';

const Messages: NextPage = () => {
	return <MainLayout title={`Личные сообщения`}>message page</MainLayout>;
};

export default Messages;
