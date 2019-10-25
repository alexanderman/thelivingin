import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectors as userSelectors } from '../../store/redux/userRedux';
import { selectors as chatSelectors } from '../../store/redux/chatRedux';
import './chat.scss';

class Chat extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { name, email, phone, request } = this.props;
        return (
            <div className="chat-container">
                
                <div className="user-info">{name} {phone} {email}</div>

                <div className="request">{request}</div>

                <div className="chat-window"></div>
                
                <div className="chat-input">
                    <input disabled={true} type="text"></input>
                    <button disabled={true}>send</button>
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


});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
