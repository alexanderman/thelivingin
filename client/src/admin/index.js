import React from 'react';
import { connect } from 'react-redux';
import './admin.scss';

import UserList from './user-list';

const Admin = props => {
    return (
        <div className="admin-cont">
            <UserList />
        </div>
    ); 
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Admin);


/** 
 * TODO: 
 *  - fetch all requests
 *  - fetch all helpers
 */
