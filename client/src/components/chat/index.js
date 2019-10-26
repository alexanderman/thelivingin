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
    }

    buttonClick = () => {
        const { userId } = this.props;
        const message = this.inputRef.current.value;
        if (message.trim() !== '') {
            this.inputRef.current.value = '';
            this.props.sendMessage(userId, message);
        }
    }

    handleEnter = (event) => {
        if(event.key === 'Enter'){
            this.buttonClick();
        }
    }

    renderMessages = (messages) => {
        const { userId } = this.props;
        return (
            <Fragment>
                {messages.map((m, i) => (
                    <Message key={i} userId={userId} message={m} />
                ))}
            </Fragment>
        )
    }

    render() {
        const { userId, name, email, phone, request, status, messages } = this.props;
        const inputEnabled = status == CHAT_STATUS.CONNECT_SUCCESS;
        return (
            <div className="chat-container">
                
                <div className="user-info">
                    <div>{userId} {name} {phone} {email}</div>
                    <div className="chat-status">{status}</div>
                </div>

                <div className="request">{request}</div>

                <div className="chat-window">
                    <PerfectCrollbar>
                        {this.renderMessages(messages)}
                    </PerfectCrollbar>
                </div>
                
                <div className="chat-input" disabled={!inputEnabled}>
                    <input ref={this.inputRef} onKeyPress={this.handleEnter} disabled={!inputEnabled} type="text"></input>
                    <button disabled={!inputEnabled} onClick={this.buttonClick}>send</button>
                </div>

            </div>
        )
    }
}

const mapStateToProps = state => ({
    userId: userSelectors.userId(state),
    name: userSelectors.name(state),
    email: userSelectors.email(state),
    phone: userSelectors.phone(state),
    request: chatSelectors.request(state),
    status: chatSelectors.status(state),
    messages: chatSelectors.messages(state),
});

const mapDispatchToProps = dispatch => chatActions(dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
