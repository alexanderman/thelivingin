import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import Dialog from '../common/dialog';
import { Button, Typography, Switch, FormControlLabel } from '@material-ui/core';
import './notify-chat-dialog.scss';
import { actions as connectActions, selectors as connectSelectors } from '../../store/redux/connectChatRedux';
import { actions as notificationsActions, selectors as notificationsSelectors } from '../../store/redux/chatNotificationsRedux';

const ConnectChatDialog = props => {
    const { 
        connectSelectors, connectActions, 
        notificationsSelectors, notificationsActions,
    } = props;
    
    const isOpen = true;
    const sendEnabled = !!notificationsSelectors.email || !!notificationsSelectors.sms;

    const handleClose = (ev, reason) => {
        if (!notificationsSelectors.inProcess) {
            notificationsActions.setUser(undefined);
        }            
    }

    const handleAction = () => {
        if (!notificationsSelectors.inProcess) {
            notificationsActions.sendNotificationChatNewMessages();
        }
    }

    const renderTitle = () => (<span>Send Notification Unread messages to <b>{notificationsSelectors.user.name}</b></span>)

    const _toggleNotification = key => event => {
        notificationsActions.toggleNotification(key, event.target.checked);
    }

    const renderRequestInfo = () => {
        return (
            <Fragment>
                <div className="notify-chat-dialog-controls">
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
        const error = notificationsSelectors.error;
        if (!error) return null;        
        return (
            <Fragment>
            <div className="notify-chat-dialog_error">
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
            <Button disabled={notificationsSelectors.inProcess} variant="text" onClick={handleClose}>Cancel</Button>
            <Button disabled={notificationsSelectors.inProcess || !sendEnabled} variant="contained" style={{ width: '12em' }} color="primary" onClick={handleAction}>Send</Button>
        </Fragment>
    );


    return (
        <Dialog isOpen={isOpen} 
            showProgress={notificationsSelectors.inProcess}
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
