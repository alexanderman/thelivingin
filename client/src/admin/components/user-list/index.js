import React, { Fragment, useState } from 'react';
import Table from '../table';
import { connect } from 'react-redux';
import { selectors as usersSelectors, actions as userActions } from '../../store/redux/usersRedux';
import { selectors as chatSelectors } from '../../store/redux/selectedChatRedux';
import { selectors as connectSelectors, actions as connectActions } from '../../store/redux/connectChatRedux';
import Timestamp from '../common/timestamp';
import MessageDialog from '../common/dialog-message';
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

const areUsersEqual = (u1, u2) => u1._id === u2._id;

function UserList(props) {
    const [isOpen, setIsOpen] = useState(false);

    const { usersSelectors, chatSelectors, connectSelectors, connectActions 
    } = props;

    const { isFetching: fetchingChat, chat } = chatSelectors;
    const { setUser } = connectActions;
    const { users, isFetching: fetchingUsers, selected } = usersSelectors;

    const onSelectClick = user => {
        /** open connect user to chat popup, when there is selected chat  */
        if (chat) {
            setUser(user);
        }
        else {
            setIsOpen(true);
        }
    }

    const closeMessage = () => {
        setIsOpen(false);
    }

    return (
        <Fragment>
            <Table className="user-list" columns={columns} rows={users} showLoading={fetchingUsers || fetchingChat} 
                selectable selected={selected} onSelectClick={onSelectClick}
                isEqual={areUsersEqual}
            />
            <MessageDialog handleClose={closeMessage} message="plesae select request or wait for chat data to load" isOpen={isOpen} />
        </Fragment>
    );
}

const mapStateToProps = state => ({
    usersSelectors: usersSelectors(state),
    chatSelectors: chatSelectors(state),
    connectSelectors: connectSelectors(state),
});

const mapDispatchToProps = dispatch => ({
    userActions: userActions(dispatch),
    connectActions: connectActions(dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserList);


