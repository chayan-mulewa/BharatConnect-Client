import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, TextField, Button, IconButton, Typography, Stack } from '@mui/material';
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { IsValidToken } from '../utils/index';
import axios from 'axios';
import { Server } from '../config/index';

const SignIn = () => {

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (document.cookie.includes('token')) {
          const isValidTokenResult = await IsValidToken();
          if (!isValidTokenResult) {
            navigate('/signin');
          } else {
            navigate('/');
          }
        } else {
          navigate('/signin');
        }
      } catch (error) {
        navigate('/signin');
      }
    };
    fetchData();
  }, []);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [isUsernameError, setIsUsernameError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();


  const handleUsername = (event) => {
    setUsername(event.target.value);
    setUsernameError('');
    setIsUsernameError(false);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
    setPasswordError('');
    setIsPasswordError(false);
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

    try {
      const response = await axios.post(Server.authURL+"/signin", {
        username: username,
        password: password
      }, {
        headers: {
          "Content-Type": "application/json"
        },
      });

      if (response.status == 200) {

        setUsername('');
        setPassword('');
        setUsernameError('');
        setPasswordError('');
        setIsUsernameError(false);
        setIsPasswordError(false);

        const token = response.data.token;

        document.cookie = `token=${token}; path=/`;

        navigate("/");

        return;
      }
    } catch (error) {
      if (error.response.data.error === 'username') {
        setUsernameError(error.response.data.message)
        setIsUsernameError(true);

        setPasswordError('');
        setIsPasswordError(false);

      } else if (error.response.data.error === 'password') {
        setPasswordError(error.response.data.message)
        setIsPasswordError(true);

        setUsernameError('');
        setIsUsernameError(false);
      }
    }
  };

  const handleSignUp = (event) => {
    navigate('/signup');
  };
  const handleForgetPassword = (event) => {
    navigate('/reset-password');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box height={'100vh'} width={'100vw'} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} >
      <form action="" onSubmit={handleSubmit}>
        <Paper elevation={5} sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem', justifyContent: 'center', alignItems: 'center' }} >
          <Typography variant='h4' >Sign In</Typography>
          <TextField sx={{ width: '100%' }} type='text' required value={username} placeholder='Username' error={isUsernameError} helperText={usernameError} onChange={handleUsername}></TextField>
          <TextField type={showPassword ? 'text' : 'password'} required value={password} placeholder='Password' error={isPasswordError} helperText={passwordError} onChange={handlePassword} InputProps={{
            endAdornment: (<IconButton onClick={togglePasswordVisibility}>
              {showPassword ? <HiOutlineEyeSlash fontSize={'1.5rem'} /> : <HiOutlineEye fontSize={'1.5rem'} />}
            </IconButton>)
          }} />
          <Button type='submit' variant='contained' sx={{ width: '100%' }} >Sign In</Button>
          <Button variant='text' sx={{ width: '100%' }} onClick={handleForgetPassword}>Forget Password</Button>
          <Typography variant='h5'>Or</Typography>
          <Button variant='text' sx={{ width: '100%' }} onClick={handleSignUp}>Sign Up</Button>
        </Paper>
      </form>
    </Box>
  );
};

export default SignIn;
