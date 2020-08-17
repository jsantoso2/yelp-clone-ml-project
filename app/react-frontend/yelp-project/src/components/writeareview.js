import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import ReactStarsRating from 'react-awesome-stars-rating';

// compononents and CSS imports
import './writeareview.css';

// images imports
import yelp_logo from '../images/yelp_logo.png';
import five from '../images/five.JPG';
import four from '../images/four.JPG';
import three from '../images/three.JPG';
import two from '../images/two.JPG';
import one from '../images/one.JPG';

// Material UI Imports for dialogs
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// Material UI imports
import {Card, Grid, Button, LinearProgress, Box, CircularProgress } from '@material-ui/core';

// renders page for users to write reviews
function WriteAReview (props){
    // business id and user id passed in as props
    const business_id = props.rp.match.params.bid;
    const user_id = props.rp.match.params.uid
    
    // use History to redirect to business page after successful post
    const history = useHistory();

    // hooks to keep track of star change
    const [starval, setStarval] = useState(0);

    // function to change stars
    const starsOnChange = (value) => { setStarval(value); };

    // hooks for input text field
    const [currText, setCurrText] = useState("");

    // hooks for prediction 
    const [currPrediction, setCurrPrediction] = useState(0);
    const [currPredictionProba, setCurrPredictionProba] = useState([0,0,0,0,0]);

    // function to change stars
    const textOnChange = (e) => { setCurrText(e.target.value); };

    // hooks for business data
    const[business_data, setBusinessData] = useState({});

    // hooks for loading state
    const[isLoading, setLoading] = useState(false);

    // hooks and method to set dialog to open/close
    const [isopenDialog, setIsOpenDialog] = useState(false);
    const handleClose = () => { setIsOpenDialog(false); };


    // fetch business data from API which rerenders after changing business_id (dependencies)
    useEffect(() => {
        fetch('https://yelp-sentiment-backend-286616.ue.r.appspot.com/getOneBusinessData?business_id=' + business_id, {mode: 'cors'}).then(res => res.json()).then(data => {
            setBusinessData(data);
        })

        // Fake data
        /*setBusinessData(
            {"address": "address", 
            "business_id": business_id,
            "categories": "categories",
            "city": "city",
            "hours": "hours",
            "latitude": 37.7749,
            "longitude": -122.4194,
            "name": "name",
            "photo": "http://blog.caesars.com/las-vegas/wp-content/uploads/2019/04/favorite-bistro-patio2-720x540.jpg",
            "postal_code": "postalcode",
            "review_count": 10,
            "stars": 4,
            "state": "state" }
        );*/

    }, [business_id]);


    // handle getPrediction click
    const getPredictionClick = () => {
        // set current loading state to true
        setLoading(true);
        // fetch predict from API -> save current prediction -> set loading to false
        fetch('https://yelp-sentiment-backend-286616.ue.r.appspot.com/predict', {mode: 'cors', method: "POST", body: JSON.stringify({"text": currText}), headers: { "Content-Type": "application/json"} }).then(res => res.json()).then(data => {
            setCurrPrediction(data["ratings"]);
            setCurrPredictionProba(data["proba"].map(proba => parseFloat((proba*100).toFixed(1))));  //returns back decimals need to multiply by 100 and round to 1 decimal 
            setLoading(false);
        });
    }

    // handle post review
    const handlePostReview = () => {
        // if user_id is currently null -> not allowed to post review
        if (user_id === "null" || starval === 0 || currText === ""){
            setIsOpenDialog(true);
        } else {
            // post user review to database
            const currdate = new Date();
            const posting_data = {
                "business_id": business_id,
                "cool": 0,
                "date": currdate.getFullYear() + "-" +(currdate.getMonth()+1) + "-" + currdate.getDate() + " " + currdate.getHours() + ":" + currdate.getMinutes() + ":" + currdate.getSeconds(),
                "funny": 0,
                "id": 9999,
                "rating": starval,
                "text": currText,
                "useful": 0,
                "user_id": user_id
            }

            fetch('https://yelp-sentiment-backend-286616.ue.r.appspot.com/postreview', {mode: 'cors', method: "POST", body: JSON.stringify(posting_data), headers: { "Content-Type": "application/json"} }).then(res => res.json()).then(data => {
                history.push(`/business/${business_id}`);
            });
        }
    }
    
    return (
        <div>
            {/*######################### Header ###################*/}
            <div className = "header">
                <Link to='/'>
                    <img src = {yelp_logo} alt = "logo" />
                </Link>
                <h2>Write a Review</h2>
            </div>
            <Grid container spacing={0}>
                <Grid item xs={1} sm={2}>
                </Grid>
                {/*######################### Post Review Card ###################*/}
                <Grid item xs={10} sm={8}>
                    <Link to={`/business/${business_data.business_id}`}>
                        <h2 className="businessNameLink">{business_data.name}</h2>
                    </Link>
                    {/*######################### Interactive Stars, review text, and post button area ###################*/}
                    <Card>
                        <div className="inputTextCardContents">
                            <h2>Rate it! </h2>
                            <div className="starsAndButton">
                                <ReactStarsRating onChange={starsOnChange} value={starval} isHalf={false} 
                                            primaryColor={"white"} secondaryColor={"#adadad"} starGap={3} size={30} className="starsInputButton"/>
                                {/*<Link to={`/business/${business_data.business_id}`}>*/}
                                    <Button style={{background: "#f43939", color: "white", marginLeft: "30px"}} onClick={handlePostReview}>Post Review</Button>
                                {/*</Link>*/}
                            </div>
                            <h3 style={{marginTop: "20px", marginBottom: "20px"}}>{"Rated: " + starval + " Stars"}</h3>
                            <textarea type="text" value={currText} onChange = {textOnChange} placeholder="Input your reviews here!" 
                                        className="inputTextField" />
                        </div>
                    </Card>
                    {/*######################### Prediction Card Area ###################*/}
                    <Card>
                        <div className="inputTextCardContents">
                            <h2>Review Predictions </h2>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <Button style={{backgroundColor: "#f43939", color: "white", marginRight: "20px"}} onClick={getPredictionClick}>Get Prediction</Button>
                                {(isLoading) ? <CircularProgress color="secondary" size="2rem"/> : <div></div>} 
                            </div>
                            <h3 style={{marginTop: "20px"}}>{"Ratings Predicted: " + currPrediction}</h3>
                            <h3 style={{marginTop: "20px"}}>Probabilities: </h3>
                            <div className="predictedProba">
                                <img src={five} alt="5* rating" className="starsStyleImage" />
                                <Box width="100%" mr={1}>
                                    <LinearProgress variant="determinate" value={currPredictionProba[4]} color="secondary" style={{backgroundColor: "#d3d3d3"}}/>
                                </Box>
                                <Box minWidth={35}>
                                    <p>{currPredictionProba[4] + "%"}</p>
                                </Box>
                            </div>
                            <div className="predictedProba">
                                <img src={four} alt="4* rating" className="starsStyleImage" />
                                <Box width="100%" mr={1}>
                                    <LinearProgress variant="determinate" value={currPredictionProba[3]} color="secondary" style={{backgroundColor: "#d3d3d3"}}/>
                                </Box>
                                <Box minWidth={35}>
                                    <p>{currPredictionProba[3] + "%"}</p>
                                </Box>
                            </div>
                            <div className="predictedProba">
                                <img src={three} alt="3* rating" className="starsStyleImage" />
                                <Box width="100%" mr={1}>
                                    <LinearProgress variant="determinate" value={currPredictionProba[2]} color="secondary" style={{backgroundColor: "#d3d3d3"}}/>
                                </Box>
                                <Box minWidth={35}>
                                    <p>{currPredictionProba[2] + "%"}</p>
                                </Box>
                            </div>
                            <div className="predictedProba">
                                <img src={two} alt="2* rating" className="starsStyleImage" />
                                <Box width="100%" mr={1}>
                                    <LinearProgress variant="determinate" value={currPredictionProba[1]} color="secondary" style={{backgroundColor: "#d3d3d3"}}/>
                                </Box>
                                <Box minWidth={35}>
                                    <p>{currPredictionProba[1] + "%"}</p>
                                </Box>
                            </div>
                            <div className="predictedProba">
                                <img src={one} alt="1* rating" className="starsStyleImage" />
                                <Box width="100%" mr={1}>
                                    <LinearProgress variant="determinate" value={currPredictionProba[0]} color="secondary" style={{backgroundColor: "#d3d3d3"}}/>
                                </Box>
                                <Box minWidth={35}>
                                    <p>{currPredictionProba[0] + "%"}</p>
                                </Box>
                            </div>
                        </div>
                    </Card>
                </Grid>
                <Grid item xs={1} sm={2}>
                </Grid>
            </Grid>

            {/*########################## Dialog to post review without logging in ##################### */}
            <Dialog open={isopenDialog} onClose={handleClose}>
                <DialogTitle id="alert-dialog-title">{"Error, Please check one of the following!"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        1) Please login in order to be able to post reviews!
                    </DialogContentText>
                    <DialogContentText>
                        2) Review Stars must range from 1 to 5!
                    </DialogContentText>
                    <DialogContentText>
                        3) Review Text cannot be empty!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus> Close </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}
  
export default WriteAReview;
