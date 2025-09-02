const forgotPasswordTemplate = (resetLink, username) => {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Reset Your Password | Santrionn</title>
    <style>
      body {
        background-color: #f4f6f9;
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
        box-shadow: 0 6px 20px rgba(0,0,0,0.08);
        overflow: hidden;
      }
      .header {
        background: linear-gradient(135deg, #0077b6, #00b4d8);
        padding: 30px;
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
      .button {
        display: inline-block;
        margin: 25px 0;
        padding: 14px 28px;
        font-size: 16px;
        font-weight: bold;
        color: #fff;
        background: #0077b6;
        border-radius: 6px;
        text-decoration: none;
        box-shadow: 0 4px 10px rgba(0,0,0,0.15);
      }
      .button:hover {
        background: #023e8a;
      }
      .note {
        background: #fafafa;
        border: 1px solid #eee;
        border-radius: 8px;
        font-size: 14px;
        color: #666;
        padding: 15px;
        margin-top: 20px;
        text-align: left;
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
        <h1>Password Reset Request</h1>
      </div>
  
      <!-- Body -->
      <div class="body">
        <h2>Hello ${username || "User"},</h2>
        <p>We received a request to <span class="highlight">reset the password</span> for your Santrionn Healthcare+AI account.</p>
        <p>Click the button below to set a new password. This link is valid for <strong>15 minutes</strong> and can only be used once.</p>
  
        <a href="${resetLink}" class="button">Reset My Password</a>
  
        <p>If the button doesn’t work, copy and paste the following link into your browser:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
  
        <div class="note">
          🔒 <strong>Security Notice:</strong>  
          If you did not request a password reset, please ignore this email. Your account will remain secure.  
        </div>
      </div>
  
      <!-- Footer -->
      <div class="footer">
        Need help? Contact us at 
        <a href="mailto:support@santrionn.com">team.santrionn@gmail.com</a> <br/>
        © ${new Date().getFullYear()} Santrionn Healthcare+AI. All rights reserved.
      </div>
    </div>
  </body>
  </html>`;
  };
  
  module.exports = forgotPasswordTemplate;
  