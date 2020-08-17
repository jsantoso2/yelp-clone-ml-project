import React from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';

// components
import Home from './home';
import Users from './users';
import Business from './business';
import WriteAReview from './writeareview';
import Login from './login';
import Signup from './signup';


// specifies URL and routes to all the pages and parameters
class Main extends React.Component {

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={() => <Home />} />
                    <Route path="/users/:id" render={(routerProps) => <Users rp={routerProps}/>} />
                    <Route path="/business/:id" render = {routerProps => <Business rp={routerProps} />}/>
                    <Route path="/writeareview/:bid/:uid" render = {routerProps => <WriteAReview rp={routerProps} />}/>
                    <Route path="/login" component={() => <Login />} />
                    <Route path="/signup" component={() => <Signup />} />
                    <Redirect to ='/' />
                </Switch>
            </Router> 
        )
    }
}

export default Main;