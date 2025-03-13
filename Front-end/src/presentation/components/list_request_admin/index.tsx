import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import { RequestModelFull } from '../checkout/models'
import axiosInstance from '../utils/axios'
import ListRequestPending from './components/ListRequestPending'

const AdminRequest = () => {

    const [requestDataPending, setRequestDataPending] = useState<RequestModelFull[] | []>()
    const [requestDataAccepted, setRequestDataAccepted] = useState<RequestModelFull[] | []>()
    const [requestDataDenined, setRequestDataDenined] = useState<RequestModelFull[] | []>()

    useEffect(() => {
        getListRequest()
    }, [])

    const getListRequest = async () => {
        await axiosInstance.get('request/getListAdminRequest')
            .then(res => setRequestDataPending(res.data))
            .catch(err => console.log(err))
    }

    const setListRequest = (listRequest: RequestModelFull[]) => {
        setRequestDataPending(listRequest.filter(item => item.requestStatus == '2'))
        setRequestDataAccepted(listRequest.filter(item => item.requestStatus == '3'))
        setRequestDataDenined(listRequest.filter(item => item.requestStatus == '4'))
    }

    return (
        <div className='w-full h-screen p-5'>
            <div>
                <Button>Change Screen</Button>
            </div>
            <div>
                {
                    <ListRequestPending requestList={requestDataPending || []} />
                }
            </div>
        </div>
    )
}

export default AdminRequest