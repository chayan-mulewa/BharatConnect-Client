import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { OneToOneChatDisplay } from '../components/index';
import { IsValidToken } from '../utils/index'
import io from 'socket.io-client';
import { Server } from '../config/index';

const DataContext = createContext();

export const useDataContext = () => useContext(DataContext);

export const DataProvider = ({ children }) => {

    const [selectedSection, setSelectedSection] = useState(1);
    const [selectedSectionWindow, setSelectedSectionWindow] = useState(null);
    const [selectedSubSectionWindow, setSubSelectedSectionWindow] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);
    const [selectedGroupChat, setSelectedGroupChat] = useState(null);
    const [selectedUserProfile, setSelectedUserProfile] = useState(null);

    const [oneToOneChatList, setOneToOneChatList] = useState([]);
    const [oneToOneMessages, setOneToOneMessages] = useState([]);
    const [groupChatList, setGroupChatList] = useState([]);
    const [myDetails, setMyDetails] = useState([]);
    const [userDetails, setUserDetails] = useState([]);
    const [friendList, setFriendList] = useState([]);
    const [server, setServer] = useState();
    const [searchList, setSearchList] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (document.cookie.includes('token')) {
                    const isValidTokenResult = await IsValidToken();
                    if (isValidTokenResult) {
                        const token = await document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
                        const socket = io(Server.webSocketURL, {
                            extraHeaders: {
                                "token": token
                            },
                            withCredentials: true,
                        });

                        setServer(socket);

                        socket.on('connect', () => {
                            console.log('Client connected With Id : ' + socket.id);
                        });
                        socket.on('myDetails', (user) => {
                            setMyDetails(user);
                        })
                        socket.on('userDetails', (user) => {
                            setUserDetails(user);
                        })
                        socket.on('friendList', (friendList) => {
                            setFriendList(friendList);
                        })
                        socket.on('getSearchedUsers', (searchedUsers) => {
                            setSearchList(searchedUsers);
                        });
                        socket.on('oneToOneChatList', (oneToOneChatList) => {
                            setOneToOneChatList(oneToOneChatList);
                        });
                        socket.on('oneToOneMessages', (oneToOneMessages) => {
                            setOneToOneMessages(oneToOneMessages);
                        });

                        socket.on('groupChatList', (groupChatList) => {
                            setGroupChatList(groupChatList);
                        });

                        socket.on('onlineUser', (onlineUser) => {
                            setOnlineUsers(prevOnlineUsers => {
                                if (prevOnlineUsers.length === 0) {
                                    return [onlineUser];
                                } else {
                                    if (!prevOnlineUsers.includes(onlineUser)) {
                                        return [...prevOnlineUsers, onlineUser];
                                    } else {
                                        return prevOnlineUsers;
                                    }
                                }
                            });
                        });

                        socket.on('offlineUser', (offlineUser) => {
                            setOnlineUsers(prevOnlineUsers => prevOnlineUsers.filter(user => user !== offlineUser));
                        });

                        window.addEventListener('beforeunload', () => {
                            socket.disconnect();
                        });
                    }
                }
            } catch (error) {

            }
        };
        fetchData();
    }, []);

    // useEffect(() => {
    //     console.log(onlineUsers);
    // }, [onlineUsers]);

    return (
        <DataContext.Provider value={{ selectedSection, setSelectedSection, selectedSectionWindow, setSelectedSectionWindow, selectedSubSectionWindow, setSubSelectedSectionWindow, selectedUserProfile, setSelectedUserProfile, selectedChat, setSelectedChat, selectedGroupChat, setSelectedGroupChat, oneToOneChatList, oneToOneMessages, setOneToOneMessages, groupChatList, friendList, setFriendList, myDetails, setMyDetails, searchList, setSearchList, onlineUsers, userDetails, server }}>
            {children}
        </DataContext.Provider>
    );
};
