import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

// components and CSS imports
import Header from './header';
import './users.css';

// Images Import
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

// Material UI imports
import { Grid, Card } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

// Render user page
function Users (props){
    // get user_id from props
    const user_id = props.rp.match.params.id;

    // react hooks to store user data
    const [user_data, setUserData] = useState({});

    // react hooks to store user reviews
    const [user_reviews, setUserReviews] = useState([]);

    // react hooks to keep track of loading state
    const [isLoadingUser, setLoadingUser] = useState(true);
    const [isLoadingReview, setLoadingReview] = useState(true);


    // fetch user data and user reviews. Rerenders once user id (dependencies) changes.
    useEffect(() => {
        // fetch user data
        fetch('https://yelp-sentiment-backend-286616.ue.r.appspot.com/getOneUserData?user_id=' + user_id, {mode: 'cors'}).then(res => res.json()).then(data => {
            setUserData(data);
            setLoadingUser(false);
        }).catch(() => {
            console.log("Error fetch getOneUserData in users.js");
            setLoadingUser(true);
        })

        // fetch user reviews
        fetch('https://yelp-sentiment-backend-286616.ue.r.appspot.com/getOneUserReview?user_id=' + user_id, {mode: 'cors'}).then(res => res.json()).then(data => {
            setUserReviews(data);
            setLoadingReview(false);
        }).catch(() => {
            console.log("Error fetch getOneUserReview in users.js");
            setLoadingReview(true);
        })

        // Fake data 
        /*setUserData({
            "average_stars": 3.5,
            "cool": 0,
            "elite": "2010,2011,2012,2013,2014,2015,2016,2017,2018",
            "fans": 0,
            "friends": 4,
            "funny": 0,
            "id": 700,
            "name": "Kelly",
            "profile_pic": "https://bestnycacupuncturist.com/wp-content/uploads/2016/11/anonymous-avatar-sm.jpg",
            "review_count": 2,
            "useful": 0,
            "user_id": "Iq9EiUS7FmFB6Uw3PBghsQ",
            "yelping_since": "October 2015"
          });
        
        setUserReviews(
            [
                {
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
                  "cool": 0,
                  "country": "US",
                  "date": "11/30/2016",
                  "funny": 0,
                  "hours": {
                    "Friday": "10:0-2:0",
                    "Monday": "10:0-2:0",
                    "Saturday": "10:0-2:0",
                    "Sunday": "11:0-2:0",
                    "Thursday": "10:0-2:0",
                    "Tuesday": "10:0-2:0",
                    "Wednesday": "10:0-2:0"
                  },
                  "id": 8,
                  "is_open": 1,
                  "latitude": 40.4272666,
                  "longitude": -79.9687359,
                  "name": "Excuses Bar & Grill",
                  "photo": "http://blog.caesars.com/las-vegas/wp-content/uploads/2019/04/favorite-bistro-patio2-720x540.jpg",
                  "postal_code": "15203",
                  "rating": 5,
                  "review_count": 35,
                  "stars": 4,
                  "state": "PA",
                  "text": "Love the wings!! And the daytime bartender is super sweet when we order take out so thank you :)",
                  "useful": 0,
                  "user_id": "Iq9EiUS7FmFB6Uw3PBghsQ"
                }
              ]
        )*/
    }, [user_id]);
    

    // function to retrieve stars image based on ratings
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

    // function to get $ signs based on business priceratings2
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

    // preprocess and filter categories (Remove unwanted ones)
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
    

    return (
        <div>
            {/*###################### Header ##########################*/}
            <Header />
            <Grid container spacing={0}>
                <Grid item xs={12} sm={7} md={8}>
                    {/*###################### User Reviews ##########################*/}
                    <h2 style={{margin: "20px", color: "#d32323"}}>Reviews </h2>
                    {user_reviews.map(review => (
                        <Card className="reviewCards" key={review.id}>
                            <div className="reviewCardContents" >
                                <div className="reviewCardContentsHeader">
                                    <img className="reviewAvatar" src={review.photo} alt="businessphoto"/>
                                    <div>
                                        <Link to={`/business/${review.business_id}`}>
                                            <h3>{review.name}</h3>
                                        </Link>
                                        <div style={{display: "flex", alignItems: "center", fontSize: "75%"}}>
                                            <p>{getPriceRange(review.attributes.RestaurantsPriceRange2)} • &nbsp;</p>
                                            <p>{filterCategories(review.categories)}</p>
                                        </div>
                                        <p style={{fontSize: "85%"}}>{review.address}</p>
                                        <p style={{fontSize: "85%"}}>{review.city + ", " + review.state + " " + review.postal_code}</p>
                                    </div>
                                </div>   
                                <div style={{display: "flex", alignItems: "center", marginTop: "10px"}}>
                                    {retrieve_stars(review.rating)}
                                    <p>{review.date}</p>
                                </div>
                                <p style={{marginBottom: "10px"}}>{review.text}</p>
                                <div className="funnyusefulcoolicons">
                                    <svg>
                                        <path d="M12 1a11 11 0 0 1 11 11c0 6.075-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1zm0 20a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-15.82a5.56 5.56 0 0 1 3 10.26V17a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1.56a5.56 5.56 0 0 1 3-10.26zM11 17h2v-1h-2v1zm2.56-3a3.58 3.58 0 1 0-3.12 0h3.12z"></path>
                                    </svg>
                                    <p>{"Useful " + review.useful}</p>
                                    <svg>
                                        <path d="M12 23C5.925 23 1 18.075 1 12S5.925 1 12 1s11 4.925 11 11a11 11 0 0 1-11 11zm0-20a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-4.5 8a1.5 1.5 0 0 1 3 0h-3zm6 0a1.5 1.5 0 0 1 3 0h-3zm-7.21 2h11.46a.26.26 0 0 1 .25.29c-.57 3.25-3 5.71-6 5.71s-5.43-2.46-5.96-5.71a.26.26 0 0 1 .25-.29z"></path>
                                    </svg>
                                    <p>{"Funny " + review.funny}</p>
                                    <svg>
                                        <path d="M12 23C5.925 23 1 18.075 1 12S5.925 1 12 1s11 4.925 11 11a11 11 0 0 1-11 11zm0-20a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-7.48 7.56a.43.43 0 0 1 .41-.56h14.14a.43.43 0 0 1 .41.56l-.85 2.53a3 3 0 0 1-2.8 2 3 3 0 0 1-2.8-2l-.28-.85a.8.8 0 0 0-.75-.54.8.8 0 0 0-.75.54l-.28.85a3 3 0 0 1-2.8 2 3 3 0 0 1-2.8-2l-.85-2.53zm3.18 5.63a16.3 16.3 0 0 0 8.6 0 .25.25 0 0 1 .26.39A5.71 5.71 0 0 1 12 19a5.71 5.71 0 0 1-4.56-2.42.25.25 0 0 1 .26-.39z"></path>
                                    </svg>
                                    <p>{"Cool " + review.cool}</p>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {/*########################### display when loading state ##################### */}
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
                        </div>
                    ) : (<div></div>)}

                </Grid>
                {/*###################### User Profile Card ##########################*/}
                <Grid item xs={12} sm={5} md={4}>
                    {(!isLoadingUser) ? (
                        <Card className="profileCard">
                            <div className="profileCardContents">
                                <img src={user_data.profile_pic} style={{maxHeight: "250px", marginBottom: "10px"}} alt="https://bestnycacupuncturist.com/wp-content/uploads/2016/11/anonymous-avatar-sm.jpg" />
                                <h2>{user_data.name}</h2>
                                <div style={{display: "flex", alignItems: "center", marginTop: "10px", marginBottom: "10px"}}>
                                    {user_data.elite ? (
                                        user_data.elite.split(",").slice(-5).map(yearElite => {
                                            return (<div className="eliteBlock" key={yearElite}>Elite '{yearElite.slice(-2)}</div>);
                                        })
                                    ) : <div></div>}
                                </div>
                                <div className="profileIcons">
                                    <svg>
                                        <path d="M10.824 13.817l-2.482 5.946c-.69 1.65-2.995 1.65-3.684 0l-2.482-5.946C1.618 12.48 2.586 11 4.018 11h4.964c1.432 0 2.4 1.48 1.842 2.817zM6.5 9a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"></path>
                                        <path d="M21.824 13.817l-2.482 5.946c-.69 1.65-2.995 1.65-3.684 0l-2.482-5.946c-.558-1.337.41-2.817 1.842-2.817h4.964c1.432 0 2.4 1.48 1.842 2.817zM17.5 9a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"></path>
                                    </svg>
                                    <p>{user_data.friends + " Friends"}</p>
                                    <svg >
                                        <path d="M21 6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6zm-5.88 10.428l-3.16-1.938-3.05 2.01.59-3.457L7 10.596l3.457-.505L11.96 6.5l1.582 3.59 3.458.506-2.5 2.447.62 3.385z"></path>
                                    </svg>
                                    <p>{user_data.review_count + " Reviews"}</p>
                                    <svg>
                                        <path d="M19 20H5a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h2.184A2.99 2.99 0 0 1 10 4h4a2.99 2.99 0 0 1 2.816 2H19a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3zM12.005 8.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zm0 7a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"></path>
                                    </svg>
                                    <p>{"0 Photos"}</p>
                                </div>
                                <br/>
                                <p style={{marginBottom: "10px"}}> <strong>Average Stars: </strong>{user_data.average_stars}</p>
                                <p><strong>Review Votes: </strong></p>
                                    <div className="funnyusefulcoolicons_user">
                                        <svg style={{viewBox:"0 0 100 100"}}>
                                            <path d="M12 1a11 11 0 0 1 11 11c0 6.075-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1zm0 20a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-15.82a5.56 5.56 0 0 1 3 10.26V17a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1.56a5.56 5.56 0 0 1 3-10.26zM11 17h2v-1h-2v1zm2.56-3a3.58 3.58 0 1 0-3.12 0h3.12z"></path>
                                        </svg>
                                        <p>{"Useful " + user_data.useful}</p>
                                        <svg style={{viewBox:"0 0 100 100"}}>
                                            <path d="M12 23C5.925 23 1 18.075 1 12S5.925 1 12 1s11 4.925 11 11a11 11 0 0 1-11 11zm0-20a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-4.5 8a1.5 1.5 0 0 1 3 0h-3zm6 0a1.5 1.5 0 0 1 3 0h-3zm-7.21 2h11.46a.26.26 0 0 1 .25.29c-.57 3.25-3 5.71-6 5.71s-5.43-2.46-5.96-5.71a.26.26 0 0 1 .25-.29z"></path>
                                        </svg>
                                        <p>{"Funny " + user_data.funny}</p>
                                        <svg style={{viewBox:"0 0 100 100"}}>
                                            <path d="M12 23C5.925 23 1 18.075 1 12S5.925 1 12 1s11 4.925 11 11a11 11 0 0 1-11 11zm0-20a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-7.48 7.56a.43.43 0 0 1 .41-.56h14.14a.43.43 0 0 1 .41.56l-.85 2.53a3 3 0 0 1-2.8 2 3 3 0 0 1-2.8-2l-.28-.85a.8.8 0 0 0-.75-.54.8.8 0 0 0-.75.54l-.28.85a3 3 0 0 1-2.8 2 3 3 0 0 1-2.8-2l-.85-2.53zm3.18 5.63a16.3 16.3 0 0 0 8.6 0 .25.25 0 0 1 .26.39A5.71 5.71 0 0 1 12 19a5.71 5.71 0 0 1-4.56-2.42.25.25 0 0 1 .26-.39z"></path>
                                        </svg >
                                        <p>{"Cool " + user_data.cool}</p>
                                    </div>
                                <br/>
                                <p><strong>Yelping Since: </strong> {user_data.yelping_since}</p>
                            </div>
                        </Card>
                    ) : (
                        <Card className="profileCard">
                            <Skeleton animation="wave" style={{height: "200px"}}/>
                        </Card>
                    )}
                </Grid>
            </Grid>
        </div>
    );
}
  
export default Users;