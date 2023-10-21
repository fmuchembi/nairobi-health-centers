import { React, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import L from 'leaflet';
import marker from '../assets/images/medicine.png';

const Map = (props) => {
  const [facilities, setFacilities] = useState(props.healthCenters);
  const [subcounties, setSubcounties] = useState(null);
  const position = [-1.295761267252445, 36.8605899810791];
  const [selectedSubCounty, setSelectedSubCounty] = useState('Nairobi County');



  const fetchData = async (selectedSubCounty) => {
    try {
      const response = await fetch(`http://localhost:9000/data/api/nairobihealthfacilities/withinsubcounty/${selectedSubCounty}`);
      const data = await response.json();
      setFacilities(data);
    } catch (error) {
      console.error(error);
    }
  };

  const onSearchSubmit = async (event) => {
    event.preventDefault();
    await fetchData(selectedSubCounty);
  };

  const style = {
    height: '70vh',
    width: '100%',
  };
  const myIcon = new L.Icon({
    iconUrl: marker,
    iconRetinaUrl: marker,
    popupAnchor: [0, 0],
    iconSize: [12, 12],
  });

  const handleChange = (event) => {
    setSelectedSubCounty(event.target.value);
  };

  const getAllSubcounties = async () => {
    const response = await fetch("http://localhost:9000/data/api/counties");
    const subcounties = await response.json();
    setSubcounties(subcounties);
  };

  useEffect(() => {
    getAllSubcounties();
  }, []);
  useEffect(() => {
    setFacilities(props.healthCenters);
  }, [props.healthCenters]);


  const styles = {
    fillColor: 'none',
    weight: 0.5,
    opacity: 1,
    color: 'white',
    fillOpacity: 1,
  };
  return (
    <div>
    <div>
      <div>
        <div className="header">
          <h2 className='text-danger mt-4'>Nairobi Health Centers web map</h2>
          <p className="text-muted mt-2" style={{ color: 'white' }} >A web map displaying the health facilities within Nairobi county. The user can also find the nearest health facility based on their location.</p>
        </div>
      </div>
      <div>
        <div className='formSection'>
          <form className='d-flex' onSubmit={onSearchSubmit}>
            <select className="form-select" aria-label="Default select example" value={selectedSubCounty} onChange={handleChange}>
              <option value='Nairobi County' className='option'>Nairobi County</option>
              {props.subCounty.map((option) => (
                <option key={option.id} value={option.value} className='option'>
                  {option.name}
                </option>
              ))}
            </select>
            <button type="submit" className="btn btn-danger">Search</button>
          </form>
        </div>
      </div>
    </div>
    <div>
      <MapContainer center={position} zoom={11} scrollWheelZoom={true} style={style}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors|| Build by fmuchembi'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png"
        />
        {subcounties && (
          <GeoJSON
            data={subcounties}
            style={styles}
            attribution='Nairobi subcounties'
          />
        )}
        {facilities.map((center) => {
          const point = [center.point.coordinates[1], center.point.coordinates[0]];
          return (
            <Marker position={point} key={center.id} icon={myIcon} >
              <Popup>
                <span>Name:<br /> {center.name}</span>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  </div>
  );
};

export default Map;








