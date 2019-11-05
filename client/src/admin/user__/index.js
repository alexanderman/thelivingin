import React from 'react';
import moment from 'moment';
import './user.scss'

export default props => {
    const { name, createdAt, phone, email, canHelp, help_area } = props;
    const canHelpStr = canHelp.toString();
    const createdAtStr = moment(createdAt).format('DD/MM/YYYY HH:mm');

    return (
        <div className="user-cont">
            <div className="createdAt">{createdAtStr}</div>
            <div className="name">{name}</div>
            <div className="email">{email}</div>
            <div className="phone">{phone}</div>
            <div className="canHelp">{canHelpStr}</div>
            <div className="help_area" title={help_area}>{help_area}</div>
        </div>
    )    
}

