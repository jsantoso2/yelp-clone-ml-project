import React from 'react';
import { geolocated } from 'react-geolocated';

// components and CSS imports
import Header from './header';

// Home is simple as some parts of the home screen will be displayed on the header.js file
// Home just loads the coordinates of the current location
// Code is referenced from https://www.npmjs.com/package/react-geolocated
function Home (props) {    
    return (
        !props.isGeolocationAvailable ? (
            <div>Your browser does not support Geolocation</div>
        ) : !props.isGeolocationEnabled ? (
            <div>Geolocation is not enabled</div>
        ) : props.coords ? (
            <div>
                {sessionStorage.setItem('latlon', [props.coords.latitude, props.coords.longitude])}
                <Header home={true}/>
            </div>
        ) : (
            <div>Getting the location data&hellip; </div>
        )
    ); 
}

export default geolocated({ positionOptions: { enableHighAccuracy: false, }, userDecisionTimeout: 5000,})(Home);
