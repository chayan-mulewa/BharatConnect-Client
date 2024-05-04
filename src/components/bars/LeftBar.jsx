import { useEffect, useState } from 'react';
import { useDataContext } from '../../contexts/index';
import { Box, Typography, Paper, Stack, Avatar, IconButton, Divider } from '@mui/material';
import { HiOutlineChatBubbleOvalLeftEllipsis, HiOutlineUserGroup, HiMagnifyingGlass } from 'react-icons/hi2';
import { AiOutlineComment } from "react-icons/ai";
import { Window, Selected } from '../../themes/index';
import logo from '../../assets/images/logos/BharatConnect.png';

function LeftBar() {

  const { selectedSection, setSelectedSection, myDetails } = useDataContext();

  const handleChatsButtonClick = (buttonKey) => {
    setSelectedSection(buttonKey);
  };

  const handleGroupsButtonClick = (buttonKey) => {
    setSelectedSection(buttonKey);
  };

  const handleSearchButtonClick = (buttonKey) => {
    setSelectedSection(buttonKey);
  }

  const handleFriendButtonClick = (buttonKey) => {
    setSelectedSection(buttonKey);
  }

  const handleMyProfileButtonClick = (buttonKey) => {
    setSelectedSection(buttonKey);
  }

  return (
    <Paper sx={{ height: '100%', minWidth: '6rem', width: '6rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Window.primary }} >
      <Stack spacing={3}>
        <Stack sx={{ height: '3rem', width: '3rem', backgroundColor: Selected.primary, justifyContent: 'center', alignItems: 'center', borderRadius: '15%' }}>
          {/* <Box component={'img'} src={logo} sx={{ height: '3.4rem', width: '3.5rem', borderRadius: '0px', mixBlendMode: 'multiply'}} /> */}
          <Typography color={'white'} variant='h5'>BC</Typography>
        </Stack>
        <Divider orientation='horizontal' />
        <Stack spacing={3} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <IconButton key={1} style={{ backgroundColor: selectedSection === 1 ? Selected.primary : 'transparent', borderRadius: '25%' }} onClick={() => handleChatsButtonClick(1)}> <HiOutlineChatBubbleOvalLeftEllipsis style={{ fontSize: '1.4rem', color: selectedSection === 1 ? Selected.secondary : '' }} /> </IconButton>
          <IconButton key={2} style={{ backgroundColor: selectedSection === 2 ? Selected.primary : 'transparent', borderRadius: '25%' }} onClick={() => handleGroupsButtonClick(2)}> <AiOutlineComment style={{ fontSize: '1.4rem', color: selectedSection === 2 ? Selected.secondary : '' }} /> </IconButton>
        </Stack>
        <Divider orientation='horizontal' />
        <Stack spacing={3} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <IconButton key={3} style={{ backgroundColor: selectedSection === 3 ? Selected.primary : 'transparent', borderRadius: '25%' }} onClick={() => handleSearchButtonClick(3)}> <HiMagnifyingGlass style={{ fontSize: '1.4rem', color: selectedSection === 3 ? Selected.secondary : '' }} /> </IconButton>
          <IconButton key={4} style={{ backgroundColor: selectedSection === 4 ? Selected.primary : 'transparent', borderRadius: '25%' }} onClick={() => handleFriendButtonClick(4)}> <HiOutlineUserGroup style={{ fontSize: '1.4rem', color: selectedSection === 4 ? Selected.secondary : '' }} /> </IconButton>
        </Stack>
        <Divider orientation='horizontal' />
      </Stack>
      <Stack spacing={3} >
        <Divider orientation='horizontal' />
        <Stack>
          <IconButton key={4} style={{ backgroundColor: selectedSection === 5 ? Selected.primary : 'transparent', borderRadius: '25%' }} onClick={() => handleMyProfileButtonClick(5)}><Avatar src={myDetails.profile_photo} sx={{ height: '3rem', width: '3rem' }} />  </IconButton>
          {/* <IconButton>  </IconButton> */}
        </Stack>
      </Stack>
    </Paper>
  );
}

export default LeftBar;