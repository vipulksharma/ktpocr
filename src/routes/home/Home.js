/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.css';
import ReactFileReader from 'react-file-reader';

class Home extends React.Component {
  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.state = {
      inputKtp : '',
      inputFile : '',
      prediction: {},
      response: {}
    }
  }
  callPredictions = async () => {
    const { inputKtp, inputFile } = this.state;
    if(!inputKtp && !inputFile) {
      return false;
    }

    const opts = {
      image_url : inputFile,
      image : inputFile
    }
    const fetchConfig = {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(opts),
    };
    console.log(fetchConfig);
    const resp = await fetch('http://172.21.45.247:8080/invocations', fetchConfig);
    resp.json().then((response) => {
      console.log(response.json())
      this.setState({response : response.json()})
    }).then(function(data) {
      console.log(data);
    })
  }
  handleFiles = files => {
    this.setState({inputFile: files.base64})
  }

  setInputValue = (e) => {
    this.setState({inputKtp : e.target.value})
  }

  render() {
    const { showColumnMapper, inputKtp, inputFile, prediction, response } = this.state;
    return (
      <div>
        <div>
          <div className={s.center}>
            <ReactFileReader base64={true} handleFiles={this.handleFiles}>
              <button >Upload Image</button>
            </ReactFileReader>
          </div>
          {
            inputFile && <img src={inputFile}></img>
          }
          <div className={s.center}>
            <button type='button' className={s.btn} label="Predict" onClick={() => this.callPredictions()}>Predict</button>
          </div>
        </div>
        { response && <div>{JSON.stringify(response)}</div> }
      </div>
    );
  }
}

export default withStyles(s)(Home);
