import React from 'react';
import Table from '../table';
import { connect } from 'react-redux';
import { selectors as requestsSelectors, actions as requestsActions } from '../../store/redux/requestsRedux';
import { selectors as connectSelectors, actions as connectActions } from '../../store/redux/connectChatRedux';
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
        minWidth: 140,
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
    const { onSelectedSet, requestsSelectors, connectSelectors, connectActions } = props;
    const { requests, isFetching } = requestsSelectors;
    const { setRequest } = connectActions;

    const handleClick = request => {
        setRequest(request);
        onSelectedSet && onSelectedSet(request)
    }

    return (
        <Table rowClickable columns={columns} rows={requests} onRowClick={handleClick} showLoading={isFetching} />
    );
}

const mapStateToProps = state => ({
    requestsSelectors: requestsSelectors(state),
    connectSelectors: connectSelectors(state),
});

const mapDispatchToProps = dispatch => ({
    requestsActions: requestsActions(dispatch),
    connectActions: connectActions(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestsList);


