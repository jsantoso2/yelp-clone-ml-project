import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

// components and CSS imports
import SearchResults from './searchresults';
import './header.css';

// image imports
import yelp_logo from '../images/yelp_logo.png';
import background_image from '../images/background_image.jpg';
import five from '../images/five.JPG';
import four_half from '../images/four_half.JPG';
import four from '../images/four.JPG';
import three_half from '../images/three_half.JPG';
import three from '../images/three.JPG';
import two_half from '../images/two_half.JPG';
import two from '../images/two.JPG';
import one_half from '../images/one_half.JPG';
import one from '../images/one.JPG';
import zero from '../images/zero.JPG';


// Material UI Imports
import { Restaurant, Motorcycle, ShoppingBasket, Search } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { Grid, MenuItem, Select, TextField, Button, Card, CardMedia } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';


// Material UI styles overwrite
const styles = {
    selectbar: {
        backgroundColor: 'white',
        height: '40px',
        width: '13rem',
        marginTop: '20px',
        marginLeft: '20px'
    },
    searchbar: {
        backgroundColor: 'white',
        height: '40px',
        width: '20rem',
        margin: '20px 0px 0px 20px',
    },
    locationsearchbar: {
        backgroundColor: 'white',
        height: '40px',
        width: '17rem',
        margin: '20px 0px 0px 20px',
    },
    locationSearchButton: {
        marginTop: '20px',
        marginBottom: '20px',
        height: '40px',
        width: '3rem',
    }
}

function Header(props){

    // Fake data for businesses
    // const business = [{'business_id': '4o2DEgSgY2sDZ16g6U03-w', 'name': "name0"}, {"business_id": "dPGs5b0N9MarZjVgQVelGQ", "name": "name1"}]

    // React Hooks for business data
    const [business, setBusiness] = useState([]);

    // fetch all business data on initial run
    useEffect(() => {
        fetch('https://yelp-sentiment-backend-286616.ue.r.appspot.com/getAllBusiness', {mode: 'cors'}).then(res => res.json()).then(data => {
            setBusiness(data);
        }).catch(() => {
            console.log("Error in fetch getAllBusiness in header.js");
        })
    }, []);

    // React hooks for current search term
    const [searchTerm, setSearchTerm] = useState('');
    // React hooks for current selected option (Restaurant/Pickup/Delivery)
    const [selectedOption, setSelectedOption] = useState('');
    // React hooks for hideOption for hide/show search results
    const [hideOption, setHideOption] = useState(true);
    // React hooks for current location
    const [location, setLocation] = useState('');   
    // React hooks for 3 closest business to current location
    const [business_near, setBusinessNear] = useState([]);
    // React hooks for loading state
    const [isLoading, setLoading] = useState(true);


    // edit the current search term search term
    const editSearchTerm = (e) => {
        // if no text hide the search results
        if (e.target.value === ""){
            setSearchTerm(e.target.value);
            setHideOption(true);
        } else {
        // if text exist, we can show the search results
            setSearchTerm(e.target.value);
            setHideOption(false);
        }
    }

    // dynamic search method
    const dynamicSearch = () => {
        const business_data = business;

        // filter by the all results by the business name
        const result = business_data.map(n => n.name)
                                 .filter(name => name.toLowerCase().includes(searchTerm.toLowerCase()));
        // map back to array of objects
        const obj_result = business_data.filter(elem => result.includes(elem.name));
        return obj_result;
    }

    // current selection for pickup/delivery/restaurant
    const editSelection = (e) => {
        setSelectedOption(e.target.value);
    }

    // Fetch from API for reverse geocoding and 3 nearest businesses
    useEffect(() => {
        // get current latitude, longitude from local storage
        const lat_storage = sessionStorage.getItem("latlon").split(',')[0]
        const lon_storage = sessionStorage.getItem("latlon").split(',')[1] 

        // Fetch from mapbox api for reverse geocoding (long, lat) => place name
        fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/' + lon_storage + ',' + lat_storage + '.json?access_token=pk.eyJ1IjoianNhbnRvc28yIiwiYSI6ImNrZG01eXZiYjE1N2kyeHBtaDNpanIzcGIifQ.lPtC048cZ-579QuODJc_vQ')
        .then(res => res.json()).then(data => {
            // get place name from current coordinates
            setLocation(data.features[3].text + ',' + data.features[4].text);
        }).catch(() => {
            console.log("Error in fetch Reverse geocoding in header.js");
        })

        // can run in parallel so it is ok to leave this outside
        // fetch 3 nearest businesses 
        fetch('https://yelp-sentiment-backend-286616.ue.r.appspot.com/getThreeNearestBusiness?lat=' + lat_storage + '&lon=' + lon_storage, {mode: 'cors'}).then(res => res.json()).then(data => {
            setBusinessNear(data);
            setLoading(false);
        }).catch(() => {
            console.log("Error in fetch getThreeNearestBusiness in header.js");
            setLoading(true);
        })

        // Fake data
        /*setLocation('Manhattan, New York');
        const business_near2 = [{'business_id': "4o2DEgSgY2sDZ16g6U03-w", "name": "name0", "photo": "http://blog.caesars.com/las-vegas/wp-content/uploads/2019/04/favorite-bistro-patio2-720x540.jpg", "stars": 4, "review_count": 10, "categories": "categories0", "city": "city", "state": "state"},
        {'business_id': "dPGs5b0N9MarZjVgQVelGQ", "name": "name0", "photo": "http://blog.caesars.com/las-vegas/wp-content/uploads/2019/04/favorite-bistro-patio2-720x540.jpg", "stars": 3, "review_count": 15, "categories": "categories1", "city": "city", "state": "state"},
        {'business_id': "Ue4wtaeyhPKvdkXlULimCw", "name": "name0", "photo": "http://blog.caesars.com/las-vegas/wp-content/uploads/2019/04/favorite-bistro-patio2-720x540.jpg", "stars": 5, "review_count": 20, "categories": "categories2", "city": "city", "state": "state"}]
        setBusinessNear(business_near2);*/
        
    }, []);

    // update location variable as user is typing in location
    const updateLocationSearch = (event) => {
        setLocation(event.target.value);
    };

    // use API to find out true location
    const findLocation = (event) => {

        // Fetch mapbox api to find (latitude, longitude) from location
        fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/' + location + '.json?country=US&access_token=pk.eyJ1IjoianNhbnRvc28yIiwiYSI6ImNrZG01eXZiYjE1N2kyeHBtaDNpanIzcGIifQ.lPtC048cZ-579QuODJc_vQ')
        .then(res => res.json()).then(data => {
            // update location to the current location
            setLocation(data.features[0].text + "," + data.features[0].context[0].text);
            // returned data = long, lat. Flip to get lat, long
            // store the coordinates in local storage
            sessionStorage.setItem("latlon", [data.features[0].center[1], data.features[0].center[0]]);

            const lat_storage = sessionStorage.getItem("latlon").split(",")[0];
            const lon_storage = sessionStorage.getItem("latlon").split(",")[1];

            // refetch new business closer
            // need to be inside the then because cannot be run in parallel
            fetch('https://yelp-sentiment-backend-286616.ue.r.appspot.com/getThreeNearestBusiness?lat=' + lat_storage + '&lon=' + lon_storage, {mode: 'cors'}).then(res => res.json()).then(data => {
                setBusinessNear(data);
            }).catch(() => {
                console.log("Error in getThreeNearestBusiness in header.js");
                setLoading(true);
            })
        }).catch(()  => {
            console.log("Error in fetching latitude, longitude from location in header.js");
        })

        // Fake data
        /*setLocation('Los Angeles, California')
        sessionStorage.setItem("latlon", [34.0544,-118.2439]);
        const business_near3 = [{'business_id': "business_id4", "name": "abc", "photo": "http://blog.caesars.com/las-vegas/wp-content/uploads/2019/04/favorite-bistro-patio2-720x540.jpg", "stars": 0, "review_count": 10, "categories": "categories0", "city": "city", "state": "state"},
        {'business_id': "business_id5", "name": "def", "photo": "http://blog.caesars.com/las-vegas/wp-content/uploads/2019/04/favorite-bistro-patio2-720x540.jpg", "stars": 0, "review_count": 15, "categories": "categories1", "city": "city", "state": "state"},
        {'business_id': "business_id6", "name": "ghi", "photo": "http://blog.caesars.com/las-vegas/wp-content/uploads/2019/04/favorite-bistro-patio2-720x540.jpg", "stars": 0, "review_count": 20, "categories": "categories2", "city": "city", "state": "state"}]
        setBusinessNear(business_near3);        
        */
    }

    // function to retrieve image stars depending on the number of ratings
    const retrieve_stars = (stars_rating) => {
        if (stars_rating === 5){
            return (<img src={five} alt="5* rating" className="starsStyleHome" />);
        } else if (stars_rating === 4.5){
            return(<img src={four_half} alt="4.5* rating" className="starsStyleHome" />);
        } else if (stars_rating === 4){
            return(<img src={four} alt="4* rating" className="starsStyleHome" />);
        } else if (stars_rating === 3.5){
            return(<img src={three_half} alt="3.5* rating" className="starsStyleHome" />);
        } else if (stars_rating === 3){
            return(<img src={three} alt="3* rating" className="starsStyleHome" />);
        } else if (stars_rating === 2.5){
            return(<img src={two_half} alt="2.5* rating" className="starsStyleHome" />);
        } else if (stars_rating === 2){
            return(<img src={two} alt="2* rating" className="starsStyleHome" />);
        } else if (stars_rating === 1.5){
            return(<img src={one_half} alt="1.5* rating" className="starsStyleHome" />);
        } else if (stars_rating === 1){
            return(<img src={one} alt="1* rating" className="starsStyleHome" />);
        } else {
            return (<img src={zero} alt="0* rating" className="starsStyleHome" />);
        }
    }

    // handle logout which clears userid and current name
    const handleLogout = () => {
        // removes user_id and name
        sessionStorage.removeItem("user_id");
        sessionStorage.removeItem("currname");
    }

    return (
        <div>
        <div className = "header">
            <Grid container spacing={0}>
                {/* ############################ Yelp Logo ########################### */}
                <Grid item xs={4} sm={3} md={2}>
                    <Link to='/'>
                        <img className = "header_image" src = {yelp_logo} alt = "logo" />
                    </Link>
                </Grid>
                {/* ############################ Dropdown for Restaurant/Pickup/Delivery ########################### */}
                <Grid item xs={8} sm={9} md={3}>
                    <Select displayEmpty value={selectedOption} onChange={editSelection} 
                                variant = "outlined" className={props.classes.selectbar}>
                        <MenuItem value="" > Select a Category </MenuItem>
                        <MenuItem value={'Restaurant'} ><Restaurant /> Restaurants</MenuItem>
                        <MenuItem value={'Delivery'} ><Motorcycle /> Delivery</MenuItem>
                        <MenuItem value={'Pickup'} ><ShoppingBasket /> Pickup</MenuItem>
                    </Select>
                </Grid>
                {/* ############################ Dropdown for Restaurant/Pickup/Delivery ########################### */}
                <Grid item xs={12} sm={6} md={4}>
                    <TextField value = {searchTerm} onChange = {editSearchTerm} 
                                variant = "standard" placeholder="Search for a restaurant name!"
                                className={props.classes.searchbar} 
                    />
                    <SearchResults business={dynamicSearch()} hideOption={hideOption} className={props.classes.searchresults}></SearchResults>
                </Grid>
                {/* ############################ Location bar ########################### */}
                <Grid item xs={12} sm={6} md={3}>
                    <div className="locationSearch">
                    <TextField value = {location} onChange = {updateLocationSearch} 
                                variant = "standard" placeholder="Location"
                                className={props.classes.locationsearchbar} 
                    />
                    <Button onClick={findLocation} variant="contained" color="primary" className={props.classes.locationSearchButton}>
                        <Search />
                    </Button>
                    </div>
                </Grid>
            </Grid>
        </div>
        {/*############ If username exist, display "Welcome, Name" and Logout button. Otherwise, display Login and Signup button ######## */}
        <div style={{backgroundColor: "#d32323"}}>
            {(sessionStorage.getItem("currname")) ? (
                <div style={{display: "flex", alignItems: "center"}}>
                    <h2 style={{color: "white", marginLeft: "20px", marginTop: "20px", marginBottom: "20px"}}>{"Welcome, " + sessionStorage.getItem("currname")}</h2>
                    <Link to='/'>
                        <Button style={{color: "black", marginLeft: "20px", backgroundColor: "white"}} variant="outlined" color="primary" onClick={handleLogout}>Logout</Button>
                    </Link>
                </div>
            ) : (
                <div>
                    <Link to='/login'>
                        <Button style={{color: "black", marginLeft: "20px", backgroundColor: "white", marginTop: "20px", marginBottom: "20px"}}>Login</Button>
                    </Link>
                    <Link to='/signup'>
                        <Button style={{color: "black", marginLeft: "20px", backgroundColor: "white", marginTop: "20px", marginBottom: "20px"}} >Signup</Button>
                    </Link>
                </div>
            )}          
        </div>
        {/*############ If home = true, display home page, background image, and 3 nearest business to current location ######## */}
        <div>
            {(props.home && !isLoading) ? (
                <div>
                <div className="home_container_img">
                    <img className="bg_image" src = {background_image} alt = "background" />
                    <h3 className="bg_text">Welcome to Yelp Clone Project!</h3>
                    <p className="bg_text2">Photo from Yelp.com</p>
                </div>
                <h2 className="home_h2"> Explore Business Nearby!</h2>
                <Grid container spacing={0}>
                    {business_near.map(business => (
                        <Grid item xs={12} sm={4} key={business.business_id}>
                            <Card className="businessCardHome">
                                <div className="businessCardHomeContents">
                                    <div className="businessCardHomeHeader">
                                        <CardMedia src={business.photo} component="img" title="images" />
                                        <Link to={`/business/${business.business_id}`}>
                                            <h3>{business.name}</h3>
                                        </Link>
                                    </div>
                                    <div className="starsReviewCountHome">                      
                                        {retrieve_stars(business.stars)}
                                        <p>{business.review_count + " reviews"}</p>
                                    </div>  
                                    <p><strong>{business.categories}</strong></p>
                                    <p>{business.city + ", " + business.state}</p>
                                </div>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                </div>
            ) : (isLoading) ? (
                <div>
                    <Skeleton animation="wave" variant="rect" style={{width: "100%", height: "400px", marginBottom: "40px"}}/>
                    <Grid container spacing={0}>
                        <Grid item xs={12} sm={4}>
                            <Card className="businessCardHome">
                                <Skeleton animation="wave" style={{height: "150px"}}/>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Card className="businessCardHome">
                                    <Skeleton animation="wave" style={{height: "150px"}}/>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Card className="businessCardHome">
                                    <Skeleton animation="wave" style={{height: "150px"}}/>
                            </Card>
                        </Grid>
                    </Grid>
                </div>
            ) : (
                <div></div>
            )}
        </div>
        </div>
    );

}

export default withStyles(styles)(Header);
