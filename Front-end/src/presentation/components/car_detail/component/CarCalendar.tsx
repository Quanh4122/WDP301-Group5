import { DateRangeCalendar } from "@mui/x-date-pickers-pro/DateRangeCalendar";
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from "react";
import { DateRange } from '@mui/x-date-pickers-pro/models';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Button, Select } from "antd";

// Định nghĩa interface cho props
interface Props {
    setDateValue: (value: DateRange<Dayjs>) => void;
    setTimeValue: (value: [string, string]) => void;
    onSubmit?: () => void;
}

// Định nghĩa interface cho option của Select
interface TimeOption {
    label: string;
    value: string;
    disabled?: boolean;
}

const CarCalendar: React.FC<Props> = ({ setDateValue, setTimeValue, onSubmit }) => {
    const [dateDisplayModal, setDateDisplayModal] = useState<string[]>([
        dayjs().format('DD/MM/YYYY'),
        dayjs().add(1, 'day').format('DD/MM/YYYY')
    ]);
    const [timeStart, setTimeStart] = useState<string>(dayjs().format('HH:00'));
    const [timeEnd, setTimeEnd] = useState<string>(dayjs().format('HH:00'));

    // Lấy giờ hiện tại
    const currentHour: number = dayjs().hour();

    // Danh sách giờ cho Giờ nhận (có disable trước giờ hiện tại)
    const optionSelectTimeStart: TimeOption[] = [
        { label: "00:00", value: "00:00", disabled: currentHour > 0 },
        { label: "01:00", value: "01:00", disabled: currentHour > 1 },
        { label: "02:00", value: "02:00", disabled: currentHour > 2 },
        { label: "03:00", value: "03:00", disabled: currentHour > 3 },
        { label: "04:00", value: "04:00", disabled: currentHour > 4 },
        { label: "05:00", value: "05:00", disabled: currentHour > 5 },
        { label: "06:00", value: "06:00", disabled: currentHour > 6 },
        { label: "07:00", value: "07:00", disabled: currentHour > 7 },
        { label: "08:00", value: "08:00", disabled: currentHour > 8 },
        { label: "09:00", value: "09:00", disabled: currentHour > 9 },
        { label: "10:00", value: "10:00", disabled: currentHour > 10 },
        { label: "11:00", value: "11:00", disabled: currentHour > 11 },
        { label: "12:00", value: "12:00", disabled: currentHour > 12 },
        { label: "13:00", value: "13:00", disabled: currentHour > 13 },
        { label: "14:00", value: "14:00", disabled: currentHour > 14 },
        { label: "15:00", value: "15:00", disabled: currentHour > 15 },
        { label: "16:00", value: "16:00", disabled: currentHour > 16 },
        { label: "17:00", value: "17:00", disabled: currentHour > 17 },
        { label: "18:00", value: "18:00", disabled: currentHour > 18 },
        { label: "19:00", value: "19:00", disabled: currentHour > 19 },
        { label: "20:00", value: "20:00", disabled: currentHour > 20 },
        { label: "21:00", value: "21:00", disabled: currentHour > 21 },
        { label: "22:00", value: "22:00", disabled: currentHour > 22 },
        { label: "23:00", value: "23:00", disabled: currentHour > 23 },
    ];

    // Danh sách giờ cho Giờ trả (không disable)
    const optionSelectTimeEnd: TimeOption[] = [
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
    ];

    useEffect(() => {
        setTimeValue([timeStart, timeEnd]);
    }, [timeStart, timeEnd, setTimeValue]);

    const formatData = (value: DateRange<Dayjs>) => {
        const arrDt: string[] = [
            value[0] ? dayjs(value[0].toLocaleString()).format('DD/MM/YYYY') : dayjs().format('DD/MM/YYYY'),
            value[1] ? dayjs(value[1].toLocaleString()).format('DD/MM/YYYY') : dayjs().add(1, 'day').format('DD/MM/YYYY')
        ];
        setDateDisplayModal(arrDt);
        setDateValue(value);
    };

    return (
        <div>
            <div className="w-full flex justify-center border-2 rounded-md">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateRangeCalendar
                        onChange={(newValue: DateRange<Dayjs>) => formatData(newValue)}
                        minDate={dayjs()}
                    />
                </LocalizationProvider>
            </div>
            <div className="flex items-center justify-between mt-3">
                <div className="flex">
                    <div className="text-xs text-gray-500">
                        Từ
                        <span className="text-lg font-bold ml-3 text-gray-900 border-b-2">
                            {dateDisplayModal[0]}
                        </span>
                    </div>
                    <div className="text-xs text-gray-500 ml-5">
                        Đến
                        <span className="text-lg font-bold ml-3 text-gray-900 border-b-2">
                            {dateDisplayModal[1]}
                        </span>
                    </div>
                    <div className="text-xs text-gray-500 ml-5">
                        Giờ nhận
                        <span className="text-lg font-bold ml-3 text-gray-900 border-b-2">
                            <Select
                                options={optionSelectTimeStart}
                                className="w-20"
                                onChange={(value: string) => setTimeStart(value)}
                                value={timeStart}
                            />
                        </span>
                    </div>
                    <div className="text-xs text-gray-500 ml-5">
                        Giờ trả
                        <span className="text-lg font-bold ml-3 text-gray-900 border-b-2">
                            <Select
                                options={optionSelectTimeEnd}
                                className="w-20"
                                onChange={(value: string) => setTimeEnd(value)}
                                value={timeEnd}
                            />
                        </span>
                    </div>
                </div>
                <div className="flex items-center">
                    <Button
                        type="primary"
                        className="font-bold h-12 w-28"
                        onClick={onSubmit}
                    >
                        Áp dụng
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CarCalendar;