import './App.css';
import React from 'react';
import Map from './components/Map'


class Apps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        subCounty:[],
        healthCenters:[]
    }
  }

componentDidMount =() => {
  this.getSubcounties();
  this.getAllHeathFacilities();
}

getSubcounties = ()=> {
  fetch('http://localhost:9000/data/api/nairobisubcounties')
  .then((response) => response.json())
  .then((data) => {
    this.setState({ subCounty: data });
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
  });
}
getAllHeathFacilities = ()=> {
  fetch('http://localhost:9000/data/api/nairobihealthfacilities')
  .then((response) => response.json())
  .then((data) => {
    this.setState({ healthCenters: data });
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
  });
}

  render() {
    let { subCounty, healthCenters} = this.state;
    return (
    <div>
        <Map subCounty={subCounty} healthCenters={healthCenters}/>
    </div>
    );
  }
}
export default Apps;

