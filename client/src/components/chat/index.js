import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { selectors as userSelectors } from '../../store/redux/userRedux';
import { selectors as chatSelectors, CHAT_STATUS, actions as chatActions } from '../../store/redux/chatRedux';
import Message from './message/message';
import PerfectCrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './chat.scss';

class Chat extends Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        
        this.scrollRef = React.createRef();
        this.scrollTimeout = null;
        this.isAutoMode = true; // scrolls down automatically with every new message
    }

    buttonClick = () => {
        const { user } = this.props;
        const message = this.inputRef.current.value;
        if (message.trim() !== '') {
            this.inputRef.current.value = '';
            this.props.sendMessage(user, message);
        }
    }

    handleEnter = (event) => {
        if(event.key === 'Enter'){
            this.buttonClick();
        }
    }

    fetchPreviousMessages = () => {
        if (!this.isAutoMode) {
            console.log('fetchPreviousMessages called');
            this.props.fetchPreviousMessages();
        }
    }

    scrollToBottom = () => {
        if (this.scrollRef.current) {
            if (this.scrollTimeout) {
                clearTimeout(this.scrollTimeout);
            }
            this.scrollTimeout = setTimeout(() => {
                const container = this.scrollRef.current._container;
                container.scrollTop = container.scrollHeight;
                this.scrollTimeout = null;
            }, 50);
        }
    }

    renderMessages = (messages) => {
        const { user } = this.props;
        const { _id: userId } = user || {};

        if (this.isAutoMode)
            this.scrollToBottom();

        this.messagesCount = (messages || []).length;
        return (
            <Fragment>
                {messages.map((m, i) => (
                    <Message key={i} userId={userId} message={m} />
                ))}
            </Fragment>
        )
    }

    render() {
        const { user, request, status, messages } = this.props;
        const { name, email, phone, _id: userId } = user || {};
        const inputEnabled = status === CHAT_STATUS.CONNECT_SUCCESS;
        return (
            <div className="chat-container">
                
                <div className="user-info">
                    <div>{userId} {name} {phone} {email}</div>
                    <div className="chat-status">{status}</div>
                </div>

                <div className="request">{request}</div>

                <div className="chat-window">
                    <PerfectCrollbar 
                        onScrollUp={() => this.isAutoMode = false}
                        onYReachStart={this.fetchPreviousMessages} 
                        onYReachEnd={() => this.isAutoMode = true}
                        ref={this.scrollRef} 
                        options={{ suppressScrollX: true }}>

                        <div className="chat-content">
                            {this.renderMessages(messages)}
                        </div>
                    </PerfectCrollbar>
                </div>
                
                <div className="chat-input" disabled={!inputEnabled}>
                    <input ref={this.inputRef} onKeyPress={this.handleEnter} disabled={!inputEnabled} type="text"></input>
                    <button disabled={!inputEnabled} onClick={this.buttonClick}>send</button>
                </div>

            </div>
        )
    }

    componentWillUnmount() {
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }
    }

}

const mapStateToProps = state => ({
    user: userSelectors.user(state),
    request: chatSelectors.request(state),
    status: chatSelectors.status(state),
    messages: chatSelectors.messages(state),
});

const mapDispatchToProps = dispatch => chatActions(dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
