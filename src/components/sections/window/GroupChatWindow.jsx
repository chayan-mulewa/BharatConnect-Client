import { useState, useEffect, useRef } from 'react';
import { useDataContext } from '../../../contexts/index';
import { GroupMessages } from '../../index';
import { Box, Typography, Paper, Stack, Avatar, IconButton, Divider, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Window, Selected, Font } from '../../../themes/index';
import { HiMagnifyingGlass, HiTrash, HiMiniPaperClip, HiOutlineFaceSmile, HiArrowRightOnRectangle } from "react-icons/hi2";
import { PiPaperPlane } from "react-icons/pi";

function GroupChatWindow() {

    const { setSelectedSectionWindow, selectedGroupChat, oneToOneChatList, groupChatList, friendList, myDetails, onlineUsers, server } = useDataContext();

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showSearchConfirmation, setShowSearchConfirmation] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState('');
    const messagesRef = useRef([]);

    const handleTrashClick = () => {
        setShowDeleteConfirmation(true);
    };

    const handleSearchClick = () => {
        setShowSearchConfirmation(true);
    };

    const handleConfirmDelete = async () => {

        const groupChat = await groupChatList.find((groupChat, index) => {
            if (groupChat._id == selectedGroupChat) {
                return groupChat;
            }
        })

        await server.emit('deleteGroupChat', { groupChatId: selectedGroupChat, createdBy: groupChat.createdBy, userId: myDetails._id });
        setShowDeleteConfirmation(false);
        setSelectedSectionWindow(null);
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirmation(false);
    };

    const handleConfirmSearch = () => {
        scrollToMessage(searchQuery);
        setShowSearchConfirmation(false);
    };

    const handleCancelSearch = () => {
        setShowSearchConfirmation(false);
    };


    const scrollToMessage = (query) => {
        const index = messagesRef.current.findIndex(msg => msg.props.children == query);
        if (index !== -1) {
            messagesRef.current[index].ref.scrollIntoView({ behavior: 'smooth' });
        } else {
            alert("Message not found");
        }
        setSearchQuery('');
    };

    const messagesContainerRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [message]);

    const handleMessage = async (event) => {
        setMessage(event.target.value);
    };

    const handleSendMessageByEnterKey = async (event) => {
        if (event.key === 'Enter') {
            if (message == '') {
                return;
            }
            await server.emit('sendGroupMessage', { groupChatId: selectedGroupChat, userId: myDetails._id, sender: myDetails._id, message: message, messageType: 'text', messageTime: new Date().toISOString() });
            setMessage('');
        }
    }
    const handleSendMessageBySendButton = async (event) => {
        if (message == '') {
            return;
        }
        await server.emit('sendGroupMessage', { groupChatId: selectedGroupChat, userId: myDetails._id, sender: myDetails._id, message: message, messageType: 'text', messageTime: new Date().toISOString() });
        setMessage('');
    }

    // useEffect(() => {
    //     server.emit('setGroupMessgeCountZero', selectedChat);
    // }, [groupChatList]);

    return (
        <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: Window.primary, overflow: 'hidden' }}>
            <Box sx={{ height: '5rem', width: '100%', padding: '0rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Window.secondary }}>
                <Stack direction={'row'} spacing={1}>
                    <Avatar src={groupChatList.find(groupChat => groupChat._id == selectedGroupChat).profile_photo} sx={{ height: '3.5rem', width: '3.5rem' }}></Avatar>
                    <Stack spacing={0.8} alignItems={'start'}>
                        <Typography color={Font.primary} fontWeight={'bold'} > {groupChatList.find(groupChat => groupChat._id === selectedGroupChat).groupName}</Typography>
                    </Stack>
                </Stack>
                <Stack spacing={1} alignItems={'center'} direction={'row'}>
                    {/* <IconButton onClick={handleSearchClick}><HiMagnifyingGlass /></IconButton> */}
                    <IconButton onClick={handleTrashClick}><HiArrowRightOnRectangle /></IconButton>
                </Stack>
            </Box>

            <Dialog open={showDeleteConfirmation} onClose={handleCancelDelete}>
                <DialogTitle>Confirm Group Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to leave this group?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* <Box ref={messagesContainerRef} sx={{ height: 'calc(100vh - 10rem)', width: '100%', display: 'flex', flexDirection: 'column', padding: '0rem', backgroundColor: Window.primary, overflow: 'auto' }}>
                {
                    groupChatList.map((groupChat, index) => {
                        if (groupChat._id !== selectedChat) {
                            return null;
                        }

                        return groupChat.messages.map(async (message, messageIndex) => {
                            const isSender = message.sender === myDetails._id;
                            const user = await groupChatList.users?.map((user,index)=>{
                                if(user._id==message.sender){
                                    return user;
                                }
                            });

                            return (
                                <GroupMessages
                                    key={messageIndex}
                                    groupChatId={message.groupChatId}
                                    username={user}
                                    messageId={message._id}
                                    message={message.message}
                                    messageType={message.messageType}
                                    messageTime={new Date(message.messageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    sender={isSender}
                                />
                            );
                        });
                    })
                }

            </Box> */}

            <Box ref={messagesContainerRef} sx={{ height: 'calc(100vh - 10rem)', width: '100%', display: 'flex', flexDirection: 'column', padding: '0rem', backgroundColor: Window.primary, overflow: 'auto' }}>
                {groupChatList.map((groupChat, index) => {
                    if (groupChat._id !== selectedGroupChat) {
                        return null;
                    }
                    return groupChat.messages.map((message, messageIndex) => {
                        if (message.userId == myDetails._id) {
                            const isSender = message.sender === myDetails._id;
                            const user = groupChat.users.find(user => user._id === message.sender);

                            return (
                                <GroupMessages
                                    key={messageIndex}
                                    username={user.username}
                                    messageId={message._id}
                                    message={message.message}
                                    messageType={message.messageType}
                                    messageTime={new Date(message.messageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    chatId={message.groupChatId}
                                    sender={isSender}
                                    receiver={!isSender}
                                />
                            );
                        }
                    });
                })}
            </Box>

            <Box sx={{ height: '5rem', width: '100%', padding: '0rem 1rem', display: 'flex', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Window.secondary }}>
                <TextField size='small' type='text' sx={{
                    width: '100%', borderRadius: '1rem', '& input::placeholder': { color: '#709ce6', opacity: '100%' }, backgroundColor: '#eaf2fe', '& .MuiOutlinedInput-root': { borderRadius: '0.5rem' },
                }} placeholder='write a message...' value={message} onChange={handleMessage} onKeyDown={handleSendMessageByEnterKey} />
                <IconButton style={{ backgroundColor: Selected.primary, borderRadius: '25%' }} onClick={handleSendMessageBySendButton} > <PiPaperPlane style={{ color: Selected.secondary }} /> </IconButton>
            </Box>
        </Box>
    );
}

export default GroupChatWindow;
