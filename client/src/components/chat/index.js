import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectors as userSelectors } from '../../store/redux/userRedux';
import { selectors as chatSelectors, CHAT_STATUS } from '../../store/redux/chatRedux';
import './chat.scss';

class Chat extends Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
    }

    buttonClick = () => {
        console.log(this.inputRef.current.value)
        this.inputRef.current.value = '';
    }

    render() {
        const { name, email, phone, request, status } = this.props;
        const inputEnabled = status == CHAT_STATUS.CONNECT_SUCCESS;
        return (
            <div className="chat-container">
                
                <div className="user-info">
                    <div>{name} {phone} {email}</div>
                    <div className="chat-status">{status}</div>
                </div>

                <div className="request">{request}</div>

                <div className="chat-window"></div>
                
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

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
