import React, { Component } from "react";
import "./App.css";

{
  /*just handles the display of the information if that information exists*/
}
function City(props) {
  return (
    <div className="cards">
      <h3>{props.cityData.City}</h3>
      {/* print the city in which lands in the zipcode*/}
      {/* an unordered list of the needed things
          - state
          - location
          - population
          - total wages */}
      <ul>
        <li>State: {props.cityData.State}</li>
        <li>
          Location: ({props.cityData.Lat},{props.cityData.Long})
        </li>
        <li>Population (estimated): {props.cityData.EstimatedPopulation}</li>
        <li>Total Wages: {props.cityData.TotalWages}</li>
      </ul>
    </div>
  );
}

//sets up the ZipSearchField
function ZipcodeSearchField(props) {
  return (
    <div>
      <div className="centering">
        {/* input the zipcode to be searched
            when the field is changed, then it triggers the screen to change. */}
        Zip Code:
        <input
          value={props.zipcode}
          onChange={props.zipChange}
          placeholder="Try 10016"
        ></input>
      </div>
    </div>
  );
}

/** methods for city search below modified by Ifte***/
function AllCityZips(props) {
  return (
    <div>
      <div>
        <ul>
          <li>{props.zipData}</li>
        </ul>
      </div>
    </div>
  );
}

function CitySearchField(props) {
  return (
    <div>
      <div className="centering">
        CITY NAME:
        <input
          value={props.City}
          onChange={props.cityChange}
          placeholder="Try brooklyn"
        ></input>
      </div>
    </div>
  );
}
/*END OF METHODS */

class App extends Component {
  constructor(props) {
    super(props);
    //the default state of the state
    this.state = {
      zipcode: "", //no zipcode
      data: [<div className="centering">No Result</div>], //no results
      cityName: "",
      placeZips: [<div className="centering">No Result</div>], //need for city search app
    };

    //if it does get updated, bind that result to the state.
    this.updateZip = this.updateZip.bind(this);
    this.updateCity = this.updateCity.bind(this);
  }

  //the code that changes the page and gets the zipcode information
  updateZip(evt) {
    let zip = evt.target.value;
    this.setState({
      zipcode: zip,
    });
    //console.log(this.state.zipcode);

    //checks that the zipcode length must be 5 digits
    //if it is, does the work
    //if (zip.length === 5) {
    //get the information from the api
    fetch("https://ctp-zip-api.herokuapp.com/zip/" + zip)
      //get the response
      .then((response) => {
        if (response.ok) {
          //if the reponse is ok, then it turns the response into a json file
          //console.log(response.json());
          return response.json();
          //else, it returns nothing
        } else {
          return [];
        }
      })

      //take the response and map it so that it can be displayed.
      .then((responseJson) => {
        const cities = responseJson.map((d) => {
          return <City cityData={d} />;
        });
        //set the state so that the data is the cities
        this.setState({
          data: cities,
        });
      })
      .catch((error) => {
        console.log("Error: ");
      });
    //}
    //else, the page will display No Result
    // else {
    //   this.setState({
    //     data: [<div className="centering">Not found </div>],
    //   });
    // }
  }

  //update city method below
  updateCity(evt) {
    let city = evt.target.value;
    this.setState({
      cityName: city,
    });

    if (this.state.placeZips.length != 0) {
      fetch("http://ctp-zip-api.herokuapp.com/city/" + city.toUpperCase()) //makes sure input is in uppercase
        .then((response) => {
          if (response.ok) {
            //returns data if feteched correctly
            return response.json();
          } else {
            return [];
          }
        })

        .then((responseJson) => {
          const allZips = responseJson.map((z) => {
            return <AllCityZips zipData={z} />; //puts the data into zipData
          });

          //set the state so that the data is the cities
          this.setState({
            placeZips: allZips, //changes the empty array
          });
        });
    } //Error handling when the city is not found
    else {
      this.setState({
        placeZips: [<div className="centering">Not Found </div>],
      });
    }
  }

  //after all the work is done, this is final bit that it should do.
  render() {
    //console.log(this.state.data);
    return (
      <div className="App">
        <div className="App-header">
          <h2>Zip Code Search</h2>
        </div>
        <div>
          <div>
            <div>
              <ZipcodeSearchField
                zip={this.state.zipcode}
                zipChange={this.updateZip}
              />
              {this.state.data}
            </div>
            {/* Below is the div for city search */}
            <div>
              <CitySearchField cityChange={this.updateCity} />
              {this.state.placeZips}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
