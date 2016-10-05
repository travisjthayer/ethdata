import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Web3 from 'web3'
import _ from 'lodash'

var ETHEREUM_CLIENT = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

var phdataContractABI = [{"constant":true,"inputs":[],"name":"getPeople","outputs":[{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"uint256[]"}],"type":"function"},{"constant":false,"inputs":[{"name":"_firstName","type":"bytes32"},{"name":"_lastName","type":"bytes32"},{"name":"_age","type":"uint256"}],"name":"addPerson","outputs":[{"name":"success","type":"bool"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"people","outputs":[{"name":"firstName","type":"bytes32"},{"name":"lastName","type":"bytes32"},{"name":"age","type":"uint256"}],"type":"function"}]
var phdataContractAddress = '0xcbfe4455d7cbebe8bb69e65ea73c481c720947ca'

var phdataContract = ETHEREUM_CLIENT.eth.contract(phdataContractABI).at(phdataContractAddress)


class App extends Component {

constructor(props) {
  super(props)
  this.state = {
    firstNames: [],
    lastNames: [],
    ages: []
  }
}


  componentWillMount() {
    var data = phdataContract.getPeople()
    this.setState({
      firstNames: String(data[0]).split(','),
      lastNames: String(data[1]).split(','),
      ages: String(data[2]).split(',')
    })
  }

  render() {

    var TableRows = []

    _.each(this.state.firstNames, (value, index) => {
      TableRows.push(
        <tr>
          <td>{ETHEREUM_CLIENT.toAscii(this.state.firstNames[index])}</td>
          <td>{ETHEREUM_CLIENT.toAscii(this.state.lastNames[index])}</td>
          <td>{this.state.ages[index]}</td>
        </tr>
        )
    })


    return (
      <div className="App">
        <div className="App-header">
          <h2>PH Data - Project App built with ReactJS</h2>
        </div>
        <div className="App-content">
          
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Age</th>
              </tr>
            </thead>
            <tbody>
              {TableRows}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default App;
