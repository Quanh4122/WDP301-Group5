import { DateRangeCalendar } from "@mui/x-date-pickers-pro/DateRangeCalendar";
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from "react";
import { DateRange } from '@mui/x-date-pickers-pro/models';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Button, Select } from "antd";

interface Props {
    setDateValue: (value: DateRange<Dayjs>) => void;
    setTimeValue: (value: [string, string]) => void;
    onSubmit?: () => void;
}

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
    const [timeStart, setTimeStart] = useState<string>(dayjs().add(2, 'hour').format('HH:00'));
    const [timeEnd, setTimeEnd] = useState<string>(dayjs().format('HH:00'));
    const [optionSelectTimeStart, setOptionSelectTimeStart] = useState<TimeOption[]>([]);
    const [optionSelectTimeEnd, setOptionSelectTimeEnd] = useState<TimeOption[]>([]);

    const currentHour: number = dayjs().hour();

    const defaultTimeStartOptions: TimeOption[] = [
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

    const defaultTimeEndOptions: TimeOption[] = [
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

    const updateTimeStartOptions = (startDate: Dayjs | null) => {
        const isToday = startDate ? dayjs().isSame(startDate, 'day') : true;
        const disableUntilHour = currentHour + 1;

        if (isToday) {
            const updatedOptions = defaultTimeStartOptions.map(option => {
                const hour = parseInt(option.value.split(':')[0], 10);
                return {
                    ...option,
                    disabled: hour <= disableUntilHour
                };
            });
            setOptionSelectTimeStart(updatedOptions);

            const currentStartHour = parseInt(timeStart.split(':')[0], 10);
            if (currentStartHour <= disableUntilHour) {
                const nextAvailableHour = disableUntilHour + 1 > 23 ? 23 : disableUntilHour + 1;
                setTimeStart(`${nextAvailableHour}:00`);
            }
        } else {
            setOptionSelectTimeStart(defaultTimeStartOptions);
        }
    };

    const updateTimeEndOptions = (endDate: Dayjs | null) => {
        const isToday = endDate ? dayjs().isSame(endDate, 'day') : false;
        const disableUntilHour = currentHour + 3;

        if (isToday) {
            const updatedOptions = defaultTimeEndOptions.map(option => {
                const hour = parseInt(option.value.split(':')[0], 10);
                return {
                    ...option,
                    disabled: hour <= disableUntilHour
                };
            });
            setOptionSelectTimeEnd(updatedOptions);

            const currentEndHour = parseInt(timeEnd.split(':')[0], 10);
            if (currentEndHour <= disableUntilHour) {
                const nextAvailableHour = disableUntilHour + 1 > 23 ? 23 : disableUntilHour + 1;
                setTimeEnd(`${nextAvailableHour}:00`);
            }
        } else {
            setOptionSelectTimeEnd(defaultTimeEndOptions);
        }
    };

    const formatData = (value: DateRange<Dayjs>) => {
        const arrDt: string[] = [
            value[0] ? dayjs(value[0].toLocaleString()).format('DD/MM/YYYY') : dayjs().format('DD/MM/YYYY'),
            value[1] ? dayjs(value[1].toLocaleString()).format('DD/MM/YYYY') : dayjs().add(1, 'day').format('DD/MM/YYYY')
        ];
        setDateDisplayModal(arrDt);
        setDateValue(value);

        // Cập nhật options và timeStart/timeEnd
        updateTimeStartOptions(value[0]);
        updateTimeEndOptions(value[1]);

        // Nếu ngày bắt đầu là hôm nay, đặt timeStart = hiện tại + 2 giờ
        const isStartToday = value[0] ? dayjs().isSame(value[0], 'day') : true;
        if (isStartToday) {
            const newStartHour = Math.min(currentHour + 2, 23);
            setTimeStart(`${newStartHour}:00`);
        }
    };

    useEffect(() => {
        updateTimeStartOptions(dayjs()); // Khởi tạo với ngày hiện tại
        updateTimeEndOptions(dayjs().add(1, 'day')); // Khởi tạo với ngày mai
    }, []);

    return (
        <div>
            <div className="w-full flex justify-center border-2 rounded-md">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateRangeCalendar
                        onChange={(newValue: DateRange<Dayjs>) => formatData(newValue)}
                        minDate={dayjs()}
                        defaultValue={[dayjs(), dayjs().add(1, 'day')]}
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