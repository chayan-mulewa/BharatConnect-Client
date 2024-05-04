import React from 'react';
import { Box, Typography, Paper, Stack, Avatar, IconButton, Divider, TextField, colors, Button } from '@mui/material';
import { HiOutlinePlus } from 'react-icons/hi2';
import { Window, Selected, Font } from '../../../themes/index';
import { useDataContext } from '../../../contexts/index';
import { useEffect, useState } from 'react';

function CreateGroupChatDisplay({
    index,
    setGroupMembers,
    friendId,
    userId,
    fullName,
    username,
    profilePhoto,
    setGroupnameError,
    setIsGroupnameError
}) {

    const { myDetails, server } = useDataContext();

    const handleCreateGroupChat = async () => {
        setGroupMembers(prevOnlineUsers => {
            const userExists = prevOnlineUsers.some(user => user._id === userId);
            if (!userExists) {
                return [...prevOnlineUsers, { _id: userId, full_name: fullName, username: username, profile_photo: profilePhoto }];
            }
            return prevOnlineUsers;
        });
        setGroupnameError('')
        setIsGroupnameError(false);
    }

    return (
        <Box style={{ height: '5rem', width: '20rem', display: 'flex', gap: '1rem', padding: '0rem 0.5rem', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Window.primary, borderRadius: '15px' }}>

            <Stack direction={'row'} spacing={1} >
                <IconButton><Avatar src={profilePhoto} sx={{ height: '3.5rem', width: '3.5rem' }}></Avatar></IconButton>
                <Stack spacing={0.8} justifyContent={'center'} alignItems={'start'}>
                    <Typography color={Font.primary} fontWeight={'bold'} >{fullName}</Typography>
                    <Typography>{username}</Typography>
                </Stack>
            </Stack>

            <Stack spacing={0.8} alignItems={'end'}>
                <IconButton onClick={handleCreateGroupChat}><HiOutlinePlus /></IconButton>
            </Stack>
        </Box>
    );
}

export default CreateGroupChatDisplay;
