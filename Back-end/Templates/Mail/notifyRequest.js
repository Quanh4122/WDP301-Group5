module.exports = (
  name,
  link,
  status,
  VATFee,
  totalMoney,
  totalFee,
  start,
  end,
  arrDup
) => {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Thông báo đặt xe</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            padding: 30px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        h2 {
            text-align: center;
            margin-bottom: 20px;
        }
        p {
            margin-bottom: 15px;
        }
        .status-accepted {
            color: #28a745;
            font-weight: bold;
        }
        .status-rejected {
            color: #dc3545;
            font-weight: bold;
        }
        .button {
            display: inline-block;
            padding: 12px 25px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
            text-align: center;
        }
        .button:hover {
            background-color: #0056b3;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #777;
        }
        .details-section {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .details-section h3 {
            margin-top: 0;
            color: #007bff;
        }
        .details-section p {
            margin-bottom: 10px;
        }
        .car-list {
            list-style: none;
            padding: 0;
        }
        .car-list li {
            margin-bottom: 5px;
        }
        .success-message {
            color: #28a745;
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .error-message {
            color: #721c24;
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Thông báo đặt xe</h2>
        <p>Chào bạn, ${name},</p>

        ${
          status
            ? `
            <div class="success-message">
                <p>Đơn đặt xe của bạn đã được <span class="status-accepted">Được chấp nhận</span>.</p>
            </div>
            <div class="details-section">
                <h3>Chi tiết đặt xe</h3>
                <p><strong>Từ:</strong> ${start}</p>
                <p><strong>Đến:</strong> ${end}</p>
                <p><strong>Thuế VAT:</strong> ${VATFee}</p>
                <p><strong>Tổng tiền thuê xe:</strong> ${totalMoney}</p>
            </div>

            <p>Chúng tôi xin thông báo về yêu cầu thanh toán của bạn:</p>
            <p><strong>Số tiền cần thanh toán:</strong> ${totalFee}</p>
            <p>Để xem chi tiết, vui lòng nhấn vào nút bên dưới:</p>
            <div style="text-align: center;">
                <a href="${link}" class="button">Xem chi tiết</a>
            </div>
            <p class="footer">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
        `
            : `
            <div class="error-message">
                <p>Đơn đặt xe của bạn đã bị <span class="status-rejected">Từ chối</span>.</p>
                <p>Lý do: Các xe sau đã được đặt trong khoảng thời gian bạn chọn:</p>
                <ul class="car-list">
                    ${arrDup
                      .map(
                        (car) => `
                        <li>
                            <strong>Tên xe:</strong> ${car.carName} ${car.carVersion},
                            <strong>Biển số:</strong> ${car.licensePlateNumber}
                        </li>
                    `
                      )
                      .join("")}
                </ul>
            </div>
            <div style="text-align: center;">
                <a href="${link}" class="button">Xem chi tiết</a>
            </div>
        `
        }
    </div>
</body>
</html>`;
};
