import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography, Stack, Avatar, IconButton, Input, Snackbar, Alert } from '@mui/material';
import { IsValidToken, OTPGenerator } from '../utils/index';
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { Font } from '../themes/index';
import axios from 'axios';
import { Server } from '../config/index';

function ResetPassword() {

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (document.cookie.includes('token')) {
                    const isValidTokenResult = await IsValidToken();
                    if (!isValidTokenResult) {
                        navigate('/reset-password');
                    }
                } else {
                    navigate('/reset-password');
                }
            } catch (error) {
                navigate('/reset-password');
            }
        };
        fetchData();
    }, []);

    const [step, setStep] = useState(1);

    const [email, setEmail] = useState('');
    const [isEmailError, setIsEmailError] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [sendingEmail, setSendingEmail] = useState('');

    const [userOTP, setUserOTP] = useState('');
    const [generatedOTP, setGeneratedOTP] = useState('');

    const [otpError, setOTPError] = useState('');
    const [isOTPError, setIsOTPError] = useState(false);

    const [newPassword, setNewPassword] = useState('');
    const [isNewPasswordError, setIsNewPasswordError] = useState(false);
    const [newPasswordError, setNewPasswordError] = useState('');

    const [message, setMessage] = useState('');
    const [open, setOpen] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleEmail = (event) => {
        setEmail(event.target.value);
        setEmailError('');
        setIsEmailError(false);
    };

    const handleUserOTP = (event) => {
        setUserOTP(event.target.value);
        setOTPError('');
        setIsOTPError(false);
    };

    const handlePassword = async (event) => {
        setNewPassword(event.target.value);
        setNewPasswordError('');
        setIsNewPasswordError(false);
    };

    const handleSendOTP = async (event) => {
        event.preventDefault();
        if (email.includes(' ') || !email.includes('@gmail.com')) {
            setEmailError('Email is invalid');
            setIsEmailError(true);
            return;
        }

        try {
            const response = await axios.post(Server.authURL+"/validateEmail", {
                email: email
            }, {
                headers: {
                    "Content-Type": "application/json"
                },
            });

            try {
                if (response.status == 200) {
                    setSendingEmail('Sending Email ...');
                    const OTP = OTPGenerator();
                    setGeneratedOTP(OTP);
                    const sendOTPResult = await axios.post(Server.authURL+"/sendOTP", {
                        email: email,
                        otp: OTP
                    }, {
                        headers: {
                            "Content-Type": "application/json"
                        },
                    });
                    if (sendOTPResult.status == 200) {
                        setEmailError('')
                        setIsEmailError(false);
                        setSendingEmail('')
                        setStep(2);
                    }
                }
            } catch (error) {
                if (error.response.data.error === 'email') {
                    setEmailError(error.response.data.message)
                    setIsEmailError(true);
                    setSendingEmail('')
                }
            }
        } catch (error) {
            if (error.response.data.error === 'email') {
                setEmailError(error.response.data.message)
                setIsEmailError(true);
                setSendingEmail('')
            }
        }
    };

    const handleSubmitOTP = async (event) => {
        event.preventDefault();
        if (userOTP != generatedOTP) {
            setOTPError('Invalid OTP Please Enter Valid OTP');
            setIsOTPError(true);
            return;
        }
        setStep(3);
    };

    const handleResetPassword = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(Server.authURL+"/resetPassword", {
                email: email,
                newPassword: newPassword
            }, {
                headers: {
                    "Content-Type": "application/json"
                },
            });
            if (response.status == 200) {
                setEmail('');
                setGeneratedOTP('');
                setUserOTP('');
                setNewPassword('');
                setNewPasswordError('')
                setIsNewPasswordError(false);
                setMessage(response.data.message);
                setOpen(true);
            }
        }
        catch (error) {
            if (error.response.data.error === 'password') {
                setNewPasswordError(error.response.data.message)
                setIsNewPasswordError(true);
            }
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        navigate('/signin');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Box height={'100vh'} width={'100vw'} sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
            {step === 1 && (
                <form action="" onSubmit={handleSendOTP}>
                    <Paper elevation={5} sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant='h4'>Reset Password</Typography>
                        <Stack direction={'column'} gap={2} alignItems={'center'}>
                            <TextField type='text' required value={email} placeholder='Email' error={isEmailError} helperText={emailError} onChange={handleEmail} />
                            <Typography>{sendingEmail}</Typography>
                        </Stack>
                        <Button type='submit' variant='contained' sx={{ width: '100%' }}>Send OTP</Button>
                    </Paper>
                </form>
            )}
            {step === 2 && (
                <form action="" onSubmit={handleSubmitOTP}>
                    <Paper elevation={5} sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant='h4'>Submit OTP</Typography>
                        <Stack direction={'row'} gap={2}>
                            <TextField type='text' required value={userOTP} placeholder='Enter OTP' error={isOTPError} helperText={otpError} onChange={handleUserOTP} />
                        </Stack>
                        <Button type='submit' variant='contained' sx={{ width: '100%' }}>Submit OTP</Button>
                    </Paper>
                </form>
            )}
            {step === 3 && (
                <form action="" onSubmit={handleResetPassword}>
                    <Paper elevation={5} sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant='h4'>Reset Password</Typography>
                        <Stack direction={'row'} gap={2}>
                            {/* <TextField type='password' required value={newPassword} placeholder='Enter New Password' onChange={handlePassword} /> */}
                            <TextField type={showPassword ? 'text' : 'password'} required value={newPassword} placeholder='Password' error={isNewPasswordError} helperText={newPasswordError} onChange={handlePassword} InputProps={{
                                endAdornment: (<IconButton onClick={togglePasswordVisibility}>
                                    {showPassword ? <HiOutlineEyeSlash fontSize={'1.5rem'} /> : <HiOutlineEye fontSize={'1.5rem'} />}
                                </IconButton>)
                            }} />
                        </Stack>
                        <Button type='submit' variant='contained' sx={{ width: '100%' }}>Reset Password</Button>
                    </Paper>
                </form>
            )}

            <Stack>
                <Snackbar sx={{ height: '100%', width: '100%', justifyContent: 'center' }} open={open} autoHideDuration={1} onClose={handleClose}>
                    <Alert severity="success" onClose={handleClose}>
                        {message}
                    </Alert>
                </Snackbar>
            </Stack>
            <Typography variant='body2' color={'gray'} >Note - If you reload the page, the entire procedure will start over.</Typography>
        </Box >
    );
}

export default ResetPassword;
