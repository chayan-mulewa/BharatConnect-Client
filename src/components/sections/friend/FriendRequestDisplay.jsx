import { Box, Typography, Paper, Stack, Avatar, IconButton, Divider, TextField, colors, Button } from '@mui/material';
import { HiOutlineTrash, HiOutlineCheck, HiOutlineXMark } from 'react-icons/hi2';
import { Window, Selected, Font } from '../../../themes/index';
import { useDataContext } from '../../../contexts/index';
import { useEffect, useState } from 'react';

function FriendRequestDisplay({
  index,
  friendId,
  userId,
  fullName,
  username,
  profilePhoto,
  status
}) {

  const { myDetails, server } = useDataContext();

  const handleAccpetFriend = async () => {
    await server.emit('accpetFriend', { friendId: friendId, user_id_1: myDetails._id, user_id_2: userId, sender: userId, status: 'accepted' });
  }

  const handleDeleteFriend = async () => {
    await server.emit('deleteFriend', { friendId: friendId, user_id_1: myDetails._id, user_id_2: userId, sender: userId, status: 'pending' });
  }

  return (
    <Box style={{ height: '5rem', width: '20rem', display: 'flex', gap: '1rem', padding: '0rem 0.5rem', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Window.secondary, borderRadius: '15px' }}>

      <Stack direction={'row'} spacing={1} >
        <IconButton><Avatar src={profilePhoto} sx={{ height: '3.5rem', width: '3.5rem' }}></Avatar></IconButton>
        <Stack spacing={0.8} justifyContent={'center'} alignItems={'start'}>
          <Typography color={Font.primary} fontWeight={'bold'} >{fullName}</Typography>
          <Typography>{username}</Typography>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1}>
        <IconButton onClick={handleAccpetFriend}><HiOutlineCheck /></IconButton>
        <IconButton onClick={handleDeleteFriend}><HiOutlineXMark /></IconButton>
      </Stack>
    </Box>
  );
}

export default FriendRequestDisplay;
