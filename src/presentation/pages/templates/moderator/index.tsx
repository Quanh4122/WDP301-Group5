import React from 'react';
import { useEffect, useState } from 'react';
import { message } from 'antd';
import { ModeratorView } from './components/ModeratorView';
import { useAppDispatch } from '../../../redux/hooks';
import { completeFetching, startFetching } from '../../../redux/features/app/appSlice';
import { TestUseCaseInterface } from '../../../../application/usecases/TestUseCase';

interface props {
    testUseCase: TestUseCaseInterface;
}

const ModeratorPage = ({ testUseCase }: props) => {
    const [state, setState] = useState<string>('');
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useAppDispatch();

    useEffect(() => {
        initiateData();
    }, []);

    const initiateData = async () => {
        try {
            dispatch(startFetching());
            const results = await testUseCase.getModeratorAccess();
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

    return <ModeratorView data={state} />;
};

export default ModeratorPage;
