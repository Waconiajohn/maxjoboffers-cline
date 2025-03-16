export const getVerificationEmailContent = ({ verificationLink }) => {
  return {
    subject: 'Verify your MaxJobOffers account',
    text: `
      Welcome to MaxJobOffers!
      
      Please verify your email address by clicking the link below:
      ${verificationLink}
      
      This link will expire in 24 hours.
      
      If you did not create an account with MaxJobOffers, please ignore this email.
      
      Best regards,
      The MaxJobOffers Team
    `,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify your MaxJobOffers account</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #f9f9f9;
              border-radius: 5px;
              padding: 20px;
              border: 1px solid #eee;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
            }
            .button {
              display: inline-block;
              background-color: #2563eb;
              color: white;
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              margin-top: 30px;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">MaxJobOffers</div>
            </div>
            <p>Welcome to MaxJobOffers!</p>
            <p>Please verify your email address by clicking the button below:</p>
            <div style="text-align: center;">
              <a href="${verificationLink}" class="button">Verify Email Address</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p><a href="${verificationLink}">${verificationLink}</a></p>
            <p>This link will expire in 24 hours.</p>
            <p>If you did not create an account with MaxJobOffers, please ignore this email.</p>
            <p>Best regards,<br>The MaxJobOffers Team</p>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} MaxJobOffers. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  };
};

export const getPasswordResetEmailContent = ({ passwordResetLink }) => {
  return {
    subject: 'Reset your MaxJobOffers password',
    text: `
      Hello,
      
      We received a request to reset your password for your MaxJobOffers account.
      
      Please click the link below to reset your password:
      ${passwordResetLink}
      
      This link will expire in 1 hour.
      
      If you did not request a password reset, please ignore this email or contact support if you have concerns.
      
      Best regards,
      The MaxJobOffers Team
    `,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset your MaxJobOffers password</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #f9f9f9;
              border-radius: 5px;
              padding: 20px;
              border: 1px solid #eee;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
            }
            .button {
              display: inline-block;
              background-color: #2563eb;
              color: white;
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              margin-top: 30px;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">MaxJobOffers</div>
            </div>
            <p>Hello,</p>
            <p>We received a request to reset your password for your MaxJobOffers account.</p>
            <p>Please click the button below to reset your password:</p>
            <div style="text-align: center;">
              <a href="${passwordResetLink}" class="button">Reset Password</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p><a href="${passwordResetLink}">${passwordResetLink}</a></p>
            <p>This link will expire in 1 hour.</p>
            <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
            <p>Best regards,<br>The MaxJobOffers Team</p>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} MaxJobOffers. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  };
};
