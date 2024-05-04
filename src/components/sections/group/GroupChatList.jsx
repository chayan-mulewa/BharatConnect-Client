import { useEffect, useState, useRef } from 'react';
import { Box, Typography, Input, Paper, Stack, Avatar, IconButton, Divider, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { HiPlus, HiOutlineXMark } from 'react-icons/hi2';
import { Window, Selected, Font } from '../../../themes/index';
import { useDataContext } from '../../../contexts';
import { GroupChatDisplay, CreateGroupChatDisplay } from '../../index';

function GroupChatList() {

  const [searchQuery, setSearchQuery] = useState('');
  const [showNewGroupChat, setShowNewGroupChat] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);

  const [groupname, setGroupname] = useState('');
  const [isGroupnameError, setIsGroupnameError] = useState(false);
  const [groupnameError, setGroupnameError] = useState('');

  const handleGroupname = (event) => {
    setGroupname(event.target.value);
    setGroupnameError('');
    setIsGroupnameError(false);
  };

  const { myDetails, oneToOneChatList, groupChatList, friendList, server } = useDataContext();

  const filteredGroupChats = groupChatList.filter(groupChat => {
    const groupName = groupChat.groupName.toLowerCase();
    return groupName.startsWith(searchQuery.toLowerCase());
  });

  const handleNewGroupChatClick = () => {
    setShowNewGroupChat(true);
  }

  const handleNewGroupChatClickClose = () => {
    setShowNewGroupChat(false);
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCreateGroupChat = async () => {
    if (groupname == '') {
      setGroupnameError('Group Name Required');
      setIsGroupnameError(true);
      return
    } else if (groupMembers.length < 3) {
      setGroupnameError('Minimum 3 Group Member Required');
      setIsGroupnameError(true);
      return;
    }

    const members = groupMembers.map(member => member._id);
    members.push(myDetails._id);

    await server.emit('createGroupChat', { groupName: groupname, profilePhoto: encodedProfilePhoto, createdBy: myDetails._id, members: members, date: new Date().toISOString() });
    setGroupname('')
    setDisplayProfilePhoto('');
    setEncodedProfilePhoto('');
    setGroupMembers([]);
  }
  const handleRemoveGroupMember = (userId) => {
    setGroupMembers(prevOnlineUsers => {
      return prevOnlineUsers.filter(user => user._id !== userId);
    });
  }

  const fileInputRef = useRef(null);
  const [displayProfilePhoto, setDisplayProfilePhoto] = useState('');
  const [encodedProfilePhoto, setEncodedProfilePhoto] = useState('');

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


  return (
    <Paper sx={{ height: '100%', minWidth: '22rem', width: '22rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem', justifyContent: '', alignItems: 'center', backgroundColor: Window.secondary }} >
      <Stack sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='h1' fontSize={'2rem'} fontWeight={'bold'}> Groups </Typography>
        <IconButton onClick={handleNewGroupChatClick} fontSize={'2rem'}> <HiPlus /> </IconButton>
      </Stack>

      <Stack>
        <Dialog open={showNewGroupChat} onClose={handleNewGroupChatClickClose}>
          <DialogTitle> <Typography>Create New Group</Typography> </DialogTitle>
          <DialogContent sx={{ overflow: 'hidden' }}>
            <Stack spacing={1}>

              <Stack direction={'column'} justifyContent={'center'} alignItems={'center'} >
                <Box>
                  <IconButton onClick={handleProfilePhoto}>
                    <Avatar alt="Profile Photo" src={displayProfilePhoto} sx={{ height: '5rem', width: '5rem' }} />
                    <Input inputRef={fileInputRef} type="file" inputProps={{ accept: '.jpg' }} style={{ display: 'none' }} onChange={handleFileInputChange} />
                  </IconButton>
                </Box>
              </Stack>

              <TextField size='small' type='text' required value={groupname} placeholder='Group Name' error={isGroupnameError} helperText={groupnameError} onChange={handleGroupname}></TextField>
              <Stack sx={{ maxHeight: '240px', width: '100%', display: 'flex', gap: '1rem', overflow: 'auto', scrollbarWidth: 'none' }}>
                {
                  groupMembers == '' ?
                    <Box style={{ height: '5rem', width: '20rem', display: 'flex', gap: '1rem', padding: '0rem 0.5rem', justifyContent: 'center', alignItems: 'center', borderRadius: '15px' }}>
                      <Typography>Add Minimum 3 Group Member</Typography>
                    </Box> :
                    <>
                      {groupMembers.map((member, index) => (
                        <Box key={index} style={{ height: '5rem', width: '20rem', display: 'flex', gap: '1rem', padding: '0rem 0.5rem', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Window.primary, borderRadius: '15px' }}>
                          <Stack direction={'row'} spacing={1} >
                            <IconButton><Avatar src={member.profile_photo} sx={{ height: '3.5rem', width: '3.5rem' }}></Avatar></IconButton>
                            <Stack spacing={0.8} justifyContent={'center'} alignItems={'start'}>
                              <Typography color={Font.primary} fontWeight={'bold'} >{member.full_name}</Typography>
                              <Typography>{member.username}</Typography>
                            </Stack>
                          </Stack>
                          <Stack spacing={0.8} alignItems={'end'}>
                            <IconButton onClick={() => { handleRemoveGroupMember(member._id) }}><HiOutlineXMark /></IconButton>
                          </Stack>
                        </Box>
                      ))}
                    </>
                }
              </Stack>

              <Typography>All Friends</Typography>

              <Stack sx={{ maxHeight: '240px', width: '100%', display: 'flex', gap: '1rem', overflow: 'auto', scrollbarWidth: 'none' }}>
                {
                  friendList.filter(friend => friend.status === 'accepted' && !oneToOneChatList.some(chat => chat.user_id_1 === friend.user._id || chat.user_id_2 === friend.user._id)).length === 0 ?
                    (
                      <Box style={{ height: '5rem', width: '20rem', display: 'flex', gap: '1rem', padding: '0rem 0.5rem', justifyContent: 'center', alignItems: 'center', borderRadius: '15px' }}>
                        <Typography>No friends to start a group chat with</Typography>
                      </Box>
                    ) :
                    (
                      friendList.filter(friend => friend.status === 'accepted' && !oneToOneChatList.some(chat => chat.user_id_1 === friend.user._id || chat.user_id_2 === friend.user._id)).map((friend, index) =>
                      (
                        <CreateGroupChatDisplay setGroupnameError={setGroupnameError} setIsGroupnameError={setIsGroupnameError} key={index} setGroupMembers={setGroupMembers} friendId={friend._id} userId={friend.user._id} fullName={friend.user.full_name} username={friend.user.username} profilePhoto={friend.user.profile_photo} />
                      ))
                    )
                }
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setShowNewGroupChat(false) }} color="error">
              Cancel
            </Button>
            <Button onClick={handleCreateGroupChat} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>

      <Stack sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'start' }}>
        <TextField size='small' type='text' sx={{
          width: '100%', borderRadius: '1rem', '& input::placeholder': { color: '#709ce6', opacity: '100%' }, backgroundColor: '#eaf2fe', '& .MuiOutlinedInput-root': { borderRadius: '1rem' },
        }} placeholder='Search Group By Name' value={searchQuery} onChange={handleSearchChange} />
      </Stack>
      <Stack sx={{ width: '100%', display: 'flex', gap: '1rem', overflow: 'auto', scrollbarWidth: 'none' }}>
        {
          filteredGroupChats.map((data, index) => (
            <GroupChatDisplay key={index} groupChatId={data._id} groupName={data.groupName} messageCount={data.messageCount} lastMessage={data.messages[data.messages.length - 1].message} lastMessageTime={data.messages[data.messages.length - 1].messageTime} profilePhoto={data.profile_photo} />
          ))
        }
        {
          filteredGroupChats.length === 0 &&
          (
            <Box style={{ height: '5rem', width: '20rem', display: 'flex', gap: '1rem', padding: '0rem 0.5rem', justifyContent: 'center', alignItems: 'center', borderRadius: '15px' }}>
              <Typography>No Group Chats</Typography>
            </Box>
          )
        }
      </Stack>
    </Paper>
  );
}

export default GroupChatList;
