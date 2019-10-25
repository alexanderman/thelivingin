import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { selectors as userSelectors } from '../../store/redux/userRedux';
import { selectors as chatSelectors, CHAT_STATUS, actions as chatActions } from '../../store/redux/chatRedux';
import './chat.scss';

class Chat extends Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
    }

    buttonClick = () => {
        const message = this.inputRef.current.value;
        this.inputRef.current.value = '';
        this.props.sendMessage(message);
    }

    renderMessages = (messages) => (
        <Fragment>
            {messages.map((m, i) => (
                <div key={i}>{m}</div>
            ))}
        </Fragment>
    )

    render() {
        const { name, email, phone, request, status, messages } = this.props;
        const inputEnabled = status == CHAT_STATUS.CONNECT_SUCCESS;
        return (
            <div className="chat-container">
                
                <div className="user-info">
                    <div>{name} {phone} {email}</div>
                    <div className="chat-status">{status}</div>
                </div>

                <div className="request">{request}</div>

                <div className="chat-window">
                    {/* {this.renderMessages(messages)} */}
                </div>
                
                <div className="chat-input" disabled={!inputEnabled}>
                    <input ref={this.inputRef} disabled={!inputEnabled} type="text"></input>
                    <button disabled={!inputEnabled} onClick={this.buttonClick}>send</button>
                </div>

            </div>
        )
    }
}

const mapStateToProps = state => ({
    name: userSelectors.name(state),
    email: userSelectors.email(state),
    phone: userSelectors.phone(state),
    request: chatSelectors.request(state),
    status: chatSelectors.status(state),
    messages: chatSelectors.messages(state),
});

const mapDispatchToProps = dispatch => chatActions(dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
