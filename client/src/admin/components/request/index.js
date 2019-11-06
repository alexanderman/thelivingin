import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Timestamp from '../common/timestamp';

const useStyles = makeStyles({
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  pos: {
    margin: '1em 0 0 0',
  },
});


export default function RequestCard(props) {
  const classes = useStyles();
  const { request = {} } = props;
  const { name, email, phone, createdAt, textarea, _id } = request;

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="body1" color="textPrimary">
          {name} <br />
          {phone} <br />
          {email}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {/* {formatTimestamp(createdAt)} */}
          <Timestamp timestamp={createdAt} />
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Clear</Button>
      </CardActions>
    </Card>
  );
}
