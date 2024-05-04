import { useState } from 'react';
import { Box, Typography, Paper, Stack, Avatar, IconButton, Divider, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { HiOutlineBell } from 'react-icons/hi2';
import { Window, Selected, Font } from '../../../themes/index';
import { useDataContext } from '../../../contexts';
import { FriendDisplay, FriendRequestDisplay } from '../../index';

function FriendList() {

  const [searchQuery, setSearchQuery] = useState('');
  const [showFriendRequests, setShowFriendRequests] = useState(false);

  const { myDetails, friendList } = useDataContext();

  const filteredFriends = friendList.filter(chat => {
    if (chat.status != 'accepted') {
      return;
    }
    const username = chat.user.username.toLowerCase();
    return username.startsWith(searchQuery.toLowerCase());
  });

  const handleFriendRequestsOpen = () => {
    setShowFriendRequests(true)
  }

  const handleFriendRequestsClose = () => {
    setShowFriendRequests(false);
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Paper sx={{ height: '100%', minWidth: '22rem', width: '22rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem', justifyContent: '', alignItems: 'center', backgroundColor: Window.secondary }} >
      <Stack sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='h1' fontSize={'2rem'} fontWeight={'bold'}> Friends </Typography>
        <IconButton onClick={handleFriendRequestsOpen}> <HiOutlineBell /> </IconButton>
      </Stack>

      <Stack>
        <Dialog open={showFriendRequests} onClose={handleFriendRequestsClose}>
          <DialogTitle> <Typography>Friend Requests</Typography> </DialogTitle>
          <DialogContent>
            <Stack sx={{ width: '100%', display: 'flex', gap: '1rem', overflow: 'auto', scrollbarWidth: 'none' }}>
              {
                friendList.map((data, index) => {
                  if (data.sender != myDetails._id && data.status == 'pending') {
                    return (<FriendRequestDisplay key={index} friendId={data._id} userId={data.user._id} fullName={data.user.full_name} username={data.user.username} profilePhoto={data.user.profile_photo} status={data.status} />)
                  }
                })
              }
              {
                friendList.filter(data => data.sender !== myDetails._id && data.status === 'pending').length === 0 && (
                  <Box style={{ height: '5rem', width: '20rem', display: 'flex', gap: '1rem', padding: '0rem 0.5rem', justifyContent: 'center', alignItems: 'center', borderRadius: '15px' }}>
                    <Typography>No Pending Friend Requests</Typography>
                  </Box>
                )
              }
            </Stack>
          </DialogContent>
        </Dialog>
      </Stack>

      <Stack sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'start' }}>
        <TextField size='small' type='text' sx={{
          width: '100%', borderRadius: '1rem', '& input::placeholder': { color: '#709ce6', opacity: '100%' }, backgroundColor: '#eaf2fe', '& .MuiOutlinedInput-root': { borderRadius: '1rem' },
        }} placeholder='Search Friend By Username' value={searchQuery} onChange={handleSearchChange} />
      </Stack>

      <Stack sx={{ width: '100%', display: 'flex', gap: '1rem', overflow: 'auto', scrollbarWidth: 'none' }}>
        {
          filteredFriends.map((data, index) => (
            <FriendDisplay key={index} index={index} friendId={data._id} userId={data.user_id_1 !== myDetails._id ? data.user_id_1 : data.user_id_2} fullName={data.user.full_name} username={data.user.username} profilePhoto={data.user.profile_photo} />
          ))
        }
        {
          filteredFriends.filter(data => data.status === 'accepted').length === 0 && (
            <Box style={{ height: '5rem', width: '20rem', display: 'flex', gap: '1rem', padding: '0rem 0.5rem', justifyContent: 'center', alignItems: 'center', borderRadius: '15px' }}>
              <Typography>No Friend</Typography>
            </Box>
          )
        }
      </Stack>
    </Paper>
  )
}

export default FriendList;
