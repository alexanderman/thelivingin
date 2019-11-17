import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import Dialog from '../common/dialog';
import { Button, Typography, Switch, FormControlLabel } from '@material-ui/core';
import './connect-chat-dialog.scss';
import { actions as connectActions, selectors as connectSelectors } from '../../store/redux/connectChatRedux';


const ConnectChatDialog = props => {
    const { 
        /** redux props */
        user, chat, request, setUser, isAllSet, notification, toggleNotification, 
        setNotificationsON, setNotificationsOFF, sendNotification,
        inProcess, sendConnect, sendDisconnect, error, notificationError,
        /** parent component props */
        isAddUser,
    } = props;

    const buttonText = isAddUser ? 'Add' : 'Remove';
    
    useEffect(() => {
        isAddUser ? setNotificationsON() : setNotificationsOFF();
    }, [user, chat]);
    
    const isOpen = isAllSet;

    const handleClose = (ev, reason) => {
        if (!inProcess)
            setUser(undefined);
    }

    const handleAction = () => {
        if (!inProcess) {
            if (isAddUser) {
                sendConnect();
                sendNotification();
            }
            else    
                sendDisconnect();
        }
    }

    const renderTitle = () => {
        if (!isAddUser) {
            return (
                <span>Removing <b>{user.name}</b> from request</span>
            );
        }
        return (
            <span>Adding <b>{user.name}</b> to request</span>
        );
    }

    const _toggleNotification = key => event => {
        toggleNotification(key, event.target.checked);
    }

    const renderRequestInfo = () => {
        const requestText = (request.textarea || '').substr(0, 200) + '...';
        return (
            <Fragment>
                <Typography variant="body2" color="textSecondary">{requestText}</Typography>
                <div style={{ marginTop: '1em' }} className="connect-chat-dialog-controls">
                    <FormControlLabel control={
                        <Switch disabled={inProcess} checked={!!notification.email} onChange={_toggleNotification('email')} color="secondary"></Switch>
                    } label="Send Email Notification"></FormControlLabel>
                    <FormControlLabel control={
                        <Switch disabled={inProcess} checked={!!notification.sms} onChange={_toggleNotification('sms')} color="secondary"></Switch>
                    } label="Send Sms Notification"></FormControlLabel>
                </div>
                {renderError()}
            </Fragment>
        );
    }

    const renderError = () => {
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
            <Button disabled={inProcess} variant="text" onClick={handleClose}>Cancel</Button>
            <Button disabled={inProcess} variant="contained" style={{ width: '12em' }} color="primary" onClick={handleAction}>{buttonText}</Button>
        </Fragment>
    );


    return (
        <Dialog isOpen={isOpen} 
            showProgress={inProcess}
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
