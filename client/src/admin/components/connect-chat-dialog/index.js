import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Dialog from '../common/dialog';
import { Button, Typography, Switch, FormControlLabel } from '@material-ui/core';
import './connect-chat-dialog.scss';

import { actions as usersActions, selectors as usersSelectors } from '../../store/redux/usersRedux';
import { actions as chatActions, selectors as chatSelectors } from '../../store/redux/selectedChatRedux';
import { actions as connectActions, selectors as connectSelectors } from '../../store/redux/connectChatRedux';
import { selectors as requestsSelectors } from '../../store/redux/requestsRedux';


const ConnectChatDialog = props => {
    const { 
        usersSelectors, chatSelectors, connectSelectors,
        usersActions, chatActions, connectActions, requestsSelectors,
    } = props;
    
    const { selected: selectedRequest } = requestsSelectors;
    const { chat: selectedChat } = chatSelectors;
    const isOpen = !!(connectSelectors.user && chatSelectors.chat);
    // const isOpen = true;

    const handleClose = () => {
        connectActions.setUser(undefined);
    }

    const renderTitle = () => (
        <span>Add <b>{(connectSelectors.user || {}).name}</b> to request</span>
    );

    const renderRequestInfo = () => {
        const requestText = (selectedRequest.textarea || '').substr(0, 200) + '...';
        return (
            <Fragment>
                <Typography variant="body2" color="textSecondary">{requestText}</Typography>
                <div style={{ marginTop: '1em' }} className="connect-chat-dialog-controls">
                    <FormControlLabel control={
                        <Switch color="secondary"></Switch>
                    } label="Send Email Notification"></FormControlLabel>
                    <FormControlLabel control={
                        <Switch color="secondary"></Switch>
                    } label="Show Application Notification"></FormControlLabel>
                </div>
            </Fragment>
        );
    }
        
    const renderActions = () => (
        <Fragment>
            <Button variant="text" onClick={handleClose}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleClose}>Add</Button>
        </Fragment>
    );


    return (
        <Dialog isOpen={isOpen} 
            title={renderTitle}
            handleClose={handleClose} 
            renderActions={renderActions} 
        >
            {renderRequestInfo()}
        </Dialog>
    );
}

const mapStateToProps = state => ({
    usersSelectors: usersSelectors(state),
    chatSelectors: chatSelectors(state),
    connectSelectors: connectSelectors(state),
    requestsSelectors: requestsSelectors(state),
});

const mapDispatchToProps = dispatch => ({
    usersActions: usersActions(dispatch),
    chatActions: chatActions(dispatch),
    connectActions: connectActions(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectChatDialog);
