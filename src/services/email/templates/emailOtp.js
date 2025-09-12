export const otpEmailTemplate = (otp) => `
  <div style="font-family: sans-serif; line-height: 1.5;">
    <h2>Your OTP Code</h2>
    <p>Use the following code to verify your email:</p>
    <h3 style="color: #2e6fa7;">${otp}</h3>
    <p>This code will expire in 10 minutes.</p>
  </div>
`;
