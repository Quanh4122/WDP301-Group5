import { Col, Form, Input, Pagination, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_PARAMS, PARAMS } from '../../../../utilities/constants/PARAMETER';
import { UserUseCaseInterface } from '../../../../application/usecases/UserUseCase';
import { useAppDispatch } from '../../../redux/hooks';
import { completeFetching, startFetching } from '../../../redux/features/app/appSlice';
import { MGUser } from '../../../../domain/entities/UserEntity';
import { HeaderSearchBar } from './components/Header';
import { Detail } from './components/Detail';

interface props {
    userUseCase: UserUseCaseInterface;
}

const MG01001Page = ({ userUseCase }: props) => {
    const [form] = useForm();
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useAppDispatch();
    const [userData, setUserData] = useState<MGUser[]>([]);

    useEffect(() => {
        (async () => {
            await getListUser();
        })();
    }, []);

    const getListUser = async () => {
        try {
            dispatch(startFetching());
            const results = await userUseCase.getUserList();
            setUserData(results);
        } catch (error: any) {
            console.log(error);
        } finally {
            dispatch(completeFetching());
        }
    };

    let myVar: any;
    const onSearch = () => {
        if (myVar) clearTimeout(myVar);
        myVar = setTimeout(function () {
            const searchText = form.getFieldValue('text');
            searchParams.set(PARAMS.KEYWORD, searchText.trim());
            form.setFieldValue('text', searchText.trim());
            searchParams.set(PARAMS.PAGE, DEFAULT_PARAMS.PAGE + '');
            setSearchParams(searchParams);
            // if (chosenRecord.length > 0) {
            //     setChosenRecord(InitialState.chosenRecord);
            // }
        }, 1000);
    };

    const changePage = (value: number) => {
        searchParams.set(PARAMS.PAGE, value + '');
        setSearchParams(searchParams);
    };

    const changeSize = (value: number) => {
        searchParams.set(PARAMS.SIZE, value + '');
        searchParams.set(PARAMS.PAGE, DEFAULT_PARAMS.PAGE + '');
        setSearchParams(searchParams);
    };

    const openForm = () => {
        console.log('add');
    };

    const onPaginationChange = (value: number) => {
        console.log(value);
    };
    const submitForm = async (value: any) => {
        console.log(value);
    };
    return (
        <div style={{ display: 'flex', flexFlow: 'column', height: '100%' }}>
            <HeaderSearchBar onSearch={onSearch} form={form} />
            <div
                className="MG-010-01"
                style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#fff',
                    overflow: 'auto',
                    flexGrow: 1,
                }}
            >
                <div
                    style={{
                        width: '100%',
                        paddingRight: 20,
                        paddingLeft: 20,
                        marginTop: 20,
                        display: 'flex',
                        justifyContent: 'space-between',
                        height: '100%',
                    }}
                >
                    <section
                        style={{
                            width: '15%',
                            float: 'left',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <div className="thumbnail"></div>
                    </section>
                    <section style={{ width: '85%', marginBottom: 62 }}>
                        <div style={{ padding: 0 }}>
                            <Detail />
                        </div>
                        <div className="footer" />
                    </section>
                </div>
            </div>
        </div>
    );
};

export default MG01001Page;
