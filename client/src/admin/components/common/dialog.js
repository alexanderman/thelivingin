import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles(theme => ({

}));

export default function MaxWidthDialog(props) {
  const classes = useStyles();
  const { isOpen = false, title, text, renderActions, handleClose, fullWidth = false } = props;
  
  const renderTitle = () => {
    if (title) {
      if (typeof title === 'function')
        return title();
      return title;
    }
  }

  return (
    <React.Fragment>
    <Dialog
        fullWidth={fullWidth}
        maxWidth="sm"
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
    >
        {title ? <DialogTitle id="max-width-dialog-title">{renderTitle()}</DialogTitle> : null}
        
        <DialogContent>
            {text ? <DialogContentText>{text}</DialogContentText> : null}
            {props.children}
        </DialogContent>
        <DialogActions>
            {renderActions && renderActions()}
        </DialogActions>
    </Dialog>
    </React.Fragment>
  );
}
