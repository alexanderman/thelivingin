import React from 'react';
import { connect } from 'react-redux';
import Dialog from '../common/dialog';
import { Button } from '@material-ui/core';

import { actions as usersActions, selectors as usersSelectors } from '../../store/redux/usersRedux';
import { actions as chatActions, selectors as chatSelectors } from '../../store/redux/selectedChatRedux';


const ConnectChatDialog = props => {
    const { isOpen, handleClose } = props;

    return (
        <Dialog isOpen={isOpen} 
            handleClose={handleClose} 
            renderActions={() => <Button variant="text" onClick={handleClose}>testing button</Button>} 
        >
            Здравствуйте! Хочу выйти на авталу. Нужна консультация по бухгалтерии: пенсия, пицуим, выход на авталу (куда обращаться и какие документы нужны). Понять, правильно ли ведется бухгалтером тофес 106.
        </Dialog>
    );
}

const mapStateToProps = state => ({
    usersSelectors: usersSelectors(state),
    chatSelectors: chatSelectors(state),
});

const mapDispatchToProps = dispatch => ({
    usersActions: usersActions(dispatch),
    chatActions: chatActions(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectChatDialog);
