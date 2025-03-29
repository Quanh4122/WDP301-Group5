import { CheckCircleFilled } from '@ant-design/icons';
import * as React from 'react';

export default function Review() {
  return (
    <div className="w-full min-h-[18rem] flex flex-col items-center justify-center bg-gray-50 p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <CheckCircleFilled className="text-green-500 text-6xl md:text-8xl" />
      </div>
      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
          Bạn đã thực hiện giữ chỗ thành công!
        </h2>
        <p className="mt-2 text-sm md:text-base text-gray-600">
          Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Chúng tôi sẽ sớm liên hệ với bạn.
        </p>
      </div>
    </div>
  );
}