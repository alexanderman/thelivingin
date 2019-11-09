import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './admin.scss';
import { actions as usersActions, selectors as usersSelectors } from './store/redux/usersRedux';
import { actions as requestsActions, selectors as requestsSelectors } from './store/redux/requestsRedux';
import { selectors as connectSelectors } from './store/redux/connectChatRedux';
import { actions as adminActions } from './store/redux/adminUserRedux';
import DialogFullScreen from './components/common/dialog-full-screen';

import Button from '@material-ui/core/Button';
import UserList from './components/user-list';
import RequestsList from './components/requests-list';
import RequestCard from './components/request';

import ConnectChatDialog from './components/connect-chat-dialog';


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
    const { adminActions, usersActions, requestsActions, requestsSelectors, connectSelectors } = props;
    const { token } = getUrlParams();
    const [isRequestsOpen, setIsRequestsOpen] = useState(false);

    useEffect(() => {
        console.log('admin init');
        if (token) {
            adminActions.setToken(token);
            // usersActions.fetch();
            // requestsActions.fetch();
        }
        else {
            console.error('missing admin token!!!');
        }
        
    }, [usersActions, requestsActions, token]);


    return (
        <div className="admin-cont">
            <div className="admin-chat-manager">

                <Button variant="contained" color="primary" onClick={() => setIsRequestsOpen(true)}>
                    Select request
                </Button>
    
                {requestsSelectors.selected
                    ?   <RequestCard request={requestsSelectors.selected} 
                            onClearClick={() => requestsActions.setSelected(undefined)} 
                        />
                    : null
                }

                <DialogFullScreen isOpen={isRequestsOpen} title="Requests" handleClose={() => setIsRequestsOpen(false)}>
                    <RequestsList onSelectedSet={() => setIsRequestsOpen(false)} />
                </DialogFullScreen>
                
                <UserList />

                {connectSelectors.isAllSet
                    ? <ConnectChatDialog />
                    : null
                }
                

            </div>
        </div>
    ); 
}

const mapStateToProps = state => ({
    requestsSelectors: requestsSelectors(state),
    usersSelectors: usersSelectors(state),
    connectSelectors: connectSelectors(state),
});

const mapDispatchToProps = dispatch => ({
    usersActions: usersActions(dispatch),
    requestsActions: requestsActions(dispatch),
    adminActions: adminActions(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
