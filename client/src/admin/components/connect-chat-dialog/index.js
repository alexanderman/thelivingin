import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Dialog from '../common/dialog';
import { Button, Typography, Switch, FormControlLabel } from '@material-ui/core';
import './connect-chat-dialog.scss';
import { actions as connectActions, selectors as connectSelectors } from '../../store/redux/connectChatRedux';


const ConnectChatDialog = props => {
    const { 
        user, chat, request, setUser, isAllSet, notification, setNotifications, 
        inProcess, sendConnect, /** redux actions */
        /** parent component props */
        isAddUser,
    } = props;

    const buttonText = isAddUser ? 'Add' : 'Remove';
    
    const isOpen = isAllSet;

    const handleClose = () => {
        setUser(undefined);
    }

    const handleAdd = () => {
        sendConnect();
    }

    const renderTitle = () => {
        if (!isAddUser) {
            return (
                <span>Remove <b>{user.name}</b> from request</span>
            );
        }
        return (
            <span>Add <b>{user.name}</b> to request</span>
        );
    }

    const toggleNotification = key => event => {
        setNotifications({ ...notification, [key]: event.target.checked });
    }

    const renderRequestInfo = () => {
        const requestText = (request.textarea || '').substr(0, 200) + '...';
        return (
            <Fragment>
                <Typography variant="body2" color="textSecondary">{requestText}</Typography>
                <div style={{ marginTop: '1em' }} className="connect-chat-dialog-controls">
                    <FormControlLabel control={
                        <Switch checked={notification.email} onChange={toggleNotification('email')} color="secondary"></Switch>
                    } label="Send Email Notification"></FormControlLabel>
                    <FormControlLabel control={
                        <Switch checked={notification.application} onChange={toggleNotification('application')} color="secondary"></Switch>
                    } label="Show Application Notification"></FormControlLabel>
                </div>
            </Fragment>
        );
    }
        
    const renderActions = () => (
        <Fragment>
            <Button variant="text" onClick={handleClose}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleAdd}>{buttonText}</Button>
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

const mapStateToProps = connectSelectors;
const mapDispatchToProps = connectActions;

export default connect(mapStateToProps, mapDispatchToProps)(ConnectChatDialog);
