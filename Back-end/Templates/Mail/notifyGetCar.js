module.exports = (
  name,
  start,
  end,
  pickUplocation,
  moneyMortgate,
  moneyTotal
) => {
  return `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sắp đến thời hạn nhận xe</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: 'Helvetica Neue', Arial, sans-serif;
                    background-color: #f5f7fa;
                    color: #333;
                    line-height: 1.6;
                    padding: 20px;
                }
                .container {
                    max-width: 650px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #007bff;
                    padding: 20px;
                    text-align: center;
                    color: #ffffff;
                }
                .header h2 {
                    font-size: 24px;
                    font-weight: 600;
                    margin: 0;
                }
                .content {
                    padding: 30px;
                }
                .greeting {
                    font-size: 16px;
                    margin-bottom: 20px;
                }
                .success-message {
                    background-color: #e6f4ea;
                    border-left: 4px solid #28a745;
                    padding: 15px 20px;
                    border-radius: 6px;
                    margin-bottom: 25px;
                    font-size: 15px;
                }
                .success-message span {
                    color: #28a745;
                    font-weight: 600;
                }
                .details-section {
                    background-color: #fafafa;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 25px;
                    border: 1px solid #eee;
                }
                .details-section h3 {
                    font-size: 18px;
                    color: #007bff;
                    margin-bottom: 15px;
                    font-weight: 500;
                }
                .details-section p {
                    font-size: 14px;
                    margin-bottom: 10px;
                }
                .details-section p strong {
                    color: #444;
                    font-weight: 600;
                }
                .cta {
                    font-size: 15px;
                    margin-bottom: 20px;
                }
                .button {
                    display: inline-block;
                    padding: 12px 30px;
                    background-color: #007bff;
                    color: #ffffff; /* Màu chữ trắng rõ ràng */
                    text-decoration: none;
                    border-radius: 25px;
                    font-weight: 600; /* Đậm hơn để dễ nhìn */
                    font-size: 15px;
                    transition: background-color 0.3s ease;
                    text-align: center;
                }
                .button:hover {
                    background-color: #0056b3;
                    color: #ffffff; /* Giữ màu trắng khi hover */
                }
                .footer {
                    text-align: center;
                    padding: 20px;
                    background-color: #f5f7fa;
                    color: #666;
                    font-size: 13px;
                    border-top: 1px solid #eee;
                }
                @media only screen and (max-width: 600px) {
                    .container {
                        width: 100%;
                        margin: 0;
                    }
                    .content {
                        padding: 20px;
                    }
                    .header h2 {
                        font-size: 20px;
                    }
                    .button {
                        width: 100%;
                        padding: 12px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Thông báo nhận xe</h2>
                </div>
                <div class="content">
                    <p class="greeting">Chào bạn, ${name},</p>
                    <div class="success-message">
                        <p>Còn 1h nữa đến thời gian lấy xe !!!</span></p>
                    </div>
                    <div class="details-section">
                        <h3>Chi tiết đặt xe</h3>
                        <p><strong>Từ:</strong> ${start}</p>
                        <p><strong>Đến:</strong> ${end}</p>
                        <p><strong>Nơi nhận xe:</strong> ${pickUplocation}</p>
                        <p><strong>Số tiền thế chấp :</strong> ${moneyMortgate}</p>
                        <p><strong>Số tiền thuê :</strong> ${moneyTotal}</p>
                        <p class="cta">Trong 1h nữa hãy có mặt tại địa điểm nhận xe để có thể lấy xe ngay nhé !!!</p>
                    </div>
                </div>
                <div class="footer">
                    <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
                    <p>© 2025 Công ty cho thuê xe. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>`;
};
