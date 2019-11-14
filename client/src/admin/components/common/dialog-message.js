import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from './dialog';

export default props => {
    const { message, isOpen, handleClose } = props;

    return (
        <Dialog fullWidth={false} isOpen={isOpen} handleClose={handleClose} 
            renderActions={() => (
                <Button variant="outlined" onClick={handleClose}>OK</Button>
            )}
        >
            {message}
        </Dialog>
    );
}
