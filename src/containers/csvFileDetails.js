import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ReactFileReader from 'react-file-reader';
import csv from 'csv';
import Dropdown from 'react-dropdown'

import { setCsvDataToStore } from '../actions'

class CsvFileDetails extends Component {

    constructor(props) {
      super(props);
      this.state = {
        showColumnMapper : false,
        csvDataParsed : [],
        csvDataError : '',
        dropdownOptions : ['City', 'State', 'Zip', 'Address', 'Category']
      }
    }
    handleFiles = files => {
      let reader = new FileReader();
      reader.onload = (e) => {
        csv.parse(reader.result, (err, data) => {
          this.mapColumnsToValues(data);
        });
      }
      reader.readAsText(files[0]);
    }

    mapColumnsToValues = ( data ) => {
      this.setState({showColumnMapper : true, apiData: data})
    }

    setCSVData(data) {
      const { apiData } = this.state;
      let finalData = [];
      const colorsArr = ["red","green","yellow", "orange", "blue", "black","silver", "grey","golden", "brown"];
      let uniqueCategories = {};
      for (let i = 0; i < apiData.length; i++) {
        let d = {};
        for (let j=0; j < apiData[i].length;j++) {
          if(data[j] === 'Category' && !uniqueCategories[apiData[i][j]]) {
            uniqueCategories[apiData[i][j]] = colorsArr[i];
          }
          d[data[j]] = apiData[i][j]
        }
        finalData.push(d);
      }
      this.props.setCsvDataToStore(finalData, uniqueCategories)
    }

    _onSelect(val, val1){
      const { csvDataParsed } = this.state;
      let hasError = false;
      for (var i=0; i<csvDataParsed.length; i++) {
        if(csvDataParsed[i] === val1.value) {
          hasError = true;
          break;
        }
      }
      if(hasError) {
        this.setState({csvDataError : 'Please Select unique category'})
        return;
      }
      csvDataParsed[val] = val1.value;
      this.setState({
        csvDataParsed : csvDataParsed,
        csvDataError : ''
      }, () => {
        if(csvDataParsed.length === 5) {
          this.setCSVData(csvDataParsed);
        }
      })
    }

    renderAddressTable() {
      const { apiData, dropdownOptions, csvDataParsed, csvDataError } = this.state;
      return (
        <div>
        {
          csvDataError && <div className="error">{csvDataError}</div>
        }

        <table>
        <thead>
          <tr>
            <th><Dropdown onChange={this._onSelect.bind(this, '0')} options={dropdownOptions} value={csvDataParsed[0]} placeholder="Select a Category" /></th>
            <th><Dropdown onChange={this._onSelect.bind(this, '1')} options={dropdownOptions} value={csvDataParsed[1]} placeholder="Select a Category" /></th>
            <th><Dropdown onChange={this._onSelect.bind(this, '2')} options={dropdownOptions} value={csvDataParsed[2]} placeholder="Select a Category" /></th>
            <th><Dropdown onChange={this._onSelect.bind(this, '3')} options={dropdownOptions} value={csvDataParsed[3]} placeholder="Select a Category" /></th>
            <th><Dropdown onChange={this._onSelect.bind(this, '4')} options={dropdownOptions} value={csvDataParsed[4]} placeholder="Select a Category" /></th>
          </tr>
        </thead>
        <tbody>
          {apiData.map((row, id) => {
            return(<tr key={id}>
                {
                  row.map((col, idv) => {
                    return(<td key={id + idv}>{col}</td>)
                  })
                }
              </tr>)
          })}
        </tbody>
      </table>
    </div>);
    }

    render(){

        const { showColumnMapper } = this.state;
        const { addresses } = this.props;
        return (<div>
                { !addresses &&
                  <span>
                  <h1 className={"Heading"}>
                      { showColumnMapper ? `Please select column name` : `Please upload a CSV`}
                  </h1>
                  {
                    !showColumnMapper &&
                    <ReactFileReader fileTypes={'.csv'} handleFiles={this.handleFiles}>
                      <button className='btn'>Upload</button>
                    </ReactFileReader>
                  }
                  {
                    showColumnMapper && this.renderAddressTable()
                  }
                  </span>
                }
            </div>
        )
    }

}
const mapStateToProps = state => ({
  addresses : state.addressReducer.addresses
})

export default withRouter(connect(mapStateToProps ,{
    setCsvDataToStore
})(CsvFileDetails));
