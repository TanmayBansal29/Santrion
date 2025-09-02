const otpVerification = (otp) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Santrionn | OTP Verification</title>
  <style>
    body {
      background-color: #f4f6f9;
      font-family: "Segoe UI", Roboto, Arial, sans-serif;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #0077b6, #00b4d8);
      padding: 20px;
      text-align: center;
      color: #fff;
    }
    .header h1 {
      margin: 0;
      font-size: 22px;
      letter-spacing: 0.5px;
    }
    .body {
      padding: 30px;
      text-align: center;
    }
    .body h2 {
      font-size: 20px;
      font-weight: 600;
      color: #222;
      margin-bottom: 15px;
    }
    .otp-box {
      display: inline-block;
      padding: 15px 30px;
      font-size: 26px;
      font-weight: bold;
      color: #0077b6;
      background: #f1faff;
      border: 2px dashed #00b4d8;
      border-radius: 8px;
      letter-spacing: 4px;
      margin: 20px 0;
    }
    .body p {
      font-size: 15px;
      line-height: 1.6;
      margin: 10px 0;
      color: #555;
    }
    .footer {
      background: #fafafa;
      padding: 20px;
      font-size: 13px;
      color: #777;
      text-align: center;
      border-top: 1px solid #eee;
    }
    .footer a {
      color: #0077b6;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>Santrionn Secure Verification</h1>
    </div>

    <!-- Body -->
    <div class="body">
      <h2>Complete Your Registration</h2>
      <p>Hello,</p>
      <p>We’re excited to have you onboard with <span class="highlight">Santrionn Healthcare+AI</span>.  
         To ensure the security of your account, please use the One-Time Password (OTP) below:</p>
      
      <div class="otp-box">${otp}</div>

      <p>This code is valid for <strong>5 minutes</strong>. Please enter it in the verification page to complete your setup.</p>
      <p>If you’ve already entered this code, you can safely ignore this email.</p>

      <div class="security-note">
        🔒 <strong>Security Note:</strong>  
        For your protection, never share this OTP with anyone — not even with Santrionn staff.  
        If you did not request this verification, please <a href="mailto:team.santrionn@gmail.com">contact us immediately</a>.
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      Need help? Reach us at 
      <a href="mailto:team.santrionn@gmail.com">team.santrionn@gmail.com</a> <br/>
      © ${new Date().getFullYear()} Santrionn Healthcare+AI. All rights reserved.
    </div>
  </div>
</body>
</html>`;
};

module.exports = otpVerification;
