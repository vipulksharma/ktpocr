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
      prediction: {},
      inputFile: '',
      response: {}
    }
  }
  callPredictions = async () => {
    const { inputKtp, inputFile } = this.state;
    if(!inputKtp && !inputFile) {
      return false;
    }

    const opts = {
      image_url : inputKtp,
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
    const resp = await fetch('http://172.21.45.247/invocations', fetchConfig);
    resp.json().then((response) => {
      this.setState({response : response.outputs})
    }).then(function(data) {
      alert('api call failed');
    })
  }
  handleFiles = files => {
    const file    = document.querySelector('input[type=file]').files[0];
    const reader  = new FileReader();
    const that = this;
    reader.addEventListener("load", function () {
      that.setState({inputFile: reader.result})
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  setInputValue = (e) => {
    this.setState({inputKtp : e.target.value})
  }

  render() {
    const { showColumnMapper, inputKtp, prediction, response, inputFile } = this.state;
    return (
      <div>
        <div>
          <div className={s.center}>
            <input type='text' placeholder='Please enter image url' value={inputKtp} onChange={this.setInputValue}/>
          </div>
          <div className={s.center}>
            <input type="file" onChange={this.handleFiles}/>
          </div>
          {
            inputFile && <img className={s.wd600} src={inputFile}></img>
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
