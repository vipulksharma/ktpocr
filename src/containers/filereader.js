import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ReactFileReader from 'react-file-reader';

import { setCsvDataToStore } from '../actions'

class FileReader extends Component {

    constructor(props) {
      super(props);
      this.state = {
        inputKtp : '',
        inputFile : ''
      }
    }
    callPredictions = () => {
      const { inputKtp, inputFile } = this.state;
      if(!inputKtp && !inputFile) {
        return false;
      }
      const opts = {
        inputFile : inputFile,
        inputKtp : inputKtp
      }
      fetch('https://api.github.com/gists', {
        method: 'post',
        body: JSON.stringify(opts)
      }).then(function(response) {
        console.log(response.json())
      }).then(function(data) {
        console.log(data)
      });
    }
    handleFiles = files => {
      this.setState({inputFile: files})
    }

    setInputValue = (e) => {
      this.setState({inputKtp : e.target.value})
    }

    render(){
        const { showColumnMapper, inputKtp } = this.state;
        const { addresses } = this.props;
        return (
          <div>
            <input type='text' className='input-ktp' placeholder='Please enter KTP' value={inputKtp} onChange={this.setInputValue}></input>
            <ReactFileReader base64={true} handleFiles={this.handleFiles}>
              <button className='btn'>Upload KTP</button>
            </ReactFileReader>
            <div className='center'>
              <button type='button' className="btn" label="Predict" onClick={() => this.callPredictions()}>Predict</button>
            </div>
        </div>
        )
    }

}
const mapStateToProps = state => ({
  addresses : state.addressReducer.addresses
})

export default withRouter(connect(mapStateToProps ,{
    setCsvDataToStore
})(FileReader));
