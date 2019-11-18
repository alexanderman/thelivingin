import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import Dialog from '../common/dialog';
import { Button, Typography, Switch, FormControlLabel } from '@material-ui/core';
import './connect-chat-dialog.scss';
import { actions as connectActions, selectors as connectSelectors } from '../../store/redux/connectChatRedux';
import { actions as notificationsActions, selectors as notificationsSelectors } from '../../store/redux/chatNotificationsRedux';

function isAdmin(user) {
    return (user.roles && user.roles.indexOf('admin') > -1);
}

const ConnectChatDialog = props => {
    const { 
        connectSelectors, connectActions, 
        notificationsSelectors, notificationsActions,
        /** parent component props */
        isAddUser,
    } = props;
    
    const buttonText = isAddUser ? 'Add' : 'Remove';
    console.log('notificationsSelectors', notificationsSelectors)
    console.log('connectSelectors', connectSelectors)

    useEffect(() => {
        if (isAdmin(connectSelectors.user)) {
            notificationsActions.setNotificationsOFF();
        }
        else {
            isAddUser ? notificationsActions.setNotificationsON() : notificationsActions.setNotificationsOFF();
        }
    }, [connectSelectors.user, connectSelectors.chat]);
    
    const isOpen = connectSelectors.isAllSet;

    const handleClose = (ev, reason) => {
        if (!connectSelectors.inProcess)
            connectActions.setUser(undefined);
    }

    const handleAction = () => {
        if (!connectSelectors.inProcess) {
            if (isAddUser) {
                connectActions.sendConnect();
                notificationsActions.sendNotification();
            }
            else    
                connectActions.sendDisconnect();
        }
    }

    const renderTitle = () => {
        if (!isAddUser) {
            return (
                <span>Removing <b>{connectSelectors.user.name}</b> from request</span>
            );
        }
        return (
            <span>Adding <b>{connectSelectors.user.name}</b> to request</span>
        );
    }

    const _toggleNotification = key => event => {
        notificationsActions.toggleNotification(key, event.target.checked);
    }

    const renderRequestInfo = () => {
        const requestText = (connectSelectors.request.textarea || '').substr(0, 200) + '...';
        return (
            <Fragment>
                <Typography variant="body2" color="textSecondary">{requestText}</Typography>
                <div style={{ marginTop: '1em' }} className="connect-chat-dialog-controls">
                    <FormControlLabel control={
                        <Switch disabled={connectSelectors.inProcess} 
                        checked={!!notificationsSelectors.email} 
                        onChange={_toggleNotification('email')} color="secondary"
                        ></Switch>
                    } label="Send Email Notification"></FormControlLabel>
                    <FormControlLabel control={
                        <Switch disabled={connectSelectors.inProcess} 
                        checked={!!notificationsSelectors.sms} 
                        onChange={_toggleNotification('sms')} color="secondary"
                        ></Switch>
                    } label="Send Sms Notification"></FormControlLabel>
                </div>
                {renderError()}
            </Fragment>
        );
    }

    const renderError = () => {
        const error = connectSelectors.error;
        if (!error) return null;        
        return (
            <Fragment>
            <div className="connect-chat-dialog_error">
                <ul>
                    {Object.keys(error).filter(k => k !== '_err').map(key => <li key={key}>{key}: {error[key]}</li>)}
                    <ul>
                        {Object.keys(error._err).map(key => <li key={key}>{key}: {error._err[key]}</li>)}
                    </ul>
                </ul>
            </div>
            </Fragment>
        );
    }
        
    const renderActions = () => (
        <Fragment>
            <Button disabled={connectSelectors.inProcess} variant="text" onClick={handleClose}>Cancel</Button>
            <Button disabled={connectSelectors.inProcess} variant="contained" style={{ width: '12em' }} color="primary" onClick={handleAction}>{buttonText}</Button>
        </Fragment>
    );


    return (
        <Dialog isOpen={isOpen} 
            showProgress={connectSelectors.inProcess}
            title={renderTitle}
            handleClose={handleClose} 
            renderActions={renderActions} 
        >
            {renderRequestInfo()}
        </Dialog>
    );
}

const mapStateToProps = state => ({
    connectSelectors: connectSelectors(state),
    notificationsSelectors: notificationsSelectors(state),
});

const mapDispatchToProps = dispatch => ({
    connectActions: connectActions(dispatch),
    notificationsActions: notificationsActions(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectChatDialog);
