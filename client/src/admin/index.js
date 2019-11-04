import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import './admin.scss';
import { actions as usersActions } from '../store/admin/redux/usersRedux';
import { actions as requestsActions } from '../store/admin/redux/requestsRedux';

import UserList from './user-list';

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
    const { usersActions, requestsActions } = props;

    useEffect(() => {
        usersActions.fetch();
        // requestsActions.fetch();
    }, [usersActions, requestsActions]);

    return (
        <div className="admin-cont">
            <UserList />
        </div>
    ); 
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    usersActions: usersActions(dispatch),
    requestsActions: requestsActions(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Admin);


/** 
 * TODO: 
 *  - fetch all requests
 *  - fetch all helpers
 */
