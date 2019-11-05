import React from 'react';
import MyTable from '../components/table';
import './requests-list.scss';
import { connect } from 'react-redux';
import { selectors as requestsSelectors } from '../../store/admin/redux/requestsRedux';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';

const columns = [{
    id: 'createdAt',
    label: 'CreatedAt',
    minWidth: 100,
    align: 'left',
    format: value => moment(value).format('DD/MM/YYYY HH:mm'),
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
        minWidth: 100,
        align: 'left',
        format: value => value,
    },{
        id: 'textarea',
        label: 'Request',
        minWidth: 270,
        align: 'left',
        format: value => value,
}];


const mock_users = require('../mock_users');
const rows = mock_users;


function RequestsList(props) {
    const { requests, isFetching } = props;
    return (
        <div className="requess-list">
            <MyTable columns={columns} rows={requests} />
            {isFetching
                ? <CircularProgress className="loader" />
                : null
            }
            
        </div>
    );
}

const mapStateToProps = state => requestsSelectors(state);

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(RequestsList);


