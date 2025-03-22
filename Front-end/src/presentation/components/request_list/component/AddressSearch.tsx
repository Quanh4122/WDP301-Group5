import React, { useEffect } from 'react';
import { debounce } from 'lodash';
import { Input, List } from 'antd';
import axiosInstance from '../../utils/axios';

interface Address {
    display_name: string;
    lat: string;
    lon: string;
}

interface AddressSearchProps {
    addressBooking?: (value: string) => void; // Optional callback ra ngoài
    title?: string;
    isRequire?: boolean;
    value?: string; // Giá trị từ Form.Item
    onChange?: (value: string) => void; // Hàm để cập nhật giá trị cho Form.Item
}

const AddressSearch: React.FC<AddressSearchProps> = ({
    addressBooking,
    title,
    isRequire,
    value = '', // Giá trị mặc định nếu không có
    onChange,
}) => {
    const [suggestions, setSuggestions] = React.useState<Address[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    // Gọi API backend để tìm kiếm địa chỉ với debounce
    const debouncedSearch = debounce(async (searchQuery: string) => {
        if (searchQuery.length < 3) {
            setSuggestions([]);
            return;
        }

        try {
            setIsLoading(true);
            const response = await axiosInstance.get('/request/search-address', {
                params: { q: searchQuery },
            });
            setSuggestions(response.data);
        } catch (error) {
            console.error('Lỗi khi tìm kiếm:', error);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    }, 500);

    const handleSearch = (searchQuery: string) => {
        if (onChange) {
            onChange(searchQuery); // Cập nhật giá trị cho Form.Item
        }
        debouncedSearch(searchQuery);
    };

    const handleSelect = (address: Address) => {
        const addressString = address.display_name;
        if (onChange) {
            onChange(addressString); // Cập nhật giá trị cho Form.Item
        }
        setSuggestions([]);
        if (addressBooking) {
            addressBooking(addressString); // Gọi callback ra ngoài nếu có
        }
        console.log('AddressSearch - Selected address:', addressString);
    };

    return (
        <div className="max-w-md mx-auto bg-white">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {title} {isRequire && <span className="text-red-500">*</span>}
            </label>
            <Input
                value={value} // Sử dụng value từ Form.Item
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