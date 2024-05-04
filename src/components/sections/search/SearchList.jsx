import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Stack, Avatar, IconButton, Divider, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Window, Selected } from '../../../themes/index';
import { useDataContext } from '../../../contexts';
import { SearchDisplay } from '../../index';

function SearchList() {

  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const { myDetails, searchList, setSearchList, friendList, server } = useDataContext();

  const handleNewChatClick = () => {
    setShowNewChat(true);
  }

  const handleNewChatClickClose = () => {
    setShowNewChat(false);
  }

  const handleSearchChange = async (event) => {
    setSearchQuery(event.target.value);
    setSearchList([]);
  };

  const handleClick = async (event) => {
    if (event.key === 'Enter') {
      if (searchQuery == '') {
        setSearchList([]);
        return;
      }
      await server.emit('searchUsers', searchQuery);
    }
  }

  useEffect(() => {
    return () => { setSearchList([]); }
  }, [])
  return (
    <Paper sx={{ height: '100%', minWidth: '22rem', width: '22rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem', justifyContent: '', alignItems: 'center', backgroundColor: Window.secondary }} >
      <Stack sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='h1' fontSize={'2rem'} fontWeight={'bold'}> Search </Typography>
      </Stack>

      <Stack>
        <Dialog open={false}>
          <DialogTitle> <Typography>Create New Group</Typography> </DialogTitle>
          <DialogContent sx={{ overflow: 'hidden' }}>
          </DialogContent>
        </Dialog>
      </Stack>

      <Stack sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'start' }}>
        <TextField size='small' type='text' sx={{
          width: '100%', borderRadius: '1rem', '& input::placeholder': { color: '#709ce6', opacity: '100%' }, backgroundColor: '#eaf2fe', '& .MuiOutlinedInput-root': { borderRadius: '1rem' },
        }} placeholder='Search User By Username' value={searchQuery} onChange={handleSearchChange} onKeyDown={handleClick} />
      </Stack>

      <Stack sx={{ width: '100%', display: 'flex', gap: '1rem', overflow: 'auto', scrollbarWidth: 'none' }}>
        {searchList.length === 0 && searchQuery && (
          <Box style={{ height: '5rem', width: '20rem', display: 'flex', gap: '1rem', padding: '0rem 0.5rem', justifyContent: 'center', alignItems: 'center', borderRadius: '15px' }}>
            <Typography>No User Found</Typography>
          </Box>
        )}
        {searchQuery === '' && (
          <Box style={{ height: '5rem', width: '20rem', display: 'flex', gap: '1rem', padding: '0rem 0.5rem', justifyContent: 'center', alignItems: 'center', borderRadius: '15px' }}>
            <Typography>Search For User</Typography>
          </Box>
        )}
        {
          searchList.map((data, index) => {
            const friend = friendList.find(friendData => friendData.user_id_1 === data._id || friendData.user_id_2 === data._id);

            if (data.username.includes(myDetails.username)) {
              return (<SearchDisplay key={index} index={index} userId={data._id} fullName={data.full_name} username={data.username} profilePhoto={data.profile_photo} isFriend={true} isSender={false} isCancel={false} />);
            } else {
              if (friend && friend.status === 'accepted') {
                return (<SearchDisplay key={index} index={index} userId={data._id} fullName={data.full_name} username={data.username} profilePhoto={data.profile_photo} isFriend={true} isSender={false} isCancel={false} friendId={friend._id} status={friend.status} searchQuery={searchQuery} />);
              } else {
                if (friend && friend.status === 'pending' && friend.sender == myDetails._id) {
                  return (<SearchDisplay key={index} index={index} userId={data._id} fullName={data.full_name} username={data.username} profilePhoto={data.profile_photo} isFriend={true} isSender={true} isCancel={false} friendId={friend._id} status={friend.status} searchQuery={searchQuery} />);
                }
                else {
                  if (friend && friend.status === 'pending' && friend.sender != myDetails._id) {
                    return (<SearchDisplay key={index} index={index} userId={data._id} fullName={data.full_name} username={data.username} profilePhoto={data.profile_photo} isFriend={true} isSender={false} isCancel={true} friendId={friend._id} status={friend.status} searchQuery={searchQuery} />);
                  }
                  else {
                    return (<SearchDisplay key={index} index={index} userId={data._id} fullName={data.full_name} username={data.username} profilePhoto={data.profile_photo} isFriend={false} isSender={false} isCancel={false} friendId={null} status={null} searchQuery={searchQuery} />);
                  }
                }
              }
            }
          })
        }
      </Stack>
    </Paper>
  )
}

export default SearchList;
