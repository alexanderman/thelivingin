import React from 'react';
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    timeStamp: {
        // fontSize: '0.6em'
    },
}));

export default props => {
    const classes = useStyles();
    if (!props.timestamp) {
        return null;
    }
    const formatted = moment(props.timestamp).format('DD/MM/YYYY HH:mm');
    return <span className={classes.timeStamp}>{formatted}</span>;
}
