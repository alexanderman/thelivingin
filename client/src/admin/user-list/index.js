import React, { Fragment } from 'react';
import MyTable from '../components/table';
import { connect } from 'react-redux';
import { selectors as usersSelectors } from '../../store/admin/redux/usersRedux';
import moment from 'moment';
import './user-list.scss';

const timestampFormat = timestamp => {
    const date = moment(timestamp).format('DD/MM/YYYY HH:mm').split(' ');    
    return <Fragment>{date[0]}&nbsp;<span>{date[1]}</span></Fragment>
}

const helpAreaFormat = value => <span className="help-area">{value}</span>;

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
        minWidth: 120,
        align: 'left',
        format: value => value,
    },{
        id: 'createdAt',
        label: 'Created At',
        minWidth: 100,
        align: 'left',
        format: timestampFormat,
    },{
        id: 'canHelp',
        label: 'Can Help',
        minWidth: 60,
        align: 'left',
        format: value => (!!value).toString(),
    },{
        id: 'help_area',
        label: 'Help Area',
        minWidth: 250,
        align: 'left',
        format: helpAreaFormat,
}];


const mock_users = require('../mock_users');
const rows = mock_users;

function UserList(props) {
    const { users, isFetching } = props;
    return (
        <MyTable className="user-list" columns={columns} rows={users} showLoading={isFetching} />
    );
}

const mapStateToProps = state => usersSelectors(state);

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(UserList);


