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

export default function MyTable(props) {
    const classes = useStyles();
    const [data, setData] = useState({ columns: props.columns, rows: props.rows });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { onRowClick, showLoading, selectable, onSelectedChange } = props;

    useEffect(() => {
        setData({ columns: props.columns, rows: props.rows });
        setPage(0);
    }, [props.columns, props.rows]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleRowClick = (row, index) => {
        if (selectable) {
            const { columns, rows } = data;
            const updatedRows = [...rows];
            updatedRows[index] = { ...row, _$selected: !!!row._$selected };
            setData({ columns, rows: updatedRows });

            if (onSelectedChange) {
                onSelectedChange(updatedRows.filter(r => r._$selected));
            }
        }

        if (onRowClick) {
            onRowClick(row);
        }
    }

    const { columns, rows } = data;

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
                    <TableRow selected={row._$selected} hover onClick={() => handleRowClick(row, index)} role="checkbox" tabIndex={-1} key={row._id}>
                    
                    {selectable
                        ? <TableCell><Checkbox color="primary" checked={!!row._$selected} /></TableCell>
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
