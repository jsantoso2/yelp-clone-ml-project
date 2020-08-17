import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';

// Components and CSS imports
import Header from './header';
import './business.css';

// Image Imports 
import yelp_icon from '../images/yelp_icon.png';
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
import {Card, CardMedia, Avatar, Button, Grid } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import Skeleton from '@material-ui/lab/Skeleton';


function Business (props){
    // business_id is passed in as props from the main component
    const business_id = props.rp.match.params.id;
    
    // React Hooks for Mapbox viewport
    const [viewport, setViewport] = useState({
        "latitude": null,
        "longitude" : null,
        "width" : "15rem",
        "height" : "15rem",
        "zoom": 12
    });

    // React hooks for selected pin in mapbox
    const [selectedPin, setSelectedPin] = useState(null);         
    
    // React hooks to fetch data for current business
    const [business_data, setBusinessData] = useState({});

    // React hooks to fetch data for reviews crossed with users
    const [business_reviews, setBusinessReviews] = useState([]);

    // React hooks for loading state 
    const [isLoadingBusiness, setLoadingBusiness] = useState(true);
    const [isLoadingReview, setLoadingReview] = useState(true);


    // use effect to fetch business data and business review everytime the business id changes (dependant)
    useEffect(() => {
        fetch('https://yelp-sentiment-backend-286616.ue.r.appspot.com/getOneBusinessData?business_id=' + business_id, {mode: "cors"}).then(res => res.json()).then(data => {
            setBusinessData(data);
            setViewport({
                "latitude" : data.latitude,
                "longitude" : data.longitude,
                "width" : "15rem",
                "height" : "15rem",
                "zoom" : 12
            });
            setLoadingBusiness(false);
        }).catch(() => {
            console.log("error in getOneBusinessData");
            setLoadingBusiness(true);
        })

        fetch('https://yelp-sentiment-backend-286616.ue.r.appspot.com/getOneBusinessReview?business_id=' + business_id, {mode: "cors"}).then(res => res.json()).then(data => {
            setBusinessReviews(data);
            setLoadingReview(false);
        }).catch(() => {
            console.log("error in getOneBusinessReview");
            setLoadingReview(true);
        })

        // FAKE DATA for fetch
        /*setBusinessData({
            "address": "2526 E Carson St",
            "attributes": {
                "Alcohol": "full_bar",
                "Ambience": "{touristy: False, hipster: False, romantic: False, divey: True, intimate: False, trendy: False, upscale: False, classy: True, casual: True}",
                "BikeParking": "True",
                "BusinessAcceptsCreditCards": "True",
                "BusinessParking": "{garage: False, street: True, validated: False, lot: False, valet: False}",
                "Caters": "False",
                "GoodForKids": "False",
                "GoodForMeal": "{dessert: False, latenight: False, lunch: False, dinner: False, brunch: False, breakfast: False}",
                "HasTV": "True",
                "Music": "{dj: False, background_music: False, no_music: False, jukebox: False, live: True, video: False, karaoke: False}",
                "NoiseLevel": "quiet",
                "OutdoorSeating": "True",
                "RestaurantsAttire": "casual",
                "RestaurantsDelivery": "False",
                "RestaurantsGoodForGroups": "True",
                "RestaurantsPriceRange2": "1",
                "RestaurantsReservations": "False",
                "RestaurantsTakeOut": "True",
                "WiFi": "free"
            },
            "business_id": "4o2DEgSgY2sDZ16g6U03-w",
            "categories": "Restaurants, Nightlife, Bars, American (Traditional)",
            "city": "Pittsburgh",
            "country": "US",
            "hours": {
                "Friday": "10:00 am-2:00 am",
                "Monday": "10:00 am-2:00 am",
                "Saturday": "10:00 am-2:00 am",
                "Sunday": "11:00 am-2:00 am",
                "Thursday": "10:00 am-2:00 am",
                "Tuesday": "10:00 am-2:00 am",
                "Wednesday": "10:00 am-2:00 am"
            },
            "id": 0,
            "is_open": 1,
            "latitude": 40.4272666,
            "longitude": -79.9687359,
            "name": "Excuses Bar & Grill",
            "photo": "http://blog.caesars.com/las-vegas/wp-content/uploads/2019/04/favorite-bistro-patio2-720x540.jpg",
            "postal_code": "15203",
            "review_count": 35,
            "stars": 4,
            "state": "PA"
            });
        console.log("business_data inside", business_data);

        setViewport({"latitude": 37.7749,
                    "longitude": -122.4194, 
                    "width" : "300px",
                    "height" : "300px",
                    "zoom": 12})
        console.log("viewport_inside", viewport);


        // all review field plus user_name and profile_pic key in this dataset
        setBusinessReviews(
            [
                {
                    "average_stars": 3.5,
                    "business_id": "4o2DEgSgY2sDZ16g6U03-w",
                    "cool": 0,
                    "date": "11/30/2016",
                    "elite": "",
                    "fans": 0,
                    "friends": 4,
                    "funny": 0,
                    "id": 8,
                    "name": "Kelly",
                    "profile_pic": "https://bestnycacupuncturist.com/wp-content/uploads/2016/11/anonymous-avatar-sm.jpg",
                    "rating": 5,
                    "review_count": 2,
                    "text": "Love the wings!! And the daytime bartender is super sweet when we order take out so thank you :)",
                    "useful": 0,
                    "user_id": "Iq9EiUS7FmFB6Uw3PBghsQ",
                    "yelping_since": "2015-10-25 20:51:36"
                  },
                  {
                    "average_stars": 4.53,
                    "business_id": "4o2DEgSgY2sDZ16g6U03-w",
                    "cool": 7,
                    "date": "08/19/2016",
                    "elite": "2017",
                    "fans": 2,
                    "friends": 2542,
                    "funny": 0,
                    "id": 5,
                    "name": "Kailin",
                    "profile_pic": "https://bestnycacupuncturist.com/wp-content/uploads/2016/11/anonymous-avatar-sm.jpg",
                    "rating": 5,
                    "review_count": 38,
                    "text": "Have only been here twice, once for a drink and once for food. Both times were great! It is just a little dive bar but a great atmosphere. We were told to go and try the food the second time so my boyfriend and I did. IT WAS AMAZING! One of the best burgers and gyros in the city. We both agreed that their gyro was better than Mike and Tonys! We will definitely be back to try more food. The bartender was so sweet and made great recommendations as well!",
                    "useful": 23,
                    "user_id": "BHyCKAAMqXfxpSB4Z9QtAw",
                    "yelping_since": "2016-08-28 15:38:01"
                  },
                  {
                    "average_stars": 4.26,
                    "business_id": "4o2DEgSgY2sDZ16g6U03-w",
                    "cool": 6,
                    "date": "02/11/2016",
                    "elite": "",
                    "fans": 3,
                    "friends": 3934,
                    "funny": 7,
                    "id": 6,
                    "name": "Rick",
                    "profile_pic": "https://bestnycacupuncturist.com/wp-content/uploads/2016/11/anonymous-avatar-sm.jpg",
                    "rating": 5,
                    "review_count": 25,
                    "text": "Good beer, dive bar selections, reasonable prices. Food until early evening. Great service. Cool south side location with parking and all. \n\nA diamond in the rough.",
                    "useful": 11,
                    "user_id": "e2goTuVddLIT9Yz_6X6hCg",
                    "yelping_since": "2014-05-23 19:51:14"
                  }
            ]
        );*/

    }, [business_id]); 
    
    
    
    // function to retrieve star images depending on the rating
    const retrieve_stars = (stars_rating) => {
        if (stars_rating === 5){
            return (<img src={five} alt="5* rating" className="starsStyle" />);
        } else if (stars_rating === 4.5){
            return(<img src={four_half} alt="4.5* rating" className="starsStyle" />);
        } else if (stars_rating === 4){
            return(<img src={four} alt="4* rating" className="starsStyle" />);
        } else if (stars_rating === 3.5){
            return(<img src={three_half} alt="3.5* rating" className="starsStyle" />);
        } else if (stars_rating === 3){
            return(<img src={three} alt="3* rating" className="starsStyle" />);
        } else if (stars_rating === 2.5){
            return(<img src={two_half} alt="2.5* rating" className="starsStyle" />);
        } else if (stars_rating === 2){
            return(<img src={two} alt="2* rating" className="starsStyle" />);
        } else if (stars_rating === 1.5){
            return(<img src={one_half} alt="1.5* rating" className="starsStyle" />);
        } else if (stars_rating === 1){
            return(<img src={one} alt="1* rating" className="starsStyle" />);
        } else {
            return (<img src={zero} alt="0* rating" className="starsStyle" />);
        }
    }

    // function to get $ signs depending on the price range depends on (attributes.RestaurantsPriceRange2) of business_data
    const getPriceRange = (dollar_string) => {
        if (parseInt(dollar_string) === 5){
            return "$$$$$"
        } else if (parseInt(dollar_string) === 4){
            return "$$$$"
        } else if (parseInt(dollar_string) === 3){
            return "$$$"
        } else if (parseInt(dollar_string) === 2){
            return "$$"
        } else if (parseInt(dollar_string) === 1){
            return "$"
        } else {
            return ""
        }
    }

    // preprocess and filter business categories that are unwanted (generic business categories)
    // Remove: "restaurants", "nightlife", "food", "salad"
    const filterCategories = (raw_categories) => {
        const splitted = raw_categories.split(",").map(item=>item.trim());
        for(var i = splitted.length - 1; i >= 0; i--) {
            if(splitted[i].toLowerCase() === "restaurants" || splitted[i].toLowerCase() === "nightlife" || splitted[i].toLowerCase() === "food"
            || splitted[i].toLowerCase() === "salad") {
                splitted.splice(i, 1);
            }
        }
        return splitted.join(', ')
    }

    // get todays open and close date
    const openCloseToday = (business_data_hours) => {
        // get current day, hours, minutes
        let currDay = new Date().getDay();
        let currTimeHours = new Date().getHours();
        let currTimeMinutes = new Date().getMinutes();

        // to compensate for early morning hours up to 4:00am
        // if up to 4 am, use previous day open/close
        if (currTimeHours === 0 || currTimeHours === 1 || currTimeHours === 2 || currTimeHours === 3 || currTimeHours === 4){
            currDay = (currDay === 0) ? 6 : currDay - 1
        }

        // preprocess and return (Open/Close and Operating hours)
        const preprocessHours = (openHours, currTimeHours, currTimeMinutes) => {
            // if closed
            if (openHours === "Closed"){
                return <p className="todayClosed"><strong>Closed</strong></p>;
            }

            // compensate for early morning up to 4:00am, use prev day open close
            if (currTimeHours === 0 || currTimeHours === 1 || currTimeHours === 2 || currTimeHours === 3 || currTimeHours === 4){
                currTimeHours = currTimeHours + 24
            }    

            // split into open and close
            const splitted = openHours.split('-').map(item => item.split(':'));

            // extract open close hours
            let oh = parseInt(splitted[0][0]);
            let om = parseInt(splitted[0][1].substring(0,2));
            let ch = parseInt(splitted[1][0]);
            let cm = parseInt(splitted[1][1].substring(0,2));
            
            // multipliers for am or pm
            let oap = 0; // open am or pm
            oap = (splitted[0][1].slice(-2) === "am" || oh === 12) ? 0 : 12  // multiplier to add if am=0, pm=12 for close only
            let cap = 0; // close am or pm
            cap = (splitted[1][1].slice(-2) === "am") ? 24 : 12  // multiplier to add if am=24, pm=12 for close only
            
            // add the multipliers
            oh = oap + oh
            ch = cap + ch

            // compare current time to open and close hour
            if (currTimeHours > oh && currTimeHours < ch){
                return <p><span className="todayOpen"><strong>Open</strong></span> {openHours}</p>
            } else if (currTimeHours === oh){
                if (currTimeMinutes <= om){
                    return <p><span className="todayClosed"><strong>Closed</strong></span> {openHours}</p>
                } else {
                    return <p><span className="todayOpen"><strong>Open</strong></span> {openHours}</p>
                }
            } else if (currTimeHours === ch){
                if (currTimeMinutes > cm){
                    return <p><span className="todayClosed"><strong>Closed</strong></span> {openHours}</p>
                } else {
                    return <p><span className="todayOpen"><strong>Open</strong></span> {openHours}</p>
                }
            } else {
                return <p><span className="todayClosed"><strong>Closed</strong></span> {openHours}</p>
            }
        }

        // selector for days
        if (currDay === 0){
            return preprocessHours(business_data_hours.Sunday, currTimeHours, currTimeMinutes);
        } else if (currDay === 1){
            return preprocessHours(business_data_hours.Monday, currTimeHours, currTimeMinutes);
        } else if (currDay === 2){
            return preprocessHours(business_data_hours.Tuesday, currTimeHours, currTimeMinutes);
        } else if (currDay === 3){
            return preprocessHours(business_data_hours.Wednesday, currTimeHours, currTimeMinutes);
        } else if (currDay === 4){
            return preprocessHours(business_data_hours.Thursday, currTimeHours, currTimeMinutes);
        } else if (currDay === 5){
            return preprocessHours(business_data_hours.Friday, currTimeHours, currTimeMinutes);
        } else if (currDay === 6){
            return preprocessHours(business_data_hours.Saturday, currTimeHours, currTimeMinutes);
        } else {
            return <p></p>;
        }
    }

    // preprocess amenities field
    const preprocessAttributes = (business_data_attributes) => {

        // preprocess amenities field can be of 3 types
        // {keys: T/F}, T/F, string
        const processAttributesFurther = (attribute_val) => {
            let splitted = attribute_val.slice().split(":");
            let attributes = null;

            // if the attribute is a dictionary
            if (splitted.length > 2){
                // replace {} characters and split by :space 
                splitted = attribute_val.split(",").map(item => item.replace("}","").replace("{","").trim()).map(item => item.split(": "));
                // if attribute is true keep else set to "" and filter those out
                attributes = splitted.map(item => (item[1] === "True") ? item[0] : (""));
                attributes = attributes.filter(item => item !== "");
                // if no attributes left return N/A
                if (attributes.length === 0){
                    return "N/A";
                }
                // join attributes
                attributes = attributes.map(item => item.charAt(0).toUpperCase() + item.slice(1)) // capitalize first letter
                attributes = attributes.join(", ");
            } else {
            // type is T/F and string
                if (attribute_val === "True"){
                    attributes = "Yes";
                } else if (attribute_val === "False"){
                    attributes = "No";
                } else {
                    attributes = attribute_val;
                    attributes = attributes.charAt(0).toUpperCase() + attributes.slice(1); // capitalize first letter
                    attributes = attributes.replace("_", " ");
                }
            }
            // return the attributes
            return attributes;
        }

        // preprocess the keys to add spaces and capitalize, while removing words like Restaurants, and Business
        const processAttributesKeys = (attribute_keys) => {
            let keys = attribute_keys.replace(/([A-Z])/g, ' $1').trim();  //add space before capital letters and trim
            keys = keys.replace("T V", "TV");
            keys = keys.replace("Wi Fi", "WiFi");
            return keys.replace("Restaurants", "").replace("Business", "");
        }

        // return list of attributes
        return (
        <div>
            {Object.keys(business_data_attributes).map(function(key, index) {
                if (key !== "RestaurantsPriceRange2"){
                    return (
                    <div key={key} className="attributeList">
                        <div><strong>{processAttributesKeys(key)}: </strong></div>
                        <div>{processAttributesFurther(business_data_attributes[key])}</div>
                    </div>
                    );
                }
            })}
        </div>
        );
    }


    return (
        <div>
            {/*############################ Header ######################*/}
            <Header />
            <Grid container spacing={0}>
                {/* ####################### Reviews Card #################### */}
                <Grid item xs={12} sm={7} md={8}>
                    <Link to={`/writeareview/${business_data.business_id}/${sessionStorage.getItem("user_id")}`}>
                    <Button variant="contained" style={{background: "#f43939", color: "white", margin: "20px", alignItems: "center"}}>
                        <StarIcon style={{ color: "white", marginRight: "5px"}} />
                        Write a Review
                    </Button>
                    </Link>

                    {business_reviews.map(review => (
                        <Card className="reviewCards"  key={review.id}>
                            <div className="reviewCardContents">
                                <Grid container spacing={0}>
                                    <Grid item xs={12} sm={12} md={4}>
                                        <div className="reviewCardContentsHeader">
                                            <Avatar alt={review.name} src={review.profile_pic} className="reviewAvatar"/>
                                            <Link to={`/users/${review.user_id}`}>
                                                <h3>{review.name}</h3>
                                            </Link>
                                        </div>
                                        <div className="profileIconsReviews">
                                            <div style={{display: "flex", marginTop: "10px"}}>
                                                <svg>
                                                    <path d="M7.904 9.43l-2.098 4.697a.9.9 0 0 1-1.612 0L2.096 9.43a.902.902 0 0 1 .806-1.305h4.196c.67 0 1.105.705.806 1.305zM5 7.375a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"></path>
                                                    <path d="M15.904 9.43l-2.098 4.697a.89.89 0 0 1-.806.498.89.89 0 0 1-.806-.498L10.096 9.43a.902.902 0 0 1 .806-1.305h4.195c.67 0 1.106.705.807 1.305zM13 7.375a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"></path>
                                                </svg>
                                                <p style={{fontSize: "90%"}}><strong>{review.friends + " Friends"}</strong></p>
                                            </div>
                                            <div style={{display: "flex"}}>
                                                <svg>
                                                    <path d="M13 3H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1.505 9.643l-2.526-1.55L6.526 12.7 7 9.934 5 7.977l2.766-.404L8.97 4.7l1.264 2.873L13 7.977l-2 1.957.495 2.71z"></path>
                                                </svg>
                                                <p style={{fontSize: "90%"}}><strong>{review.review_count + " Reviews"}</strong></p>
                                            </div>
                                            <div style={{display: "flex"}}>
                                                <svg>
                                                    <path d="M15 15H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2zM9 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 6.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"></path>
                                                </svg>
                                                <p style={{fontSize: "90%"}}><strong>{"0 Photos"}</strong></p>
                                            </div>
                                        </div>    
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={8}> 
                                        <div style={{display: "flex", alignItems: "center"}}>
                                            {retrieve_stars(review.rating)}
                                            <p>{review.date}</p>
                                        </div>
                                        <p>{review.text}</p>
                                        <div className="funnyusefulcoolicons">
                                            <svg style={{viewBox:"0 0 100 100"}}>
                                                <path d="M12 1a11 11 0 0 1 11 11c0 6.075-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1zm0 20a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-15.82a5.56 5.56 0 0 1 3 10.26V17a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1.56a5.56 5.56 0 0 1 3-10.26zM11 17h2v-1h-2v1zm2.56-3a3.58 3.58 0 1 0-3.12 0h3.12z"></path>
                                            </svg>
                                            <p>{"Useful " + review.useful}</p>
                                            <svg style={{viewBox:"0 0 100 100"}}>
                                                <path d="M12 23C5.925 23 1 18.075 1 12S5.925 1 12 1s11 4.925 11 11a11 11 0 0 1-11 11zm0-20a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-4.5 8a1.5 1.5 0 0 1 3 0h-3zm6 0a1.5 1.5 0 0 1 3 0h-3zm-7.21 2h11.46a.26.26 0 0 1 .25.29c-.57 3.25-3 5.71-6 5.71s-5.43-2.46-5.96-5.71a.26.26 0 0 1 .25-.29z"></path>
                                            </svg>
                                            <p>{"Funny " + review.funny}</p>
                                            <svg style={{viewBox:"0 0 100 100"}}>
                                                <path d="M12 23C5.925 23 1 18.075 1 12S5.925 1 12 1s11 4.925 11 11a11 11 0 0 1-11 11zm0-20a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-7.48 7.56a.43.43 0 0 1 .41-.56h14.14a.43.43 0 0 1 .41.56l-.85 2.53a3 3 0 0 1-2.8 2 3 3 0 0 1-2.8-2l-.28-.85a.8.8 0 0 0-.75-.54.8.8 0 0 0-.75.54l-.28.85a3 3 0 0 1-2.8 2 3 3 0 0 1-2.8-2l-.85-2.53zm3.18 5.63a16.3 16.3 0 0 0 8.6 0 .25.25 0 0 1 .26.39A5.71 5.71 0 0 1 12 19a5.71 5.71 0 0 1-4.56-2.42.25.25 0 0 1 .26-.39z"></path>
                                            </svg>
                                            <p>{"Cool " + review.cool}</p>
                                        </div>
                                    </Grid> 
                                </Grid>
                            </div>
                        </Card>
                    ))}
                    
                    {/*###################### Loading state review cards ########################### */}
                    {(isLoadingReview) ? (
                        <div>
                            <Card className="reviewCards">
                                <Skeleton animation="wave" style={{height: "150px"}}/>
                            </Card>
                            <Card className="reviewCards">
                                <Skeleton animation="wave" style={{height: "150px"}}/>
                            </Card>
                            <Card className="reviewCards">
                                <Skeleton animation="wave" style={{height: "150px"}}/>
                            </Card>
                            <Card className="reviewCards">
                                <Skeleton animation="wave" style={{height: "150px"}}/>
                            </Card>
                            <Card className="reviewCards">
                                <Skeleton animation="wave" style={{height: "150px"}}/>
                            </Card>
                        </div>
                    ) : (<div></div>)}
                </Grid>
                <Grid item xs={12} sm={5} md={4}>
                    {(business_data.business_id && !isLoadingBusiness) ? (
                    <div>
                        {/* ####################### Business Info Card #################### */}
                        <Card className="businessCard">
                            <div className="businessCardContents">
                                <CardMedia src={business_data.photo} component="img"
                                            title="images" />
                                <h2 style={{marginTop: "10px"}}>{business_data.name}</h2>
                                <div className="starsAndReviewCount">
                                    {retrieve_stars(business_data.stars)}
                                    <p>{business_data.review_count + " reviews"}</p>
                                </div>
                                <div className="businessCardCategories" >
                                    <p>{getPriceRange(business_data.attributes.RestaurantsPriceRange2)} • &nbsp;</p>
                                    <p>{filterCategories(business_data.categories)}</p>
                                </div>
                                {openCloseToday(business_data.hours)}
                            </div>
                        </Card>
                        {/* ####################### Business Map & Location Card #################### */}
                        <Card className="businessCard">
                            <div className="mapContainer">
                                <h2>Location & Hours</h2>
                                {viewport.latitude ? (
                                <div className="map">
                                <ReactMapGL {...viewport}
                                    mapStyle="mapbox://styles/jsantoso2/ckdm7wkmr2ttv1imov4f6zot3"
                                    mapboxApiAccessToken={"pk.eyJ1IjoianNhbnRvc28yIiwiYSI6ImNrZG01eXZiYjE1N2kyeHBtaDNpanIzcGIifQ.lPtC048cZ-579QuODJc_vQ"}
                                    onViewportChange={viewport => {setViewport(viewport);}}>
                                    <Marker key={0} latitude={business_data.latitude} longitude={business_data.longitude}>
                                        <button className="marker-btn" onClick={(e) => {
                                            e.preventDefault();
                                            setSelectedPin(business_data.business_id);
                                        }}>
                                            <img src={yelp_icon} alt="yelp_icon" />
                                        </button>
                                    </Marker>
                                    
                                    {selectedPin ? (
                                        <Popup latitude={business_data.latitude} longitude={business_data.longitude}
                                            onClose={() => setSelectedPin(null)}>
                                            <div>
                                                <h2>{business_data.name}</h2>
                                                <p>{business_data.address}</p>
                                            </div>
                                        </Popup>
                                    ) : null }
                                </ReactMapGL>

                                <h4>{business_data.address}</h4>
                                <p><strong>{business_data.city + ", " + business_data.state + " " + business_data.postal_code}</strong></p>
                                <div className="operatingHours">
                                    <p><strong>Mon &nbsp;</strong>{business_data.hours.Monday}</p>
                                    <p><strong>Tue &nbsp;&nbsp;&nbsp;</strong>{business_data.hours.Tuesday}</p>
                                    <p><strong>Wed &nbsp;</strong>{business_data.hours.Wednesday}</p>
                                    <p><strong>Thu &nbsp;&nbsp;</strong>{business_data.hours.Thursday}</p>
                                    <p><strong>Fri &nbsp;&nbsp;&nbsp;&nbsp;</strong>{business_data.hours.Friday}</p>
                                    <p><strong>Sat &nbsp;&nbsp;&nbsp;</strong>{business_data.hours.Saturday}</p>
                                    <p><strong>Sun &nbsp;&nbsp;</strong>{business_data.hours.Sunday}</p>
                                </div>
                                </div>) : (
                                    <div></div>
                                )}
                            </div>
                        </Card>
                        {/* ####################### Business Attributes Card #################### */}
                        <Card className="businessCard">
                            <div className="businessCardContents">
                                <h2 className="businessCardAmenities">Amenities</h2>
                                {preprocessAttributes(business_data.attributes)}
                            </div>
                        </Card>
                    </div>
                    ) : (isLoadingBusiness) ? (
                        <div>
                        <Card className="businessCard">
                            <Skeleton animation="wave" style={{height: "200px"}}/>
                        </Card>
                        <Card className="businessCard">
                            <Skeleton animation="wave" style={{height: "200px"}}/>
                        </Card>
                        <Card className="businessCard">
                            <Skeleton animation="wave" style={{height: "200px"}}/>
                        </Card>
                        </div>
                    ) : (<div></div>)} 
                </Grid>
            </Grid>
        </div>
    );
}
 
export default Business;
