const passwordUpdateSuccess = () => {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Password Updated Successfully | Santrionn</title>
    <style>
      body {
        background-color: #eef2f7;
        font-family: "Segoe UI", Roboto, Arial, sans-serif;
        margin: 0;
        padding: 0;
        color: #333;
      }
      .container {
        max-width: 640px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 6px 18px rgba(0,0,0,0.1);
        overflow: hidden;
      }
      .header {
        background: linear-gradient(135deg, #0077b6, #00b4d8);
        padding: 25px;
        text-align: center;
        color: #fff;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
        letter-spacing: 0.5px;
      }
      .body {
        padding: 40px 30px;
        text-align: center;
      }
      .body h2 {
        font-size: 22px;
        font-weight: 600;
        color: #222;
        margin-bottom: 20px;
      }
      .body p {
        font-size: 16px;
        line-height: 1.7;
        margin: 12px 0;
        color: #555;
      }
      .highlight {
        font-weight: 600;
        color: #0077b6;
      }
      .security-note {
        background: #fafafa;
        border: 1px solid #eee;
        border-radius: 8px;
        font-size: 14px;
        color: #666;
        padding: 15px;
        margin-top: 25px;
        text-align: left;
      }
      .button {
        display: inline-block;
        margin-top: 25px;
        padding: 12px 25px;
        font-size: 16px;
        font-weight: bold;
        color: #fff;
        background: #0077b6;
        border-radius: 6px;
        text-decoration: none;
      }
      .footer {
        background: #f8f9fb;
        padding: 20px;
        font-size: 14px;
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
        <h1>Password Updated Successfully</h1>
      </div>
  
      <!-- Body -->
      <div class="body">
        <h2>Your password has been changed</h2>
        <p>Hello,</p>
        <p>We wanted to let you know that your <span class="highlight">Santrionn Healthcare+AI</span> account password was updated successfully.</p>
        
        <p>If this was you, no further action is needed. You can now log in with your new password.</p>
  
        <a href="https://santrionn.com/login" class="button">Login Now</a>
  
        <div class="security-note">
          🔒 <strong>Important Security Notice:</strong>  
          If you did <u>not</u> make this change, please reset your password immediately and contact our support team.  
          This ensures the security of your account and data.
        </div>
      </div>
  
      <!-- Footer -->
      <div class="footer">
        Need help? Reach us at 
        <a href="mailto:support@santrionn.com">support@santrionn.com</a> <br/>
        © ${new Date().getFullYear()} Santrionn Healthcare+AI. All rights reserved.
      </div>
    </div>
  </body>
  </html>`;
  };
  
  module.exports = passwordUpdateSuccess;
  