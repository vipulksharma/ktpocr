import React, { Component } from 'react'
import FileReader from '../containers/filereader'

class ktpReader extends Component {
    render() {
      return(<div>
        <h1 className={"Heading"}>
          KTP OCR
        </h1>
        <FileReader />
      </div>)
    }
}
export default ktpReader
