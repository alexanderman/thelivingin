import React, { Fragment, useEffect } from 'react';
import MyTable from '../table';
import { connect } from 'react-redux';
import { selectors as usersSelectors, actions as userActions } from '../../store/redux/usersRedux';
import Timestamp from '../common/timestamp';
import './user-list.scss';

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
        format: val => <Timestamp timestamp={val} />,
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


function UserList(props) {
    const { users, isFetching, setSelected, selected } = props;

    useEffect(() => {
        /** rerender only when these props change */
    }, [users, isFetching, selected]);

    return (
        <MyTable selectable selected={selected} onSelectedChange={setSelected} className="user-list" columns={columns} rows={users} showLoading={isFetching} />
    );
}

const mapStateToProps = state => usersSelectors(state);

const mapDispatchToProps = userActions;

export default connect(mapStateToProps, mapDispatchToProps)(UserList);


