const OTPGenerator = () => {
    const OTP_LENGTH = 5;
    const OTP_CHARS = '0123456789';
    let otp = '';

    for (let i = 0; i < OTP_LENGTH; i++) {
        otp += OTP_CHARS.charAt(Math.floor(Math.random() * OTP_CHARS.length));
    }

    return otp;
};

export default OTPGenerator;
