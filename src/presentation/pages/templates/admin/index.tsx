import React from 'react';

import { useEffect, useState } from 'react';
import { message } from 'antd';
import { AdminView } from './components/AdminView';
import { useAppDispatch } from '../../../redux/hooks';
import { completeFetching, startFetching } from '../../../redux/features/app/appSlice';
import { TestUseCaseInterface } from '../../../../application/usecases/TestUseCase';

interface props {
    testUseCase: TestUseCaseInterface;
}

const AdminPage = ({ testUseCase }: props) => {
    const [state, setState] = useState<string>('');
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useAppDispatch();

    useEffect(() => {
        initiateData();
    }, []);

    const initiateData = async () => {
        try {
            dispatch(startFetching());
            const results = await testUseCase.getAdminAccess();
            setState(results?.message ?? '');
        } catch (error: any) {
            messageApi.open({
                type: 'error',
                content: error?.message ?? 'There is something wrong when fetching data!',
            });
        } finally {
            dispatch(completeFetching());
        }
    };

    return <AdminView data={state} />;
};

export default AdminPage;
