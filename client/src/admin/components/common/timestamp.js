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
    const { timestamp, className } = props;

    if (!timestamp) {
        return null;
    }

    const formatted = moment(timestamp).format('DD/MM/YYYY HH:mm');
    return <span className={`${classes.timeStamp} ${className}`}>{formatted}</span>;
}
