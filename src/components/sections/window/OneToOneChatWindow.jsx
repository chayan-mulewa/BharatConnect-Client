import { useState, useEffect, useRef } from 'react';
import { useDataContext } from '../../../contexts/index';
import { OneToOneMessages } from '../../index';
import { Box, Typography, Paper, Stack, Avatar, IconButton, Divider, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Window, Selected, Font } from '../../../themes/index';
import { HiMagnifyingGlass, HiTrash, HiMiniPaperClip, HiOutlineFaceSmile } from "react-icons/hi2";
import { PiPaperPlane } from "react-icons/pi";

function OneToOneChatWindow() {

  const { setSelectedSectionWindow, setSubSelectedSectionWindow, setSelectedUserProfile, selectedChat, oneToOneChatList, friendList, myDetails, onlineUsers, server } = useDataContext();

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
    await server.emit('deleteOneToOneChat', selectedChat);
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

  const messages = [];

  for (let i = 1; i <= 30; i++) {
    messages.push(i);
  }

  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [message]);

  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (onlineUsers.includes(oneToOneChatList.find(chat => chat._id === selectedChat).user._id)) {
      setIsOnline(true)
    }
    else {
      setIsOnline(false);
    }
  }, [onlineUsers]);

  const handleMessage = async (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessageByEnterKey = async (event) => {
    if (event.key === 'Enter') {
      if (message == '') {
        return;
      }
      await server.emit('sendMessage', { chatId: selectedChat, user_id_1: myDetails._id, user_id_2: oneToOneChatList.find(chat => chat._id === selectedChat).user._id, senser: myDetails._id, receiver: oneToOneChatList.find(chat => chat._id === selectedChat).user._id, message: message, messageType: 'text', messageTime: new Date().toISOString() });
      setMessage('');
    }
  }
  const handleSendMessageBySendButton = async (event) => {
    if (message == '') {
      return;
    }
    await server.emit('sendMessage', { chatId: selectedChat, user_id_1: myDetails._id, user_id_2: oneToOneChatList.find(chat => chat._id === selectedChat).user._id, senser: myDetails._id, receiver: oneToOneChatList.find(chat => chat._id === selectedChat).user._id, message: message, messageType: 'text', messageTime: new Date().toISOString() });
    setMessage('');
  }

  useEffect(() => {
    server.emit('setMessgeCountZero', selectedChat);
  }, [oneToOneChatList]);

  const handleUserProfile = async () => {
    await server.emit('getUserDetails', oneToOneChatList.find(chat => chat._id === selectedChat).user._id);
    setSubSelectedSectionWindow(1);
    setSelectedUserProfile(oneToOneChatList.find(chat => chat._id === selectedChat).user._id);
  }

  return (
    <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: Window.primary, overflow: 'hidden' }}>
      <Box sx={{ height: '5rem', width: '100%', padding: '0rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Window.secondary }}>
        <Stack direction={'row'} spacing={1}>
          <IconButton onClick={handleUserProfile}><Avatar src={oneToOneChatList.find(chat => chat._id === selectedChat).user.profile_photo} sx={{ height: '3.5rem', width: '3.5rem' }}></Avatar></IconButton>
          <Stack spacing={0.8} alignItems={'start'}>
            <Typography color={Font.primary} fontWeight={'bold'} > {oneToOneChatList.find(chat => chat._id === selectedChat).user.full_name}</Typography>
            {
              isOnline ?
                <>
                  <Typography>Online</Typography>
                </> :
                <>
                  <Typography>Offline</Typography>
                </>
            }
          </Stack>
        </Stack>
        <Stack spacing={1} alignItems={'center'} direction={'row'}>
          <IconButton onClick={handleSearchClick}><HiMagnifyingGlass /></IconButton>
          <IconButton onClick={handleTrashClick}><HiTrash /></IconButton>
        </Stack>
      </Box>

      <Dialog open={showDeleteConfirmation} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this chat?
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

      <Dialog open={showSearchConfirmation} onClose={handleCancelSearch}>
        <DialogTitle>Search For Message</DialogTitle>
        <DialogContent>
          <TextField placeholder='search message...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelSearch} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmSearch} color="primary">
            Search
          </Button>
        </DialogActions>
      </Dialog>

      <Box ref={messagesContainerRef} sx={{ height: 'calc(100vh - 10rem)', width: '100%', display: 'flex', flexDirection: 'column', padding: '0rem', backgroundColor: Window.primary, overflow: 'auto' }}>
        {
          oneToOneChatList.map((chat, index) => {
            if (chat._id !== selectedChat) {
              return null;
            }

            return chat.messages.map((message, messageIndex) => {
              const isSender = message.sender === myDetails._id;

              return (
                <OneToOneMessages
                  key={messageIndex}
                  messageId={message._id}
                  message={message.message}
                  messageType={message.messageType}
                  messageTime={new Date(message.messageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  chatId={message.chatId}
                  sender={isSender}
                  receiver={!isSender}
                />
              );
            });
          })
        }

      </Box>
      <Box sx={{ height: '5rem', width: '100%', padding: '0rem 1rem', display: 'flex', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Window.secondary }}>
        {
          friendList.some(friend => friend.user._id === oneToOneChatList.find(chat => chat._id === selectedChat).user._id && friend.status === 'accepted') ?
            (
              <>
                {/* <TextField size='small' type='text' sx={{
                  width: '100%', borderRadius: '1rem', '& input::placeholder': { color: '#709ce6', opacity: '100%' }, backgroundColor: '#eaf2fe', '& .MuiOutlinedInput-root': { borderRadius: '0.5rem' },
                }} placeholder='write a message...' InputProps={{
                  startAdornment: (
                    <IconButton>
                      <HiMiniPaperClip fontSize={'1.5rem'} style={{ color: '#709ce6' }} />
                    </IconButton>
                  ),
                  endAdornment: (
                    <IconButton>
                      <HiOutlineFaceSmile fontSize={'1.8rem'} style={{ color: '#709ce6' }} />
                    </IconButton>
                  ),
                }} value={message} onChange={handleMessage} onKeyDown={handleSendMessageByEnterKey} /> */}
                <TextField size='small' type='text' sx={{
                  width: '100%', borderRadius: '1rem', '& input::placeholder': { color: '#709ce6', opacity: '100%' }, backgroundColor: '#eaf2fe', '& .MuiOutlinedInput-root': { borderRadius: '0.5rem' },
                }} placeholder='write a message...' value={message} onChange={handleMessage} onKeyDown={handleSendMessageByEnterKey} />
                <IconButton style={{ backgroundColor: Selected.primary, borderRadius: '25%' }} onClick={handleSendMessageBySendButton} > <PiPaperPlane style={{ color: Selected.secondary }} /> </IconButton>
              </>
            ) :
            <Box style={{ height: '100%', width: '100%', display: 'flex', gap: '1rem', padding: '0rem 0.5rem', justifyContent: 'center', alignItems: 'center', borderRadius: '15px' }}>
              <Typography>Can't Send Message To Unfriended User</Typography>
            </Box>
        }
      </Box>
    </Box>
  );
}

export default OneToOneChatWindow;
