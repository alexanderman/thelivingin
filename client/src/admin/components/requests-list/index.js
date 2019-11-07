import React, { Fragment } from 'react';
import Table from '../table';
import { connect } from 'react-redux';
import { selectors as requestsSelectors, actions as requestsActions } from '../../store/redux/requestsRedux';
import Timestamp from '../common/timestamp';


const requestFormat = value => <span className="help-area">{value}</span>;

const columns = [{
    id: 'createdAt',
    label: 'Created At',
    minWidth: 100,
    align: 'left',
    format: val => <Timestamp timestamp={val} />,
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


function RequestsList(props) {
    const { requests, isFetching, setSelected, onSelectedSet } = props;

    const handleClick = request => {
        setSelected(request);
        onSelectedSet && onSelectedSet(request)
    }

    return (
        <Table rowClickable columns={columns} rows={requests} onRowClick={handleClick} showLoading={isFetching} />
    );
}

const mapStateToProps = state => requestsSelectors(state);

const mapDispatchToProps = requestsActions;

export default connect(mapStateToProps, mapDispatchToProps)(RequestsList);


