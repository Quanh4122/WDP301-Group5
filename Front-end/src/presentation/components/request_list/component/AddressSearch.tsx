import React from 'react';
import { debounce } from 'lodash';
import { Input, List } from 'antd';
import axiosInstance from '../../utils/axios'; // Giả sử đây là file cấu hình axios

// Định nghĩa interface cho Address
interface Address {
    display_name: string;
    lat: string;
    lon: string;
}

// Định nghĩa props cho component với TypeScript
interface AddressSearchProps {
    addressBooking?: (value: any) => void; // Callback optional, có thể nhận undefined
    title?: string;
    isRequire?: boolean;
    value?: string; // Giá trị từ Form.Item
    onChange?: (value: string) => void; // Hàm cập nhật giá trị cho Form.Item
}

const AddressSearch: React.FC<AddressSearchProps> = ({
    addressBooking,
    title,
    isRequire,
    value = '', // Giá trị mặc định là chuỗi rỗng
    onChange,
}) => {
    const [suggestions, setSuggestions] = React.useState<Address[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    // Hàm tìm kiếm với debounce, sử dụng TypeScript cho kiểu dữ liệu
    const debouncedSearch = debounce(async (searchQuery: string) => {
        if (searchQuery.length < 3) {
            setSuggestions([]);
            return;
        }

        try {
            setIsLoading(true);
            const response = await axiosInstance.get<Address[]>('/request/search-address', {
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

    // Xử lý khi người dùng nhập/xóa dữ liệu trong input
    const handleSearch = (searchQuery: string) => {
        if (onChange) {
            onChange(searchQuery); // Cập nhật giá trị cho Form.Item
        }
        if (addressBooking) {
            // Nếu input rỗng, trả về undefined, ngược lại trả về giá trị hiện tại
            addressBooking(searchQuery.length === 0 ? undefined : searchQuery);
        }
        debouncedSearch(searchQuery);
    };

    // Xử lý khi người dùng chọn một gợi ý từ danh sách
    const handleSelect = (address: Address) => {
        const addressString = address.display_name;
        if (onChange) {
            onChange(addressString); // Cập nhật giá trị cho Form.Item
        }
        setSuggestions([]); // Ẩn danh sách gợi ý
        if (addressBooking) {
            addressBooking(addressString); // Gọi callback với giá trị được chọn
        }
    };

    return (
        <div className="max-w-md bg-white">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {title} {isRequire && <span className="text-red-500">*</span>}
            </label>
            <Input
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
                placeholder="Nhập địa chỉ (ví dụ: Ninh Bình)"
                className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                size="large"
            />
            {isLoading ? (
                <p className="text-gray-500 text-xs mt-1">Đang tải...</p>
            ) : suggestions.length > 0 ? (
                <List
                    dataSource={suggestions}
                    renderItem={(suggestion: Address) => (
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