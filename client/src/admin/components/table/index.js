import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import ActionNotify from './action-notify';


const useStyles = makeStyles({
    container: {
        position: 'relative',
        flex: 1,
        overflow: 'hidden',
        padding: '0.2em',
    },
    loader: {
        position: 'absolute',
        left: '50%',
        marginLeft: '-20px',
        top: '50%',
        marginTop: '-20px',
        zIndex: 10,
    },
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    tableWrapper: {
        maxHeight: '100%',
        overflow: 'auto',
    },
});

/** maintains own(unmanaged) pager state  */
export default function MyTable(props) {
    const { columns, rows, showLoading, 
        rowClickable, onRowClick, 
        selectable, onSelectClick, isRowSelected, disableSelection,
        showActionNotify, onActionNotifyClick, actionNotifyDisabled,
    } = props;
    
    const _isRowSelected = row => selectable && isRowSelected(row);

    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(100);

    useEffect(() => {
        setPage(0); /** will reset the pager when the data changes */
    }, [columns, rows]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleRowClick = (row, index) => {
        if (rowClickable && onRowClick) {
            onRowClick(row);
        }
    }

    const handleRowSelect = (row, index) => {
        if (selectable && onSelectClick) {
            onSelectClick(row);
        }
    }

    return (
        <div className={classes.container}>
            {showLoading
                ? <CircularProgress className={classes.loader} />
                : null
            }
        <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
            <Table stickyHeader aria-label="sticky table" size="medium">
            <TableHead>
                <TableRow>
                {selectable
                    ? <TableCell></TableCell>
                    : null 
                }

                {showActionNotify
                    ? <TableCell></TableCell>
                    : null 
                }

                {columns.map(column => (
                    <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    >
                    {column.label}
                    </TableCell>
                ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                return (
                    <TableRow style={{cursor: rowClickable ? 'pointer' : 'default'}} selected={_isRowSelected(row)} hover onClick={() => handleRowClick(row, index)} role="checkbox" tabIndex={-1} key={row._id}>
                    
                    {selectable
                        ? <TableCell><Checkbox disabled={disableSelection} color="primary" onClick={() => handleRowSelect(row)} checked={_isRowSelected(row)} /></TableCell>
                        : null
                    }

                    {showActionNotify
                        ? <TableCell>
                            <ActionNotify onClick={() => onActionNotifyClick(row)} disabled={!_isRowSelected(row)} />
                        </TableCell>
                        : null 
                    }

                    {columns.map(column => {
                        const value = row[column.id];
                        return (
                        <TableCell key={column.id} align={column.align}>
                            {column.format ? column.format(value) : value}
                        </TableCell>
                        );
                    })}
                    </TableRow>
                );
                })}
            </TableBody>
            </Table>
        </div>
        <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
            'aria-label': 'previous page',
            }}
            nextIconButtonProps={{
            'aria-label': 'next page',
            }}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
        />
        </Paper>
        </div>
    );
}
