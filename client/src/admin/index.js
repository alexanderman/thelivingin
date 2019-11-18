import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './admin.scss';
import { actions as usersActions, selectors as usersSelectors } from './store/redux/usersRedux';
import { actions as requestsActions, selectors as requestsSelectors } from './store/redux/requestsRedux';
import { selectors as connectSelectors, actions as connectActions } from './store/redux/connectChatRedux';
import { selectors as requestChats } from './store/redux/requestChatsRedux';
import { actions as adminActions } from './store/redux/adminUserRedux';
import DialogFullScreen from './components/common/dialog-full-screen';
import MessageDialog from './components/common/dialog-message';

import Button from '@material-ui/core/Button';
import UserList from './components/user-list';
import RequestsList from './components/requests-list';
import RequestCard from './components/request';
import ConnectChatDialog from './components/connect-chat-dialog';
import ChatList from './components/chat-list';


function getUrlParams() {
    return window.location.search.substr(1).split('&').reduce((acc, keyVal) => {
        const key = keyVal.split('=')[0];
        const val = keyVal.split('=')[1];
        if (val) {
            acc[key] = decodeURIComponent(val);
        }
        return acc;
    }, {});
}

const Admin = props => {
    const { adminActions, usersActions, requestsActions, connectSelectors, connectActions, requestChats } = props;
    const { isFetching: showUsersLoading } = requestChats;
    const { token } = getUrlParams();
    const [isRequestsOpen, setIsRequestsOpen] = useState(false);
    const [messageData, setMessage] = useState({ open: false, text: '' });
    const [isAddUser, setIsAddUser] = useState(true);

    useEffect(() => {
        console.log('admin init');
        if (token) {
            adminActions.setToken(token);
            usersActions.fetch();
            requestsActions.fetch();
        }
        else {
            console.error('missing admin token!!!');
        }
        
    }, [usersActions, requestsActions, token]);

    const onClearRequestClick = () => {
        connectActions.setRequest(undefined);
        connectActions.setChat(undefined);
    }

    const onUserSelectClick = user => {
        const { chat, request } = connectSelectors;
        if (!request) {
            return setMessage({ open: true, text: 'Please select request first' });
        }
        if (!chat) {
            return setMessage({ open: true, text: 'Please wait for selected request chats to load' });
        }

        isUserSelected(user) ? setIsAddUser(false): setIsAddUser(true);
        connectActions.setUser(user);
    }

    const isUserSelected = user => {
        return !!connectSelectors.chatMembers[user._id];
    }


    return (
        <div className="admin-cont">
            <div className="admin-chat-manager">

                <Button variant="contained" color="primary" onClick={() => setIsRequestsOpen(true)}>
                    Select request
                </Button>
    
                {connectSelectors.request
                    ?   <RequestCard request={connectSelectors.request} 
                            onClearClick={onClearRequestClick} 
                        />
                    : null
                }
                <ChatList />

                <DialogFullScreen isOpen={isRequestsOpen} title="Requests" handleClose={() => setIsRequestsOpen(false)}>
                    <RequestsList onSelectedSet={() => setIsRequestsOpen(false)} />
                </DialogFullScreen>
                
                <UserList selectable 
                    isUserSelected={isUserSelected}
                    showLoading={showUsersLoading} 
                    disableSelection={showUsersLoading}
                    onSelectClick={onUserSelectClick} 
                    onActionNotifyClick={console.log}
                />
                
                <MessageDialog handleClose={() => setMessage({ open: false })} message={messageData.text} isOpen={messageData.open} />

                {connectSelectors.isAllSet
                    ? <ConnectChatDialog isAddUser={isAddUser} />
                    : null
                }

            </div>

            {/* <SnackError /> */}
        </div>
    ); 
}

const mapStateToProps = state => ({
    requestsSelectors: requestsSelectors(state),
    usersSelectors: usersSelectors(state),
    connectSelectors: connectSelectors(state),
    requestChats: requestChats(state),
});

const mapDispatchToProps = dispatch => ({
    usersActions: usersActions(dispatch),
    requestsActions: requestsActions(dispatch),
    adminActions: adminActions(dispatch),
    connectActions: connectActions(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Admin);

/** 
 * TODO: 
 *  - show selected users
 *  - handle disconnect user from chat
 */