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
        inputFile : '', prediction: {}
      }
    }
    callPredictions = () => {
      const { inputKtp, inputFile } = this.state;
      if(!inputKtp && !inputFile) {
        return false;
      }

      const opts = {
        image_url : inputFile,
        image : inputFile
      }
      fetch('http://10.255.150.61:6969/api/v1/model/predict/python/python/text_proposal/v1', {
        method: 'post',
        body: JSON.stringify(opts)
      }).then(function(response) {
        if(response) {
          alert(response.json());
          this.setState({prediction: response.json()})
        }
      }).then(function(data) {
        console.log(data)
      });
    }
    handleFiles = files => {
      this.setState({inputFile: files.base64})
    }

    setInputValue = (e) => {
      this.setState({inputKtp : e.target.value})
    }
    // <input type='text' className='input-ktp' placeholder='Please enter KTP' value={inputKtp} onChange={this.setInputValue}></input>

    render(){
        const { showColumnMapper, inputKtp, inputFile, prediction } = this.state;
        const { addresses } = this.props;
        return (
          <div>
            <ReactFileReader base64={true} handleFiles={this.handleFiles}>
              <button className='btn'>Upload KTP</button>
            </ReactFileReader>
            <img src={inputFile}></img>
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
