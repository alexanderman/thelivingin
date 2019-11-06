import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './admin.scss';
import { actions as usersActions } from './store/redux/usersRedux';
import { actions as requestsActions } from './store/redux/requestsRedux';
import { actions as adminActions } from './store/redux/adminUserRedux';
import FullScreenDialog from './components/dialog-full-screen';

import Button from '@material-ui/core/Button';
import UserList from './components/user-list';
import RequestsList from './components/requests-list';
import RequestCard from './components/request';

const mockRequests = require('./_mocks/mock_requests.json');


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
    const { adminActions, usersActions, requestsActions } = props;
    const { token } = getUrlParams();
    const [isOpen, setIsOpen] = useState(false);

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

                <Button variant="contained" color="primary" onClick={() => setIsOpen(true)}>
                    Select request
                </Button>
    
                <RequestCard request={mockRequests[0]} />

                <FullScreenDialog isOpen={isOpen} handleClose={() => setIsOpen(false)} render={() => <RequestsList />} />
                
                <UserList />
            </div>
        </div>
    ); 
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    usersActions: usersActions(dispatch),
    requestsActions: requestsActions(dispatch),
    adminActions: adminActions(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Admin);

/**
 
request:    q6M3L71tiqrtKHErRQjO Лиза Здравствуйте! Хочу выйти на авталу
user:       6xsJGDzJK5gHRcIRrgpb elizza402@gmail.com
helper:     aWU0Eezm3dmZufmU2wAB Diamandineomi@gmail.com

chat:       18W6swyva8ZJv6CzbVj6 
admin:      As7V1n2F0p9Q5g64NOPB

==== links ====
user:       https://thelivingin-staging.firebaseapp.com/?chatId=18W6swyva8ZJv6CzbVj6&userId=6xsJGDzJK5gHRcIRrgpb&requestId=q6M3L71tiqrtKHErRQjO
helper:     https://thelivingin-staging.firebaseapp.com/?chatId=18W6swyva8ZJv6CzbVj6&userId=aWU0Eezm3dmZufmU2wAB&requestId=q6M3L71tiqrtKHErRQjO
Jenny:      https://thelivingin-staging.firebaseapp.com/?chatId=18W6swyva8ZJv6CzbVj6&userId=As7V1n2F0p9Q5g64NOPB&requestId=q6M3L71tiqrtKHErRQjO      

*/