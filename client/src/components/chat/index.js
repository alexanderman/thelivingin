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
        this.chatContent = React.createRef();
        this.isAutoScroll = true; /** scrolls down automatically with every new message */
        this.hasPreviousMessages = true;
        this.onYReachStartEnabled = false;  /** prevent from calling fetchPreviousMessages immediately after render */
    }

    sendClick = () => {
        const { user } = this.props;
        const message = this.inputRef.current.value;
        if (message.trim() !== '') {
            this.inputRef.current.value = '';
            this.props.sendMessage(user, message);
        }
    }

    handleEnter = (event) => {
        if(event.key === 'Enter'){
            this.sendClick();
        }
    }

    _getScroll = () => {
        const chatContentElem = this.chatContent.current;
        const scrollElem = this.scrollRef.current._container;
        window._scroll = this.scrollRef.current;
        return {
            height: chatContentElem.offsetHeight,
            scrollTop: scrollElem.scrollTop,
            scrollElem
        };
    }

    getSnapshotBeforeUpdate() {
        this.onYReachStartEnabled = false;
        return this._getScroll(); 
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        const prevScroll = snapShot;
        if (prevProps.messages.length !== this.props.messages.length && prevScroll) {
            if (this.isAutoScroll) {
                /** scroll to bottom */
                const container = this.scrollRef.current._container;
                container.scrollTop = container.scrollHeight;
            }
            else {
                /** find out are new messages appended or prepended */
                const prevLastMessage = prevProps.messages[prevProps.messages.length - 1] || { index: 0 };
                const currLastMessage = this.props.messages[this.props.messages.length - 1] || { index: 0 };
                const isAppended = !prevProps.messages.length || currLastMessage.index > prevLastMessage.index;
                /** preserve scroll position when new messages are added */
                const currScroll = this._getScroll();
                if (!isAppended) {
                    currScroll.scrollElem.scrollTop = prevScroll.scrollTop + currScroll.height - prevScroll.height;
                }
            }

            /** handle case when loaded initial messages did not fill the whole page and scroll is invisible  */
            /** in this case fetch more messages till there is visible scroll or no more messages */
            const ps = this.scrollRef.current ? this.scrollRef.current._ps : undefined;
            const { status } = this.props;
            const isConnected = status === CHAT_STATUS.CONNECT_SUCCESS;
            if (ps && isConnected) {
                if (!ps.scrollbarYActive) {
                    console.log('bring more messages, scroll invisible');
                    this.props.fetchPreviousMessages();
                }
            }
        }
    }

    fetchPreviousMessages = () => {
        if (this.onYReachStartEnabled) {
            this.props.fetchPreviousMessages();
        }
        this.onYReachStartEnabled = true;
    }

    renderMessages = (messages) => {
        const { user } = this.props;
        const { _id: userId } = user || {};

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
                        onScrollUp={() => this.isAutoScroll = false}
                        onYReachStart={this.fetchPreviousMessages} 
                        onYReachEnd={() => this.isAutoScroll = true}
                        ref={this.scrollRef} 
                        options={{ suppressScrollX: true }}>

                        <div className="chat-content" ref={this.chatContent}>
                            {this.renderMessages(messages)}
                        </div>
                    </PerfectCrollbar>
                </div>
                
                <div className="chat-input" disabled={!inputEnabled}>
                    <input ref={this.inputRef} onKeyPress={this.handleEnter} disabled={!inputEnabled} type="text"></input>
                    <button disabled={!inputEnabled} onClick={this.sendClick}>send</button>
                </div>

            </div>
        )
    }

    componentWillUnmount() {
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

/**
 * TODO: indication for 
 *  - sending message (on button indication)  
 *  - fetching prev messages (on top of chat window like android refresh)
 */