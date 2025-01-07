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
import { PropertyName } from './components/form-items/PropertyName';
import { GoogleMapLocationURL } from './components/form-items/GoogleMapLocationURL';
import { Location } from './components/form-items/Location';
import { Area } from './components/form-items/Area';
import { NearestStationRoute2 } from './components/form-items/NearestStationRoute2';
import { NearestStationRoute1 } from './components/form-items/NearestStationRoute1';
import { NearestStation1 } from './components/form-items/NearestStation1';
import { WalkingTime1 } from './components/form-items/WalkingTime1';
import { NearestStation2 } from './components/form-items/NearestStation2';
import { WalkingTime2 } from './components/form-items/WalkingTime2';
import { BuildingDate } from './components/form-items/BuildingDate';
import { Structure } from './components/form-items/Structure';
import { TotalUnit } from './components/form-items/TotalUnit';
import { ManagementCompany } from './components/form-items/ManagementCompany';
import { SalesCompany } from './components/form-items/SalesCompany';
import { ConstructionCompany } from './components/form-items/ConstructionCompany';
import { ExteriorTiles } from './components/form-items/ExteriorTiles';
import { AutoLock } from './components/form-items/AutoLock';
import { Elevator } from './components/form-items/Elevator';
import { Survey } from './components/form-items/Survey';
import { Available } from './components/form-items/Available';
import { ReasonForNonHandling } from './components/form-items/Reason';
import { LandUse } from './components/form-items/LandUse';
import { LandLeaseRemark } from './components/form-items/LandLeaseRemark';
import { RainMap } from './components/form-items/RainMap';
import { StormSurgeMap } from './components/form-items/StormSurgeMap';
import { FloodMap } from './components/form-items/FloodMap';
import { Pamphlet } from './components/form-items/Pamphlet';
import AvatarComponent from './components/form-items/Avatar';

interface props {
    userUseCase: UserUseCaseInterface;
}

const MG01101Page = ({ userUseCase }: props) => {
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
        <>
            <div style={{ width: '100%', height: '100%', backgroundColor: '#fff' }}>
                <HeaderSearchBar onSearch={onSearch} form={form} />
                <div
                    style={{
                        width: '100%',
                        paddingRight: 20,
                        paddingLeft: 20,
                        marginTop: 20,
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <section style={{ width: '15%', float: 'left' }}>
                        <AvatarComponent />
                    </section>
                    <section style={{ width: '85%' }}>
                        <Form
                            className="MG011-form"
                            layout="vertical"
                            style={{ marginBottom: 62, padding: 0 }}
                            form={form}
                        >
                            <Row gutter={[24, 0]}>
                                <Col span={24}>
                                    <PropertyName />
                                </Col>

                                <Col span={24}>
                                    <GoogleMapLocationURL />
                                </Col>

                                <Col span={12}>
                                    <Location />
                                </Col>
                                <Col span={12}>
                                    <Area />
                                </Col>

                                <Col span={12}>
                                    <NearestStationRoute1 />
                                </Col>
                                <Col span={12}>
                                    <NearestStation1 />
                                </Col>

                                <Col span={12}>
                                    <WalkingTime1 />
                                </Col>
                                <Col span={12}>
                                    <NearestStationRoute2 />
                                </Col>

                                <Col span={12}>
                                    <NearestStation2 />
                                </Col>
                                <Col span={12}>
                                    <WalkingTime2 />
                                </Col>

                                <Col span={12}>
                                    <BuildingDate />
                                </Col>
                                <Col span={12}>
                                    <Structure />
                                </Col>

                                <Col span={12}>
                                    <TotalUnit />
                                </Col>
                                <Col span={12}>
                                    <ManagementCompany />
                                </Col>

                                <Col span={12}>
                                    <SalesCompany />
                                </Col>
                                <Col span={12}>
                                    <ConstructionCompany />
                                </Col>

                                <Col span={12}>
                                    <ExteriorTiles />
                                </Col>
                                <Col span={12}>
                                    <AutoLock />
                                </Col>

                                <Col span={12}>
                                    <Elevator />
                                </Col>
                                <Col span={12}>
                                    <Survey />
                                </Col>

                                <Col span={12}>
                                    <Available />
                                </Col>
                                <Col span={12}>
                                    <ReasonForNonHandling />
                                </Col>

                                <Col span={12}>
                                    <LandUse />
                                </Col>
                                <Col span={12}>
                                    <LandLeaseRemark />
                                </Col>

                                <Col span={24}>
                                    <RainMap />
                                </Col>
                                <Col span={24}>
                                    <StormSurgeMap />
                                </Col>
                                <Col span={24}>
                                    <FloodMap />
                                </Col>
                                <Col span={24}>
                                    <Pamphlet />
                                </Col>
                            </Row>
                        </Form>
                    </section>
                </div>
            </div>
        </>
    );
};

export default MG01101Page;
