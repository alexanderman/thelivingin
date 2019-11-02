import React from 'react';
import MyTable from '../table';
import './user-list.scss';
import moment from 'moment';

const columns = [{
        id: 'name',
        label: 'Name',
        minWidth: 170,
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
        minWidth: 170,
        align: 'left',
        format: value => value,
    },{
        id: 'createdAt',
        label: 'CreatedAt',
        minWidth: 170,
        align: 'left',
        format: value => value,
    },{
        id: 'canHelp',
        label: 'CanHelp',
        minWidth: 170,
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


export default function UserList() {
    return <MyTable columns={columns}  rows={rows} />;
}
