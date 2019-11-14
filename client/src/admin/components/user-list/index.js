import React, { Fragment, useState } from 'react';
import Table from '../table';
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
        minWidth: 140,
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
        label: 'Helper',
        minWidth: 30,
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
    const { users, isFetching, /** actions from usersredux */
        showLoading, onSelectClick, selectable, isUserSelected, /** from parent component */
        disableSelection
    } = props;

    return (
        <Fragment>
            <Table className="user-list" columns={columns} rows={users} showLoading={isFetching || showLoading} 
                selectable={selectable} onSelectClick={onSelectClick}
                isUserSelected={isUserSelected}
                disableSelection={disableSelection}
            />
        </Fragment>
    );
}

const mapStateToProps = usersSelectors;
const mapDispatchToProps = userActions;

export default connect(mapStateToProps, mapDispatchToProps)(UserList);


