import { DateRangeCalendar } from "@mui/x-date-pickers-pro/DateRangeCalendar";
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from "react";
import { DateRange } from '@mui/x-date-pickers-pro/models';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Button, Select } from "antd";

interface props {
    setDateValue: (value: any) => void,
    setTimeValue: (value: any) => void,
    onSubmit?: (value: any) => void
}

const CarCalendar = ({ setDateValue, setTimeValue, onSubmit }: props) => {
    const [dateDislayModal, setDateDisplayModal] = useState<any[]>([dayjs().format('DD/MM/YYYY'), dayjs().add(1, 'day').format('DD/MM/YYYY')])
    const [timeStart, setTimeStart] = useState([dayjs().hour() + ":" + dayjs().minute(), dayjs().hour() + ":" + dayjs().minute()]);
    const [timeEnd, setTimeEnd] = useState();
    const optionSelectTime = [
        { label: "00:00", value: "00:00" },
        { label: "01:00", value: "01:00" },
        { label: "02:00", value: "02:00" },
        { label: "03:00", value: "03:00" },
        { label: "04:00", value: "04:00" },
        { label: "05:00", value: "05:00" },
        { label: "06:00", value: "06:00" },
        { label: "07:00", value: "07:00" },
        { label: "08:00", value: "08:00" },
        { label: "09:00", value: "09:00" },
        { label: "10:00", value: "10:00" },
        { label: "11:00", value: "11:00" },
        { label: "12:00", value: "12:00" },
        { label: "13:00", value: "13:00" },
        { label: "14:00", value: "14:00" },
        { label: "15:00", value: "15:00" },
        { label: "16:00", value: "16:00" },
        { label: "17:00", value: "17:00" },
        { label: "18:00", value: "18:00" },
        { label: "19:00", value: "19:00" },
        { label: "20:00", value: "20:00" },
        { label: "21:00", value: "21:00" },
        { label: "22:00", value: "22:00" },
        { label: "23:00", value: "23:00" },
    ]

    useEffect(() => {
        setTimeValue([timeStart, timeEnd])
    }, [timeStart, timeEnd])


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
        setDateValue(value)
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
                    <div className="text-xs text-gray-500">
                        Từ
                        <span className="text-lg font-bold ml-3 text-gray-900 border-b-2">
                            {dateDislayModal[0]}
                        </span>
                    </div>
                    <div className="text-xs text-gray-500 ml-5">
                        Đến
                        <span className="text-lg font-bold ml-3 text-gray-900 border-b-2">
                            {dateDislayModal[1]}
                        </span>
                    </div>
                    <div className="text-xs text-gray-500 ml-5">
                        Giờ nhận
                        <span className="text-lg font-bold ml-3 text-gray-900 border-b-2">
                            <Select
                                options={optionSelectTime}
                                className="w-20"
                                onChange={(value) => setTimeStart(value)}
                            />
                        </span>
                    </div>
                    <div className="text-xs text-gray-500 ml-5">
                        Giờ trả
                        <span className="text-lg font-bold ml-3 text-gray-900 border-b-2">
                            <Select
                                options={optionSelectTime}
                                className="w-20"
                                onChange={(value) => setTimeEnd(value)}
                            />
                        </span>
                    </div>
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