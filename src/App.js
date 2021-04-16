import React, {Component} from 'react';
import './App.css';

{/*just handles the display of the information if that information exists*/}
function City(props) {
  return (
    <div>
      <h3>{props.cityData.City}</h3>{/* print the city in which lands in the zipcode*/}
      {/* an unordered list of the needed things
          - state
          - location
          - population
          - total wages */}
        <ul>
          <li>State: {props.cityData.State}</li>
          <li>Location: ({props.cityData.Lat},{props.cityData.Long})</li>
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
      <div>
        {/* input the zipcode to be searched
            when the field is changed, then it triggers the screen to change. */}
        Zip Code:
        <input value ={props.zipcode} onChange={props.zipChange} placeholder="Try 10016"></input>
      </div>
    </div>
  );
}


class App extends Component {
  constructor(props){
    super(props);
    //the default state of the state
    this.state = {
      zipcode: '', //no zipcode
      data: [<div>No Result</div>] //no results
    };

    //if it does get updated, bind that result to the state.
    this.updateZip = this.updateZip.bind(this);
  }

  //the code that changes the page and gets the zipcode information
  updateZip(evt){

    let zip = evt.target.value;
    this.setState({
      zipcode: zip
    })
    //console.log(this.state.zipcode);
    
    //checks that the zipcode length must be 5 digits
    //if it is, does the work
    if(zip.length === 5){
      //get the information from the api
      fetch('http://ctp-zip-api.herokuapp.com/zip/' + zip)

        //get the response
        .then((response) => {
          if(response.ok){ //if the reponse is ok, then it turns the response into a json file
            //console.log(response.json());
            return response.json();
          //else, it returns nothing
          }else{
            return [];
          }
        })
        
        //take the response and map it so that it can be displayed.
        .then((responseJson) => {
          const cities = responseJson.map(d => {
            return <City cityData={d} />
          })

          //set the state so that the data is the cities
          this.setState({
            data: cities
          })
        })
    }
    //else, the page will display No Result
    else{
      this.setState({
        data: [<div>No Result</div>]
      })
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
                zipChange = {this.updateZip}
              />
                {this.state.data}
            </div>
        </div>
      </div>
    </div>
    );
  }
}

export default App;
