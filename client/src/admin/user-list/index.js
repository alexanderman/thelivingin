import React from 'react';
import MyTable from '../components/table';
import { connect } from 'react-redux';
import { selectors as usersSelectors } from '../../store/admin/redux/usersRedux';
import CircularProgress from '@material-ui/core/CircularProgress';
import './user-list.scss';
import moment from 'moment';

const columns = [{
        id: 'name',
        label: 'Name',
        minWidth: 140,
        align: 'left',
        format: value => value,
    },{
        id: 'email',
        label: 'Email',
        minWidth: 170,
        align: 'left',
        format: value => value,
    },{
        id: 'phone',
        label: 'Phone',
        minWidth: 100,
        align: 'left',
        format: value => value,
    },{
        id: 'createdAt',
        label: 'CreatedAt',
        minWidth: 100,
        align: 'left',
        format: value => moment(value).format('DD/MM/YYYY HH:mm'),
    },{
        id: 'canHelp',
        label: 'CanHelp',
        minWidth: 60,
        align: 'left',
        format: value => (!!value).toString(),
    },{
        id: 'help_area',
        label: 'Help Area',
        minWidth: 250,
        align: 'left',
        format: value => value,
}];


const mock_users = require('../mock_users');
const rows = mock_users;

function UserList(props) {
    const { users, isFetching } = props;
    return (
        <div className="user-list-cont">
            <MyTable columns={columns} rows={users} />
            {isFetching
                ? <CircularProgress className="loader" />
                : null
            }
            
        </div>
    );
}

const mapStateToProps = state => usersSelectors(state);

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(UserList);


