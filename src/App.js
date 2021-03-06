import React, { Component } from "react";
import axios from "axios";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    //the default state of the state
    this.state = {
      zipcode: "", //no zipcode
      data: [], //no results
      cityName: "",
      placeZips: [], //need for city search app
      found: false, //this is for the zipcode search part
      foundZips: false, //this is for the city search zipcode part
    };

    //if it does get updated, bind that result to the state.
    this.updatedZip = this.updatedZip.bind(this);
    this.updatedCity = this.updatedCity.bind(this);
  }

  //the code that changes the page and gets the zipcode information
  updatedZip = async (event) => {
    let zip = event.target.value;
    let linkToAPI = "https://ctp-zip-api.herokuapp.com/zip/" + zip; //link to the api

    this.setState({
      zipcode: zip,
    });
    //console.log(this.state.zipcode);

    //if the zipcode is valid we store the data of the citie into the state and found is true
    try {
      let response = await axios.get(linkToAPI);
      this.setState({ data: response.data, found: true });
    } catch (error) {
      //If there was an invalid zipcode we send errors into our console and setstate to false
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        this.setState({ found: false });
      }
    }
  };

  //update city method below
  updatedCity = async (event) => {
    let city = event.target.value;
    let linkToAPI = "https://ctp-zip-api.herokuapp.com/city/" + city.toUpperCase(); //link to api
    this.setState({
      cityName: city,
    });

    try {
      let response = await axios.get(linkToAPI);
      this.setState({ placeZips: response.data, foundZips: true });
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        this.setState({ foundZips: false });
      }
    }
  };

  //set up output for the first part where the user enters a zipcode and it will output city information
  makeTableZip = () => {
    let currData = this.state.data;
    let foundMatch = this.state.found;
    let output = [];
    if (!foundMatch) {
      return <div className="centering">Please enter a valid zip code </div>;
    } else {
      //For loop is needed because the way the data is set up it is set up in an array, so need to iterate through it
      for (let i = 0; i < currData.length; i++) {
        output.push(
          <div className= "background">
            <h1>{currData[i].City}</h1>
            {/* print the city in which lands in the zipcode*/}
            {/* an unordered list of the needed things
          - state
          - location
          - population
          - total wages */}
            <ul>
              <li>State: {currData[i].State}</li>
              <li>Country: {currData[i].Country}</li>
              <li>Location: ({currData[i].Lat},{currData[i].Long})</li>
              <li>Population (Estimated): {currData[i].EstimatedPopulation}</li>
              <li>Total Wages: ${currData[i].TotalWages + '.00'}</li>
            </ul>
          </div>
        );
      }
      return output;
    }
  };

  //set up output for the second part where user inputs a city and outputs all the zipcodes associated with the city
  makeTableCity = () => {
    let currData = this.state.placeZips;
    let foundMatch = this.state.foundZips;
    let output = [];
    if (!foundMatch) {
      return <div className="centering">Please enter a valid city </div>;
    } else {
      //For loop is needed because the way the data is set up it is set up in an array, so need to iterate through it
      for (let i = 0; i < currData.length; i++) {
        output.push(
          <div>
            <ul>
              <li className="zipcodeList">{currData[i]}</li>
            </ul>
          </div>
        );
      }
      return output;
    }
  };
  //after all the work is done, this is final bit that it should do.
  render() {
    //console.log(this.state.data);
    return (
      <div className = "App">
        <div className = "App-header">
          <h2>Zip Code and City Name Search </h2>
        </div>
        <div>
          <div>
            <div className = "centering">
              {/* input the zipcode to be searched
            when the field is changed, then it triggers the screen to change. */}
            
              ZIP CODE: 
              <input
                value={this.state.zipcode}
                onChange={this.updatedZip}
                placeholder = "Try 11207"
              ></input>
              {this.makeTableZip()}
            </div>
            {/* Below is the div for city search */}
            <div className="centering">
              CITY NAME: 
              <input
                value = {this.state.cityName}
                onChange = {this.updatedCity}
                placeholder = "Try Brooklyn"
              ></input>
              {this.makeTableCity()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
