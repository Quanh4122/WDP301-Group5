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
  const [form] = useForm();
  const mortgateFee = 3000000

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
      setBillData(requestResponse.data.bill);

      // Tính toán phí phạt mặc định nếu realTimeDrop muộn hơn endDate
      const realTimeDrop = requestResponse.data.bill.realTimeDrop
        ? dayjs(requestResponse.data.bill.realTimeDrop)
        : null;
      const endDate = dayjs(requestResponse.data.bill.request.endDate);
      if (realTimeDrop && realTimeDrop.isAfter(endDate)) {
        const timeLate = realTimeDrop.diff(endDate, "hour");
        const defaultPenalty = timeLate * 500000; // Ví dụ: 50,000 VNĐ/ngày
        form.setFieldsValue({ penaltyFee: defaultPenalty });
      } else {
        form.setFieldsValue({ penaltyFee: 0 });
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: { userPayStatus3: number }) => {
    setLoading(true);
    try {
      if (billData?._id) {
        const dataSubmit = {
          billId: billData?._id,
          userPayStatus3: values.userPayStatus3
        }
        // Gửi dữ liệu lên server
        await axiosInstance.put("/bill/userPayStatus3", dataSubmit)
          .then(res => {
            toast.success(res.data.message);
            form.resetFields();
            onClose(); // Đóng modal
            if (onSuccess) onSuccess(); // Gọi callback nếu có
          }).catch(err => {
            toast.error(err.response.data.message);
          })
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

  const onSubmit2 = async () => {
    setLoading(true);
    try {
      if (billData?._id) {
        const dataSubmit = {
          billId: billData?._id,
        }
        // Gửi dữ liệu lên server
        await axiosInstance.put("/bill/userStatus4", dataSubmit)
          .then(res => {
            toast.success(res.data.message);
            form.resetFields();
            onClose(); // Đóng modal
            if (onSuccess) onSuccess(); // Gọi callback nếu có
          }).catch(err => {
            toast.error(err.response.data.message);
          })
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

  const onSubmit8 = async () => {
    setLoading(true);
    try {
      if (billData?._id) {
        const dataSubmit = {
          billId: billData?._id,
        }
        // Gửi dữ liệu lên server
        await axiosInstance.put("/bill/userStatus8", dataSubmit)
          .then(res => {
            toast.success(res.data.message);
            form.resetFields();
            onClose(); // Đóng modal
            if (onSuccess) onSuccess(); // Gọi callback nếu có
          }).catch(err => {
            toast.error(err.response.data.message);
          })
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
            <Text strong>Số tiền thuê xe:</Text>
            <p>{billData?.totalCarFee && billData?.totalCarFee.toLocaleString()} VNĐ</p>
          </div>
          <div>
            <Text strong>Số tiền cọc: </Text>
            <p>{mortgateFee.toLocaleString()} VNĐ</p>
          </div>
          {
            billData?.request.requestStatus != "2" && billData?.request.requestStatus != "3" &&
            <div>
              <Text strong>Số tiền người dùng đã thanh toán:</Text>
              <p>{billData?.userPayStatus3?.toLocaleString() || "Chưa có"} VNĐ</p>
            </div>
          }
          {
            billData?.request.requestStatus == "8" &&
            <div>
              <Text strong>Doanh thu:</Text>
              <p>{((billData?.totalCarFee || 0) + (billData?.vatFee || 0)).toLocaleString() || "Chưa có"} VNĐ</p>
            </div>
          }

          <div>
            <Text strong>Thời gian trả xe thực tế:</Text>
            <p>
              {billData?.realTimeDrop
                ? dayjs(billData.realTimeDrop).format("DD/MM/YYYY HH:mm")
                : "Chưa có"}
            </p>
          </div>

          {
            billData?.request.requestStatus == "8" &&
            <div>
              <Text strong>Địa điểm trả xe thực tế:</Text>
              <p>
                {billData?.realLocationDrop
                  ? billData.realLocationDrop
                  : "Chưa có"}
              </p>
            </div>
          }

          <div>
            <Text strong>Địa điểm nhận xe</Text>
            <p>{billData?.request.pickUpLocation || "Chưa có"}</p>
          </div>
          <div>
            <Text strong>Địa điểm trả xe dự kiến:</Text>
            <p>{billData?.request.dropLocation || "Chưa có"}</p>
          </div>
          <div>
            <Text strong>Ngày bắt đầu :</Text>
            <p>
              {billData?.request?.startDate
                ? dayjs(billData?.request?.startDate).format("DD/MM/YYYY HH:mm")
                : "Chưa có"}
            </p>
          </div>
          <div>
            <Text strong>Ngày kết thúc :</Text>
            <p>
              {billData?.request?.endDate
                ? dayjs(billData?.request?.endDate).format("DD/MM/YYYY HH:mm")
                : "Chưa có"}
            </p>
          </div>
        </div>

        {/* Hiển thị ảnh */}
        {billData?.realImage && (billData.request.requestStatus == "7" || billData.request.requestStatus == "8") && (
          <div className="flex items-center">
            <Text strong className="mr-3">Ảnh xác nhận:</Text>
            {
              billData.realImage.map((item, idx) => (
                <Image
                  src={`http://localhost:3030${item}`}
                  alt={`Real Image`}
                  className="w-10 h-10 object-cover rounded-md shadow-sm mr-3"
                  width={40}
                  height={40}
                />
              ))
            }

          </div>
        )}

        {/* Form submit tiền thanh toán */}
        {
          billData?.request.requestStatus == "3" &&
          <Form form={form} onFinish={onSubmit} layout="vertical">
            <Form.Item
              name="userPayStatus3"
              label={<span className="font-medium text-gray-700">Số tiền khách đã thanh toán : VND</span>}
              rules={[
                { required: true, message: "Vui lòng nhập số tiền Khách thanh toán" },
                { type: "number", min: 0, message: "Phí phạt không thể âm" },
              ]}
            >
              <InputNumber
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as any}
                className="w-full"
                placeholder="Nhập số tiền khách thanh toán"
                value={billData.totalCarFee + billData.vatFee + 3000000}
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
      title={<span className="text-xl font-bold">Thông Tin Hóa Đơn</span>}
      open={visible}
      onCancel={onClose}
      footer={billData?.request.requestStatus == "3" ? [
        <Button key="cancel" onClick={() => onSubmit2()} disabled={loading}>
          Người dùng không nhận xe
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
      ] : billData?.request.requestStatus == "7" && [
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => onSubmit8()}
        >
          Xác nhận tình trạng xe và trả cọc
        </Button>
      ]}
      width={800}
      centered
    >
      {renderContent()}
    </Modal>
  );
};

export default PenaltyModal;