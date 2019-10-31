import React, { Component } from 'react';
import Chat from '../components/chat';
import { connect } from 'react-redux';
import { actions as chatActions } from '../store/redux/chatRedux';
import './public.scss';

function getUrlParams() {
    return window.location.search.substr(1).split('&').reduce((acc, keyVal) => {
        const key = keyVal.split('=')[0];
        const val = keyVal.split('=')[1];
        if (val) {
            acc[key] = decodeURIComponent(val);
        }
        return acc;
    }, {});
}

const Error = props => (
    <div className="error">
        missing chat parameters:
        {props.missingKeys.map(key => 
            <div className="key" key={key}>{key}</div>
        )}
    </div>
);

const Content = () => <Chat />;
    

/** this component renders Chat, responsible for getting url parameters and start redux flow */
const Public = props => {
    const urlParams = getUrlParams();
    const missingQueryParams = ['chatId', 'userId', 'requestId', 'sig'].filter(key => !urlParams[key]);

    if (missingQueryParams.length) {
        return <Error missingKeys={missingQueryParams}/>;
    }

    /** starting the chat initating flow */
    props.fetchChat(urlParams.chatId, urlParams.userId, urlParams.requestId, urlParams.sig);
    return <Content />;
}


const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => chatActions(dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Public);

