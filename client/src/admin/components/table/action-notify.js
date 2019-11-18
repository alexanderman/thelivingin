import React from 'react';
import Button from '@material-ui/core/Button';
import Send from '@material-ui/icons/Send';

export default props => {
    const { disabled, onClick } = props;

    return (
        <Button onClick={onClick} disabled={disabled} variant="text" size="small">
            <Send color={disabled ? "disabled" : "primary"} />
        </Button>
    );
}
