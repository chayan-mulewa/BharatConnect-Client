import { Box, Typography, Paper, Stack, Avatar, IconButton, Divider, TextField, colors, Button } from '@mui/material';
import { HiOutlineTrash } from 'react-icons/hi2';
import { Window, Selected, Font } from '../../../themes/index';
import { useDataContext } from '../../../contexts/index';
import { useEffect, useState } from 'react';

function FriendDisplay({
    index,
    friendId,
    userId,
    fullName,
    username,
    profilePhoto
}) {
    const { selectedChat, setSubSelectedSectionWindow, setSelectedUserProfile, myDetails, server } = useDataContext();

    const handleUserProfile = async () => {
        await server.emit('getUserDetails', userId);
        setSubSelectedSectionWindow(1);
        setSelectedUserProfile(userId);
    }

    const handleTrashClick = () => {
        server.emit('deleteFriend', { friendId: friendId, user_id_1: myDetails._id, user_id_2: userId });
    }

    return (
        <Box style={{ height: '5rem', width: '100%', display: 'flex', gap: '1rem', padding: '0rem 0.5rem', justifyContent: 'space-between', alignItems: 'center', backgroundColor: selectedChat === friendId ? Selected.primary : Selected.secondary, borderRadius: '15px' }}>
            <Stack direction={'row'} spacing={1} >
                <IconButton onClick={handleUserProfile}><Avatar src={profilePhoto} sx={{ height: '3.5rem', width: '3.5rem' }}></Avatar></IconButton>
                <Stack spacing={0.8} justifyContent={'center'} alignItems={'start'}>
                    <Typography color={Font.primary} fontWeight={'bold'} >{fullName}</Typography>
                    <Typography>{username}</Typography>
                </Stack>
            </Stack>

            <Stack spacing={0.8} alignItems={'end'}>
                <IconButton onClick={handleTrashClick}><HiOutlineTrash /></IconButton>
            </Stack>
        </Box>
    );
}

export default FriendDisplay;
