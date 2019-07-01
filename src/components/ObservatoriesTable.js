/**
 * @module components/StationTable
 * @author Charles Blais, Natural Resource Canada <charles.blais@canada.ca>
 *
 * Station Table
 * ==============
 */

// General modules
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import { Button } from 'react-bootstrap';

import 'react-table/react-table.css';

import ObservatoryModal from './modals/ObservatoryModal';

import { COUNTRY_CODES } from '../constants';

const ObservatoriesTable = (props) => {
  const {
    observatories,
  } = props;

  const [ show, showModal ] = useState(false);
  const [ iaga, setIAGA ] = useState('');
  
  const gins = [];
  const status = [];
  const data = (observatories) ? observatories : [];

  // Convert the country code to full string
  data.forEach( obs => {
    obs.country = (obs.country in COUNTRY_CODES) ? COUNTRY_CODES[obs.country] : obs.country;
  });

  // sort the observatory by iaga code
  data.sort((a, b) => {
    if (a.iaga > b.iaga) {
      return 1;
    } else if (a.iaga < b.iaga) {
      return -1;
    }
    return 0;
  })

  // get the list of gins
  data.forEach( obs => {
    if (('gin' in obs) && (gins.indexOf(obs.gin) < 0)) {
      gins.push(obs.gin);
    }
  });

  // get the list of status
  data.forEach( obs => {
    if (('status' in obs) && (status.indexOf(obs.status) < 0)) {
      status.push(obs.status);
    }
  });

  
  // action on table
  const handleButtonClick = (row) => {
    setIAGA(row.original.iaga);
    showModal(true);
  }

  const columns = [{
    Header: 'IAGA code',
    id: 'iaga',
    accessor: 'iaga',
    filterMethod: (filter, row) => row[filter.id] ? row[filter.id].toLowerCase().includes(filter.value.toLowerCase()) : true
  }, {
    Header: 'Name',
    accessor: 'name',
    filterMethod: (filter, row) => row[filter.id] ? row[filter.id].toLowerCase().includes(filter.value.toLowerCase()) : true
  }, {
    Header: 'Country',
    accessor: 'country',
    filterMethod: (filter, row) => row[filter.id] ? row[filter.id].toLowerCase().includes(filter.value.toLowerCase()) : true
  }, {
    Header: 'Latitude',
    accessor: 'latitude',
  }, {
    Header: 'Longitude',
    accessor: 'longitude',
  }, {
    Header: 'Status',
    accessor: 'status',
    Filter: ({ filter, onChange }) =>
      <select
        onChange={event => onChange(event.target.value)}
        style={{ width: "100%" }}
        value={ filter ? filter.value : '' }
      >
        <option key='all' value=''>All</option>
        { status.map((stat) => <option key={stat} value={stat}>{stat}</option>)}
      </select>
    
  }, {
    Header: 'GIN',
    accessor: 'gin',
    Filter: ({ filter, onChange }) =>
      <select
        onChange={event => onChange(event.target.value)}
        style={{ width: "100%" }}
        value={ filter ? filter.value : '' }
      >
        <option key='all' value=''>All</option>
        { gins.map((gin) => <option key={gin} value={gin}>{gin}</option>)}
      </select>
  }, {
    Header: 'Details',
    accessor: 'properties.id',
    filterable: false,
    Cell: row => (<Button onClick={() => handleButtonClick(row)}>view</Button>),
  }];

  return (
    <React.Fragment>
      <ReactTable
        data={data}
        className="-striped -highlight"
        columns={columns}
        filterable
        sortable
        resizable
        defaultSorting={[{
          id: 'iaga',
          desc: false,
        }]}
      />
      <ObservatoryModal
        show={show}
        onHide={() => showModal(false)}
        iaga={iaga} />
    </React.Fragment>
  );
};

ObservatoriesTable.propTypes = {
  observatories: PropTypes.arrayOf(PropTypes.object),
};

export default ObservatoriesTable;