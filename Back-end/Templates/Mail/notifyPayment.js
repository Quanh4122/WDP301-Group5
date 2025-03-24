module.exports = (name, link, VATFee, totalcarFee, depositFee, totalMoney) => {
  return `<!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thông báo đặt xe</title>
          <style>
              /* Reset mặc định để tương thích với email client */
              body {
                  margin: 0;
                  padding: 0;
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  background-color: #f4f4f4;
                  color: #333;
                  line-height: 1.6;
              }
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  padding: 20px;
                  background-color: #ffffff;
                  border-radius: 8px;
                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              }
              h2 {
                  font-size: 24px;
                  color: #007bff;
                  text-align: center;
                  margin: 0 0 20px 0;
                  padding-bottom: 10px;
                  border-bottom: 2px solid #e9ecef;
              }
              p {
                  font-size: 16px;
                  margin: 0 0 15px 0;
              }
              .details-section {
                  background-color: #f8f9fa;
                  padding: 15px;
                  border-radius: 6px;
                  margin-bottom: 20px;
                  border: 1px solid #e9ecef;
              }
              .details-section h3 {
                  font-size: 18px;
                  color: #007bff;
                  margin: 0 0 15px 0;
                  padding-bottom: 5px;
                  border-bottom: 1px solid #dee2e6;
              }
              .details-section p {
                  font-size: 14px;
                  margin: 0 0 10px 0;
              }
              .details-section p strong {
                  color: #495057;
              }
              .button {
                  display: inline-block;
                  padding: 12px 30px;
                  background-color: #007bff;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 6px;
                  font-size: 16px;
                  font-weight: 500;
                  text-align: center;
                  transition: background-color 0.3s ease;
              }
              .button:hover {
                  background-color: #0056b3;
              }
              .footer {
                  font-size: 12px;
                  color: #6c757d;
                  text-align: center;
                  margin-top: 20px;
                  padding-top: 10px;
                  border-top: 1px solid #e9ecef;
              }
              /* Responsive design */
              @media only screen and (max-width: 600px) {
                  .container {
                      width: 100%;
                      margin: 10px auto;
                      padding: 15px;
                  }
                  h2 {
                      font-size: 20px;
                  }
                  .button {
                      width: 100%;
                      box-sizing: border-box;
                  }
                  .details-section p {
                      font-size: 13px;
                  }
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h2>Thông báo đặt xe</h2>
              <p>Chào bạn, ${name},</p>
      
              <div class="details-section">
                  <h3>Chi tiết đặt xe</h3>
                  <p><strong>Thuế VAT:</strong> ${VATFee}</p>
                  <p><strong>Tổng tiền thuê xe:</strong> ${totalcarFee}</p>
                  ${
                    depositFee
                      ? `<p><strong>Số tiền phạt:</strong> ${depositFee}</p>`
                      : ""
                  }
                  <p><strong>Số tiền cần thanh toán:</strong> ${totalMoney}</p>
              </div>
      
              <p>Nhấn vào liên kết dưới đây để xác nhận thanh toán:</p>
              <a href="${link}" class="button">Xác nhận thanh toán</a>
              <p class="footer">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
          </div>
      </body>
      </html>`;
};
