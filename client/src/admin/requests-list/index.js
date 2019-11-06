import React, { Fragment } from 'react';
import MyTable from '../components/table';
import { connect } from 'react-redux';
import { selectors as requestsSelectors, actions as requestsActions } from '../store/redux/requestsRedux';
import moment from 'moment';

const timestampFormat = timestamp => {
    const date = moment(timestamp).format('DD/MM/YYYY HH:mm').split(' ');    
    return <Fragment>{date[0]}&nbsp;<span>{date[1]}</span></Fragment>
}

const requestFormat = value => <span className="help-area">{value}</span>;

const columns = [{
    id: 'createdAt',
    label: 'Created At',
    minWidth: 120,
    align: 'left',
    format: timestampFormat
},{
        id: 'name',
        label: 'Name',
        minWidth: 140,
        align: 'left',
        format: value => value,
    },{
        id: 'email',
        label: 'Email',
        minWidth: 170,
        align: 'left',
        format: value => value,
    },{
        id: 'phone',
        label: 'Phone',
        minWidth: 120,
        align: 'left',
        format: value => value,
    },{
        id: 'textarea',
        label: 'Request',
        minWidth: 250,
        align: 'left',
        format: requestFormat
}];


const mock_users = require('../mock_users');
const rows = mock_users;


function RequestsList(props) {
    const { requests, isFetching, setSelected } = props;
    return (
        <MyTable columns={columns} rows={requests} onRowClick={setSelected} showLoading={isFetching} />
    );
}

const mapStateToProps = state => requestsSelectors(state);

const mapDispatchToProps = requestsActions;

export default connect(mapStateToProps, mapDispatchToProps)(RequestsList);


