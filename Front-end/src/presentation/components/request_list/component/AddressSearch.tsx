import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { Input, List } from 'antd';
import axiosInstance from '../../utils/axios';

interface Address {
    display_name: string;
    lat: string;
    lon: string;
}

interface props {
    addressBooking: (value: string) => void,
    title: string,
    isRequire: boolean
}

const AddressSearch = ({ addressBooking, title, isRequire }: props) => {
    const [query, setQuery] = useState<string>(''); // Từ khóa tìm kiếm, đồng thời là giá trị hiển thị trong Input
    const [suggestions, setSuggestions] = useState<Address[]>([]); // Danh sách gợi ý hiển thị
    const [tempSuggestions, setTempSuggestions] = useState<Address[]>([]); // Trạng thái tạm thời để lưu dữ liệu từ API
    const [isLoading, setIsLoading] = useState<boolean>(false); // Trạng thái loading để biết API đang gọi

    // Gọi API backend để tìm kiếm địa chỉ với debounce
    const debouncedSearch = debounce(async (searchQuery: string) => {
        if (searchQuery.length < 3) {
            setTempSuggestions([]);
            setSuggestions([]);
            return;
        }

        try {
            setIsLoading(true); // Bắt đầu gọi API, hiển thị trạng thái loading
            const response = await axiosInstance.get('/request/search-address', {
                params: { q: searchQuery },
            });
            setTempSuggestions(response.data); // Lưu dữ liệu vào trạng thái tạm thời
        } catch (error) {
            console.error('Lỗi khi tìm kiếm:', error);
            setTempSuggestions([]);
        } finally {
            setIsLoading(false); // API trả về, tắt trạng thái loading
        }
    }, 500);

    // Khi tempSuggestions thay đổi, cập nhật suggestions
    useEffect(() => {
        if (!isLoading) {
            setSuggestions(tempSuggestions); // Chỉ cập nhật suggestions khi API trả về đầy đủ
        }
    }, [tempSuggestions, isLoading]);

    const handleSearch = (searchQuery: string) => {
        setQuery(searchQuery);
        debouncedSearch(searchQuery);
    };

    // Khi người dùng chọn địa chỉ
    const handleSelect = (address: Address) => {
        const addressString = address.display_name; // Lấy chuỗi địa chỉ
        setQuery(addressString); // Cập nhật giá trị trong Input
        setSuggestions([]); // Ẩn danh sách gợi ý sau khi chọn
        // console.log(addressString);
        addressBooking(addressString)
    };

    return (
        <div className="max-w-md mx-auto bg-white">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {title} {isRequire && <span className="text-red-500">*</span>}
            </label>
            <Input
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Nhập địa chỉ (ví dụ: Ninh Bình)"
                className="w-full mb-2 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                size="large"
            />
            {isLoading ? (
                <p className="text-gray-500 text-xs mt-1">Đang tải...</p> // Hiển thị trạng thái loading
            ) : suggestions.length > 0 ? (
                <List
                    dataSource={suggestions}
                    renderItem={(suggestion) => (
                        <List.Item
                            onClick={() => handleSelect(suggestion)}
                            className="cursor-pointer hover:bg-gray-100 transition-colors p-2 text-gray-700 text-sm"
                        >
                            {suggestion.display_name}
                        </List.Item>
                    )}
                    className="border rounded-md shadow-sm max-h-40 overflow-y-auto bg-white"
                />
            ) : null}
        </div>
    );
}

export default AddressSearch;