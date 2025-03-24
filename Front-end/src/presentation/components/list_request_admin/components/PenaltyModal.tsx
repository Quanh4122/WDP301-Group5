import React, { useEffect, useState } from "react";
import { Modal, Button, Form, InputNumber, Spin, Typography, List, Image } from "antd";
import { useForm } from "antd/es/form/Form";
import axiosInstance from "../../utils/axios"; // Đường dẫn đến axios instance của bạn
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { BillModal, RequestModal } from "../Modals";

const { Text } = Typography;

interface PenaltyModalProps {
  visible: boolean;
  requestId: string;
  onClose: () => void;
  onSuccess?: () => void; // Callback khi submit thành công
}

const PenaltyModal: React.FC<PenaltyModalProps> = ({
  visible,
  requestId,
  onClose,
  onSuccess,
}) => {
  const [billData, setBillData] = useState<BillModal | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [penaltyFee, setPenaltyFee] = useState<number | null>(null);
  const [form] = useForm();

  useEffect(() => {
    if (visible && requestId) {
      fetchData(requestId);
    }
  }, [visible, requestId]);

  const fetchData = async (requestId: string) => {
    setLoading(true);
    try {

      // Lấy dữ liệu Request
      const requestResponse = await axiosInstance.get("/bill/getBillByReuqestId", {
        params: { key: requestId },
      });
      console.log("check data : ", requestResponse.data.bill)
      setBillData(requestResponse.data.bill);

      // Tính toán phí phạt mặc định nếu realTimeDrop muộn hơn endDate
      const realTimeDrop = requestResponse.data.bill.realTimeDrop
        ? dayjs(requestResponse.data.bill.realTimeDrop)
        : null;
      const endDate = dayjs(requestResponse.data.bill.request.endDate);
      if (realTimeDrop && realTimeDrop.isAfter(endDate)) {
        const timeLate = realTimeDrop.diff(endDate, "hour");
        console.log(timeLate)
        const defaultPenalty = timeLate * 500000; // Ví dụ: 50,000 VNĐ/ngày
        setPenaltyFee(defaultPenalty);
        form.setFieldsValue({ penaltyFee: defaultPenalty });
      } else {
        setPenaltyFee(0);
        form.setFieldsValue({ penaltyFee: 0 });
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: { penaltyFee: number }) => {
    setLoading(true);
    try {
      if (billData?._id) {
        const dataSubmit = {
          billId: billData?._id,
          penaltyFee: values.penaltyFee
        }
        // Gửi dữ liệu lên server
        const response = await axiosInstance.put("/bill/adminUpdatePenaltyFee", dataSubmit);
        toast.success("Cập nhật phí phạt thành công!");
        form.resetFields();
        onClose(); // Đóng modal
        if (onSuccess) onSuccess(); // Gọi callback nếu có
      } else {
        console.log("Have no bill")
      }

    } catch (error) {
      console.error(error);
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-6">
          <Spin size="large" />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Hiển thị thông tin */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Text strong>VAT Fee:</Text>
            <p>{billData?.vatFee && billData?.vatFee.toLocaleString()} VNĐ</p>
          </div>
          <div>
            <Text strong>Deposit Fee:</Text>
            <p>{billData?.depositFee?.toLocaleString() || "Chưa có"} VNĐ</p>
          </div>
          <div>
            <Text strong>Thời gian trả xe thực tế:</Text>
            <p>
              {billData?.realTimeDrop
                ? dayjs(billData.realTimeDrop).format("DD/MM/YYYY HH:mm")
                : "Chưa có"}
            </p>
          </div>
          <div>
            <Text strong>Địa điểm trả xe thực tế:</Text>
            <p>{billData?.realLocationDrop || "Chưa có"}</p>
          </div>
          <div>
            <Text strong>Địa điểm trả xe dự kiến:</Text>
            <p>{billData?.request.dropLocation || "Chưa có"}</p>
          </div>
          <div>
            <Text strong>Ngày kết thúc dự kiến:</Text>
            <p>
              {billData?.request?.endDate
                ? dayjs(billData?.request?.endDate).format("DD/MM/YYYY HH:mm")
                : "Chưa có"}
            </p>
          </div>
        </div>

        {/* Hiển thị ảnh */}
        {billData?.realImage && (
          <div>
            <Text strong>Ảnh xác nhận:</Text>
            <Image
              src={`http://localhost:3030${billData?.realImage}`}
              alt={`Real Image`}
              className="w-10 h-10 object-cover rounded-md shadow-sm"
              width={40}
              height={40}
            />
          </div>
        )}

        {/* Form nhập phí phạt */}
        {
          billData?.request.requestStatus == "4" &&
          <Form form={form} onFinish={onSubmit} layout="vertical">
            <Form.Item
              name="penaltyFee"
              label={<span className="font-medium text-gray-700">Phí phạt (VNĐ)</span>}
              rules={[
                { required: true, message: "Vui lòng nhập số tiền phạt" },
                { type: "number", min: 0, message: "Phí phạt không thể âm" },
              ]}
            >
              <InputNumber
                value={penaltyFee}
                onChange={(value) => setPenaltyFee(value)}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as any}
                className="w-full"
                placeholder="Nhập số tiền phạt"
                readOnly
              />
            </Form.Item>
          </Form>
        }

      </div>
    );
  };

  return (
    <Modal
      title={<span className="text-xl font-bold">Thông Tin Hóa Đơn và Phí Phạt</span>}
      open={visible}
      onCancel={onClose}
      footer={billData?.request.requestStatus == "4" && [
        <Button key="cancel" onClick={onClose} disabled={loading}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Xác nhận
        </Button>,
      ]}
      width={800}
      centered
    >
      {renderContent()}
    </Modal>
  );
};

export default PenaltyModal;