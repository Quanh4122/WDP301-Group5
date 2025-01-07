import React from 'react';
import { useEffect, useState } from 'react';
import { TimeSleepView } from './components/TimeSleepView';
import { useAppDispatch } from '../../../redux/hooks';
import { completeFetching, startFetching } from '../../../redux/features/app/appSlice';
import { message } from 'antd';
import { TestUseCaseInterface } from '../../../../application/usecases/TestUseCase';

interface props {
    testUseCase: TestUseCaseInterface;
}

const TimeSleepPage = ({ testUseCase }: props) => {
    const dispatch = useAppDispatch();
    const [state, setState] = useState('');
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        initiateData();
    }, []);

    const initiateData = async () => {
        const times = [1, 2, 3, 4];
        await Promise.all(times.map((element) => getTimeSleep(element)));
        setState('Done fetching.');
    };

    const getTimeSleep = async (time: number) => {
        try {
            dispatch(startFetching());
            const responseData = await testUseCase.getTimeSleep({ time });
            return responseData;
        } catch (error: any) {
            messageApi.open({
                type: 'error',
                content: error?.message ?? 'Username or password is not correct!',
            });
        } finally {
            dispatch(completeFetching());
        }
    };

    return <TimeSleepView data={state} />;
};

export default TimeSleepPage;
