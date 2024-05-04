import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography, Stack, Avatar, IconButton, Input, Snackbar, Alert } from '@mui/material';
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { IsValidToken } from '../utils/index';
import axios from 'axios';
import { Server } from '../config/index';

const SignUp = () => {

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (document.cookie.includes('token')) {
          const isValidTokenResult = await IsValidToken();
          if (!isValidTokenResult) {
            navigate('/signup');
          }
          else {
            navigate('/');
          }
        } else {
          navigate('/signup');
        }
      } catch (error) {
        navigate('/signup');
      }
    };
    fetchData();
  }, []);

  const fileInputRef = useRef(null);
  const [displayProfilePhoto, setDisplayProfilePhoto] = useState('');
  const [encodedProfilePhoto, setEncodedProfilePhoto] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [isUsernameError, setIsUsernameError] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);

  const [message, setMessage] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleProfilePhoto = (event) => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'image/jpeg') {

      const imageUrl = URL.createObjectURL(file);
      setDisplayProfilePhoto(imageUrl);

      const reader = new FileReader();

      reader.onload = (e) => {
        const imageData = e.target.result;
        setEncodedProfilePhoto(imageData);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleFullName = (event) => {
    setFullName(event.target.value);
  };

  const handleEmail = (event) => {
    setEmail(event.target.value);
    setEmailError('');
    setIsEmailError(false);
  };

  const handleUsername = (event) => {
    setUsername(event.target.value);
    setUsernameError('');
    setIsUsernameError(false);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (username.includes(' ')) {
      setUsernameError('Invalid Username');
      setIsUsernameError(true);
      return;
    }

    if (/[A-Z]/.test(username)) {
      setUsernameError('Username cannot contain capital letters');
      setIsUsernameError(true);
      return;
    }

    if (email.includes(' ') || !email.includes('@gmail.com')) {
      setEmailError('Invalid Email');
      setIsEmailError(true);
      return;
    }

    try {
      const response = await axios.post(Server.authURL+"/signup", {
        full_name: fullName,
        email: email,
        username: username,
        password: password,
        profile_photo: encodedProfilePhoto
      }, {
        headers: {
          "Content-Type": "application/json"
        },
      });

      if (response.status == 201) {
        setFullName('');
        setEmail('');
        setUsername('');
        setPassword('');
        setDisplayProfilePhoto('');
        setEncodedProfilePhoto('');

        setUsernameError('');
        setIsUsernameError(false);
        setEmailError('');
        setIsEmailError(false);

        setMessage(response.data.message);
        setOpen(true);
        return;
      }

      navigate("/signin");
    } catch (error) {
      if (error.response.data.error === 'username') {
        setUsernameError(error.response.data.message)
        setIsUsernameError(true);

        setEmailError('');
        setIsEmailError(false);

      } else if (error.response.data.error === 'email') {
        setEmailError(error.response.data.message)
        setIsEmailError(true);

        setUsernameError('');
        setIsUsernameError(false);
      }
    }

  };

  const handleSignIn = (event) => {
    navigate('/signin');
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box height={'100vh'} width={'100vw'} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} >
      <form action="" onSubmit={handleSubmit}>
        <Paper elevation={5} sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem', justifyContent: 'center', alignItems: 'center' }} >
          <Typography variant='h4' >Sign Up</Typography>

          <Stack direction={'column'} justifyContent={'center'} alignItems={'center'} >
            <Box>
              <IconButton onClick={handleProfilePhoto}>
                <Avatar alt="Profile Photo" src={displayProfilePhoto} sx={{ height: '5rem', width: '5rem' }} />
                <Input inputRef={fileInputRef} type="file" inputProps={{ accept: '.jpg' }} style={{ display: 'none' }} onChange={handleFileInputChange} />
              </IconButton>
            </Box>
            <Typography>Choose Profile Photo</Typography>
          </Stack>

          <Stack direction={'row'} gap={2} >
            <TextField type='text' required value={fullName} placeholder='Full Name' onChange={handleFullName} />
            <TextField type='text' required value={email} placeholder='Email' error={isEmailError} helperText={emailError} onChange={handleEmail} />
          </Stack>

          <Stack direction={'row'} gap={2} >
            <TextField type='text' required value={username} placeholder='Username' error={isUsernameError} helperText={usernameError} onChange={handleUsername} />
            {/* <TextField type='password' required value={password} placeholder='Password' onChange={handlePassword} /> */}
            <TextField type={showPassword ? 'text' : 'password'} required value={password} placeholder='Password' onChange={handlePassword} InputProps={{
              endAdornment: (<IconButton onClick={togglePasswordVisibility}>
                {showPassword ? <HiOutlineEyeSlash fontSize={'1.5rem'} /> : <HiOutlineEye fontSize={'1.5rem'} />}
              </IconButton>)
            }} />
          </Stack>

          <Button type='submit' variant='contained' sx={{ width: '100%' }} >Sign Up</Button>
          <Typography variant='h5'>Or</Typography>
          <Button variant='text' sx={{ width: '100%' }} onClick={handleSignIn}>Sign Up</Button>
        </Paper>
      </form>

      <Stack>
        <Snackbar sx={{ height: '100%', width: '100%', justifyContent: 'center' }} open={open} autoHideDuration={1} onClose={handleClose}>
          <Alert severity="success" onClose={handleClose}>
            {message}
          </Alert>
        </Snackbar>
      </Stack>
    </Box>
  );
};

export default SignUp;
