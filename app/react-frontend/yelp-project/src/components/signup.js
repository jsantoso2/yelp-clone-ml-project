import React, {useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import { useForm } from "react-hook-form";

// components and CSS
import './signup.css';

// images imports
import yelp_logo from '../images/yelp_logo.png';
import login_image from '../images/login_image.png';

// Material UI imports
import {Grid, Button, TextField } from '@material-ui/core';

// renders the signup page
function Signup(props){

    // use history hooks to redirect user after successful login
    const history = useHistory();

    // hooks for submit signup form
    const {register, handleSubmit} = useForm()

    // handle email and password error message and error state
    const [errorMsg, setErrorMsg] = useState({"email": "", "password": "", "firstname": "", "lastname": ""})
    const [errorState, setErrorState] = useState({"email": false, "password": false, "firstname": false, "lastname": false})

    // handle submit for signup button
    const processSubmit = (values) => {
        // checks valid email address pattern. Found on Stackoverflow
        const re = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/;
        
        // check if there are any missing fields
        if (values.email === "" && values.password === "" && values.firstname === "" && values.lastname === ""){
            setErrorMsg({"email": "Empty email address", "password": "Empty password", "firstname": "Empty firstname", "lastname": "Empty lastname"});
            setErrorState({"email": true, "password": true, "firstname": true, "lastname": true});
        } else if (values.password === "" && values.firstname === "" && values.lastname === ""){
            setErrorMsg({"email": "", "password": "Empty password", "firstname": "Empty firstname", "lastname": "Empty lastname"});
            setErrorState({"email": false, "password": true, "firstname": true, "lastname": true});
        } else if (values.email === "" && values.firstname === "" && values.lastname === ""){
            setErrorMsg({"email": "Empty email address", "password": "", "firstname": "Empty firstname", "lastname": "Empty lastname"});
            setErrorState({"email": true, "password": false, "firstname": true, "lastname": true});
        } else if (values.email === "" && values.password === "" && values.lastname === ""){
            setErrorMsg({"email": "Empty email address", "password": "Empty password", "firstname": "", "lastname": "Empty lastname"});
            setErrorState({"email": true, "password": true, "firstname": false, "lastname": true});
        } else if (values.email === "" && values.password === "" && values.firstname === ""){
            setErrorMsg({"email": "Empty email address", "password": "Empty password", "firstname": "Empty firstname", "lastname": ""});
            setErrorState({"email": true, "password": true, "firstname": true, "lastname": false});
        }
        
        // if at least first/lastname filled, and email and password is not missing proceed
        // Does check if email/password is missing
        if ((values.firstname !== "") || (values.lastname !== "")){
            if (re.test(values.email) === false && values.password === ""){
                setErrorMsg({"email": "Invalid Email address", "password": "Empty password"});
                setErrorState({"email": true, "password": true});
            } else if (values.email === ""){
                setErrorMsg({"email": "Empty email address", "password": ""});
                setErrorState({"email": true, "password": false});
            } else if (values.password === ""){
                setErrorMsg({"password": "Empty password"});
                setErrorState({"email": false, "password": true});
            } else if (re.test(values.email) === false){
                setErrorMsg({"email": "Invalid Email address", "password": ""});
                setErrorState({"email": true, "password": false});
            } else {
                // validate login from server
                fetch('https://yelp-sentiment-backend-286616.ue.r.appspot.com/signupuser', {mode: 'cors', method: "POST", body: JSON.stringify(values), headers: { "Content-Type": "application/json"} }).then(res => res.json()).then(data => {
                    if (data.message === "User Added!"){
                        // success signup
                        // redirect to home, and add user_id andd currname to sessionStorage
                        history.push("/");
                        sessionStorage.setItem('currname', data.name);
                        sessionStorage.setItem('user_id', data.user_id);
                    } else {
                        // try again and display error message
                        setErrorMsg({"email": "Error Please try again", "password": "Error Please try again", "firstname": "Error Please try again", "lastname": "Error Please try again"});
                        setErrorState({"email": true, "password": true, "firstname": true, "lastname": true});     
                    }
                }).catch(() => {
                    console.log("Error in validate login form in signupuser.js");
                });
            }
        } else {
            // try again and display error message
            setErrorMsg({"email": "Error Please try again", "password": "Error Please try again", "firstname": "Error Please try again", "lastname": "Error Please try again"});
            setErrorState({"email": true, "password": true, "firstname": true, "lastname": true});
        }
    }


    return (
        <div>
            {/*############################### Header #########################*/}
            <div className="loginHeader">
                <Link to='/'>
                    <img src = {yelp_logo} alt = "logo" />
                </Link>
            </div>
            <div>
                {/*############################### Sign up page #########################*/}
                <Grid container spacing={0} alignItems="center" justify="center">
                    <Grid item xs={1} sm={1} md={2}>
                    </Grid>
                    <Grid item xs={11} sm={5} md={4}>
                        <div style={{marginTop: "20%"}}>
                            <h2 style={{color: "#d32323", marginBottom: "10px"}}>Sign Up for Yelp</h2>
                            <p style={{marginBottom: "10px"}} ><strong>Connect with great local businesses</strong></p>
                            <p style={{fontSize: "70%", marginBottom: "10px"}}>By continuing, you agree to Yelp’s Terms of Service and acknowledge Yelp’s Privacy Policy.</p>
                            
                            {/*############################### Three buttons  #########################*/}
                            <div>
                            <Button style={{width: "18rem", backgroundColor: "black", color: "white", marginBottom: "10px", marginTop: "20px"}}>
                                Continue with Apple
                            </Button>
                            <Button style={{width: "18rem", backgroundColor: "#1877f2", color: "white", marginBottom: "10px"}}>
                                <svg style={{height: "22px", width: "22px", fill: "white", marginRight: "10px", marginBottom: "5px"}}>
                                    <path d="M22 12.06c0-5.522-4.477-10-10-10s-10 4.48-10 10c0 4.992 3.657 9.13 8.437 9.88v-6.99h-2.54v-2.89h2.54v-2.2c0-2.507 1.493-3.89 3.778-3.89 1.093 0 2.238.194 2.238.194v2.46h-1.26c-1.243 0-1.63.772-1.63 1.564v1.875h2.773l-.443 2.89h-2.33v6.99C18.343 21.19 22 17.05 22 12.06z"></path>
                                </svg>
                                Continue with Facebook
                            </Button>
                            <Button style={{width: "18rem", backgroundColor: "white", marginBottom: "10px"}} variant="outlined">
                                <img style={{marginRight: "10px", marginBottom: "5px"}} src="https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_styleguide/cae242fd3929/assets/img/structural/24x24_google_rainbow.png" alt="google_logo"/>
                                Continue with Google
                            </Button>
                            </div>

                            <p style={{fontSize: "70%", marginBottom: "10px", marginTop: "10px"}}>Don't worry, we never post without your permission.</p>
                            
                            {/*############################### Divider Line  ######################################*/}
                            <fieldset className="hr-line">
                                <legend style={{align: "center"}}>OR</legend>
                            </fieldset>

                            {/*############################### Signup Form  #########################*/}
                            <form noValidate onSubmit={handleSubmit(processSubmit)}>
                                <div style={{display: "flex", alignItems: "center"}}>
                                    <TextField style={{width: "9rem", marginTop: "10px", marginBottom: "10px"}} 
                                                name="firstname" id="firstname" label="First Name" variant="outlined" size="small" 
                                                inputRef={register}
                                                error={errorState.firstname}
                                                helperText={errorMsg.firstname}
                                    />
                                    <TextField style={{width: "9rem", marginTop: "10px", marginBottom: "10px"}} 
                                                name="lastname" id="lastname" label="Last Name" variant="outlined" size="small"
                                                inputRef={register}
                                                error={errorState.lastname}
                                                helperText={errorMsg.lastname}
                                    />
                                </div>
                                <TextField style={{width: "18rem", marginTop: "10px", marginBottom: "20px"}} 
                                            name="email" id="email" label="Email" variant="outlined" size="small" 
                                            inputRef={register}
                                            error={errorState.email}
                                            helperText={errorMsg.email}
                                />
                                <TextField style={{width: "18rem"}} 
                                            name="password" id="password" label="Password" variant="outlined" size="small" type="password"
                                            inputRef={register}
                                            error={errorState.password}
                                            helperText={errorMsg.password}
                                />
                                <p style={{fontSize: "70%", marginBottom: "10px", marginTop: "20px", paddingRight: "2rem"}}>You also understand that Yelp may send marketing emails about Yelp’s products, services, and local events. You can unsubscribe at any time.</p>
                                <Button style={{width: "18rem", marginTop: "20px", backgroundColor: "#d32323", color: "white"}} variant="contained" type="submit">
                                    Sign Up
                                </Button>
                            </form>
                            <p style={{marginBottom: "10px", marginTop: "10px", paddingLeft: "10rem", fontSize: "80%"}}>Already on Yelp? <Link to="/login"><span>Log in</span></Link></p>
                        </div>
                    </Grid>

                    {/*############################### Signup Image  #########################*/}
                    <Grid item xs={12} sm={6} md={4}>
                        <div style={{alignItems: "center", display: "flex", justifyContent: "center"}}>
                            <img className="loginImage" src = {login_image} alt = "login_pic" />
                        </div>
                    </Grid>
                    <Grid item xs={"auto"} sm={1} md={2}>
                    </Grid> 
                </Grid>
            </div>
        </div>
    );
}


export default Signup;

