import { Box, Typography, Paper, Stack, Avatar, IconButton, Divider, TextField, colors, Button } from '@mui/material';
import { HiOutlineCheck, HiOutlineXMark, HiOutlinePlus } from 'react-icons/hi2';
import { Window, Selected, Font } from '../../../themes/index';
import { useDataContext } from '../../../contexts/index';
import { useEffect, useState } from 'react';

function SearchDisplay({
    index,
    friendId,
    userId,
    fullName,
    username,
    profilePhoto,
    isFriend,
    isSender,
    isCancel,
    searchQuery,
    status
}) {
    const { setSubSelectedSectionWindow, setSelectedUserProfile, myDetails, server } = useDataContext();

    const handleCreateFriend = async () => {
        await server.emit('createFriend', { user_id_1: myDetails._id, user_id_2: userId, sender: myDetails._id, status: 'pending' });
    }

    const handleAccpetFriend = async () => {
        await server.emit('accpetFriend', { friendId: friendId, user_id_1: myDetails._id, user_id_2: userId, sender: userId, status: status });
    }

    const handleDeleteFriend = async () => {
        await server.emit('deleteFriend', { friendId: friendId, user_id_1: myDetails._id, user_id_2: userId, sender: myDetails._id, status: status });
    }

    const handleUserProfile = async () => {
        await server.emit('getUserDetails', userId);
        setSubSelectedSectionWindow(1);
        setSelectedUserProfile(userId);
    }

    return (
        <Box style={{ height: '5rem', width: '100%', display: 'flex', gap: '1rem', padding: '0rem 0.5rem', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Selected.secondary, borderRadius: '15px' }}>

            <Stack direction={'row'} spacing={1} >
                <IconButton onClick={handleUserProfile}><Avatar src={profilePhoto} sx={{ height: '3.5rem', width: '3.5rem' }}></Avatar></IconButton>
                <Stack spacing={0.8} justifyContent={'center'} alignItems={'start'}>
                    <Typography color={Font.primary} fontWeight={'bold'} >{fullName}</Typography>
                    <Typography>{username}</Typography>
                </Stack>
            </Stack>

            <Stack spacing={0.8} alignItems={'end'}>
                {isFriend && isSender && !isCancel && (
                    <IconButton onClick={handleDeleteFriend}><HiOutlineXMark /></IconButton>
                )}
                {isFriend && !isSender && isCancel && (
                    <Stack direction="row" spacing={1}>
                        <IconButton onClick={handleAccpetFriend}><HiOutlineCheck /></IconButton>
                        <IconButton onClick={handleDeleteFriend}><HiOutlineXMark /></IconButton>
                    </Stack>
                )}
                {!isFriend && !isSender && !isCancel && (
                    <IconButton onClick={handleCreateFriend}><HiOutlinePlus /></IconButton>
                )}
            </Stack>
        </Box>
    );
}

export default SearchDisplay;
