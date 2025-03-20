import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import { Input, List } from 'antd';
import axiosInstance from '../../utils/axios';

interface Address {
    display_name: string;
    lat: string;
    lon: string;
}

interface AddressSearchProps {
    addressBooking: (value: string) => void;
    title: string;
    isRequire: boolean;
    value?: string; // Giá trị từ component cha
}

const AddressSearch: React.FC<AddressSearchProps> = ({ addressBooking, title, isRequire, value }) => {
    const [query, setQuery] = useState<string>(value || '');
    const [suggestions, setSuggestions] = useState<Address[]>([]);
    const [tempSuggestions, setTempSuggestions] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Đồng bộ query với value từ props khi value thay đổi
    useEffect(() => {
        console.log('AddressSearch - Received value from props:', value);
        if (value !== undefined && value !== query) {
            setQuery(value); // Cập nhật query khi value thay đổi
        }
    }, [value]);

    // Gọi API backend để tìm kiếm địa chỉ với debounce
    const debouncedSearch = debounce(async (searchQuery: string) => {
        if (searchQuery.length < 3) {
            setTempSuggestions([]);
            setSuggestions([]);
            return;
        }

        try {
            setIsLoading(true);
            const response = await axiosInstance.get('/request/search-address', {
                params: { q: searchQuery },
            });
            setTempSuggestions(response.data);
        } catch (error) {
            console.error('Lỗi khi tìm kiếm:', error);
            setTempSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    }, 500);

    // Khi tempSuggestions thay đổi, cập nhật suggestions
    useEffect(() => {
        if (!isLoading) {
            setSuggestions(tempSuggestions);
        }
    }, [tempSuggestions, isLoading]);

    const handleSearch = (searchQuery: string) => {
        setQuery(searchQuery);
        debouncedSearch(searchQuery);
    };

    const handleSelect = (address: Address) => {
        const addressString = address.display_name;
        setQuery(addressString);
        setSuggestions([]);
        addressBooking(addressString); // Cập nhật giá trị ra ngoài
        console.log('AddressSearch - Selected address:', addressString);
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
                <p className="text-gray-500 text-xs mt-1">Đang tải...</p>
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
};

export default AddressSearch;