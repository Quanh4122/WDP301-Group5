import { DateRangeCalendar } from "@mui/x-date-pickers-pro/DateRangeCalendar";
import dayjs, { Dayjs } from 'dayjs';
import React, { useState } from "react";
import { DateRange } from '@mui/x-date-pickers-pro/models';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Button } from "antd";

interface props {
    setValue: (value: any) => void,
    onSubmit?: (value: any) => void
}

const CarCalendar = ({ setValue, onSubmit }: props) => {
    const [dateDislayModal, setDateDisplayModal] = useState<any[]>([dayjs().format('DD/MM/YYYY'), dayjs().add(1, 'day').format('DD/MM/YYYY')])
    const fomatData = (value: DateRange<Dayjs>[]) => {
        if (value && value[0]) {
            const dt = dayjs(value[0].toLocaleString()).format('DD/MM/YYYY')

            console.log(dt)
        }

        if (value && value[1]) {
            const dt = dayjs(value[1].toLocaleString()).format('DD/MM/YYYY')
            console.log(dt)
        }
        const arrDt = [
            value && value[0] ? dayjs(value[0].toLocaleString()).format('DD/MM/YYYY') : dayjs().format('DD/MM/YYYY'),
            value && value[1] ? dayjs(value[1].toLocaleString()).format('DD/MM/YYYY') : dayjs().add(1, 'day').format('DD/MM/YYYY')
        ]
        setDateDisplayModal(arrDt)
        setValue(value)
    }
    return (
        <div>
            <div className="w-full flex justify-center border-2 rounded-md">
                <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                >
                    <DateRangeCalendar
                        onChange={(newValue) => fomatData(newValue)}

                    />
                </LocalizationProvider>

            </div>
            <div className="flex items-center justify-between  mt-3">
                <div className="flex">
                    <div className="text-xs text-gray-500">Từ<span className="text-lg font-bold ml-3 text-gray-900 border-b-2">{dateDislayModal[0]}</span></div>
                    <div className="text-xs text-gray-500 ml-5">Đến<span className="text-lg font-bold ml-3 text-gray-900 border-b-2">{dateDislayModal[1]}</span></div>
                    <div className="text-xs text-gray-500 ml-5">Giờ nhận<span className="text-lg font-bold ml-3 text-gray-900 border-b-2">26/02</span></div>
                    <div className="text-xs text-gray-500 ml-5">Giờ trả<span className="text-lg font-bold ml-3 text-gray-900 border-b-2">26/02</span></div>
                </div>
                <div className="flex items-center">
                    <Button
                        type="primary"
                        className="font-bold h-12 w-28"
                        onClick={onSubmit}
                    >Áp dụng</Button>
                </div>
            </div>
        </div>

    )
}

export default CarCalendar