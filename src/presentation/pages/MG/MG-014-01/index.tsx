import { Form, Input, Pagination } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_PARAMS, PARAMS } from '../../../../utilities/constants/PARAMETER';
import { UserUseCaseInterface } from '../../../../application/usecases/UserUseCase';
import { useAppDispatch } from '../../../redux/hooks';
import { completeFetching, startFetching } from '../../../redux/features/app/appSlice';
import { MGUser } from '../../../../domain/entities/UserEntity';
import { FormDrawer } from './components/FormDrawer';
import { PaginationCustomComponent } from '../../../components/pagination';
import { HeaderSearchBar } from './components/Header';
import { TableData } from './components/TableData';
import { TabComponent } from './components/Tab';
import { ElementOptions, SelectGroup } from './components/SelectGroup';

const TAB_ITEMS = [
    {
        value: '1',
        name: 'すべて',
    },
    {
        value: '2',
        name: '法人',
    },
    {
        value: '3',
        name: '個人',
    },
];

const USER_ID_LIST: ElementOptions[] = [
    {
        id: 'USER_ID_LIST1',
        value: 'USER_ID_LIST1',
        name: '全て',
    },
];

const CORPORATE_LIST: ElementOptions[] = [
    {
        id: 'CORPORATE_LIST1',
        value: 'CORPORATE_LIST1',
        name: '選択してください',
    },
    {
        id: 'CORPORATE_LIST2',
        value: 'CORPORATE_LIST2',
        name: '選択してください2',
    },
];

const NICKNAME_LIST: ElementOptions[] = [
    {
        id: 'NICKNAME_LIST1',
        value: 'FAMILY_NAME_LIST1',
        name: '選択してください',
    },
    {
        id: 'NICKNAME_LIST2',
        value: 'FAMILY_NAME_LIST2',
        name: '選択してください2',
    },
];

const FAMILY_NAME_LIST: ElementOptions[] = [
    {
        id: 'FAMILY_NAME_LIST1',
        value: 'FAMILY_NAME_LIST1',
        name: '選択してください',
    },
    {
        id: 'FAMILY_NAME_LIST2',
        value: 'FAMILY_NAME_LIST21',
        name: '選択してください2',
    },
];

const STATUS_LIST: ElementOptions[] = [
    {
        id: 'STATUS_LIST1',
        value: 'FAMILY_NAME_LIST1',
        name: '選択してください',
    },
    {
        id: 'STATUS_LIST2',
        value: 'FAMILY_NAME_LIST2',
        name: '選択してください2',
    },
];

interface props {
    userUseCase: UserUseCaseInterface;
}

const MG01401Page = ({ userUseCase }: props) => {
    const [form] = useForm();
    const [searchParams, setSearchParams] = useSearchParams();
    const tab = searchParams.get('tab') || TAB_ITEMS[0].value;
    const userId = searchParams.get('userId') || undefined;
    const corporate = searchParams.get('corporate') || undefined;
    const nickname = searchParams.get('nickname') || undefined;
    const familyName = searchParams.get('familyName') || undefined;
    const status = searchParams.get('status') || undefined;

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
        <>
            <div
                style={{
                    display: 'flex',
                    flexFlow: 'column',
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#fff',
                }}
            >
                <div>
                    <HeaderSearchBar onSearch={onSearch} form={form} />
                    <TabComponent
                        tabs={TAB_ITEMS}
                        chosenTab={tab}
                        onChange={(value: any) => {
                            searchParams.set('tab', value);
                            setSearchParams(searchParams);
                        }}
                    />
                    <SelectGroup
                        userIdList={USER_ID_LIST}
                        corporateList={CORPORATE_LIST}
                        nicknameList={NICKNAME_LIST}
                        familyNameList={FAMILY_NAME_LIST}
                        statusList={STATUS_LIST}
                        chosenItem={{
                            userId: userId,
                            corporate: corporate,
                            nickname: nickname,
                            familyName: familyName,
                            status: status,
                        }}
                    />
                </div>
                <div
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
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                        }}
                    >
                        <PaginationCustomComponent
                            page={1}
                            total={10}
                            onSizeChange={changeSize}
                            onPageChange={changePage}
                        />
                    </div>
                    <TableData data={userData} />
                </div>
            </div>
        </>
    );
};

export default MG01401Page;
