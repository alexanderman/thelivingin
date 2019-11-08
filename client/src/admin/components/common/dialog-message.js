import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from './dialog';

export default props => {
    const { message, isOpen, handleClose } = props;

    return (
        <Dialog isOpen={isOpen} title="Message" text={message} handleClose={handleClose} 
            renderActions={() => (
                <Button variant="outlined" onClick={handleClose}>OK</Button>
            )}
        />
    );
}
