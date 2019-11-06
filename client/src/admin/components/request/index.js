import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Timestamp from '../common/timestamp';

const useStyles = makeStyles({
  content: {
    display: 'flex',
    flexDirection: 'row',
  },
  userInfo: {
    
  },
  request: {
    marginLeft: '2em'
  },
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
    <Card className={classes.card} elevation="5">
      <CardContent>
        <div className={classes.content}>
          
          <div className={classes.userInfo}>
            <Typography variant="body1" color="textPrimary">
              {name} <br />
              {phone} <br />
              {email} <br />
              <Timestamp timestamp={createdAt} />
            </Typography>
          </div>
          
          <div className={classes.request}>
            <Typography variant="body2" color="textSecondary">
              {textarea}
            </Typography>
          </div>

        </div>
      </CardContent>
      <CardActions>
        <Button size="small" variant="contained">Clear</Button>
      </CardActions>
    </Card>
  );
}
