import React, { useEffect } from 'react';
import './App.css';
import { ConfigProvider } from 'antd';
import AppTheme from '../assets/styles/theme';
import Router from './router/Router';
import { AuthUseCaseInterface } from '../application/usecases/AuthUseCase';
import { TestUseCaseInterface } from '../application/usecases/TestUseCase';
import { UserStorageUseCaseInterface } from '../application/usecases/UserStorageUseCase';
import { UserUseCaseInterface } from '../application/usecases/UserUseCase';
export interface AppProps {
    authUseCase: AuthUseCaseInterface;
    testUseCase: TestUseCaseInterface;
    userStorageUseCase: UserStorageUseCaseInterface;
    userUseCase: UserUseCaseInterface;
}

function App(appProps: AppProps) {
    return (
        <ConfigProvider theme={AppTheme}>
            <Router {...appProps} />
        </ConfigProvider>
    );
}

export default App;
