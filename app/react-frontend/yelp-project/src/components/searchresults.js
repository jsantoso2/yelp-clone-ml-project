import React from 'react';
import {Link} from 'react-router-dom';


// Search results that displays the search results
function SearchResults(props){
    // method that determines whether search results should be displayed or not
    const displayResults = (hideOption, business) => {
        if (hideOption === true){
            return (<div></div>);
        } else {
            return (business.map((b) => 
                    <Link to={`/business/${b.business_id}`} key={b.business_id}>
                        <div style={{}} key={b.business_id}>{b.name}</div>
                    </Link>
            ));
        }
    };

    // returns the search results
    return (
        <div style={{backgroundColor: "white", maxWidth: "20rem", margin: "0px 0px 0px 20px"}}>
            {displayResults(props.hideOption, props.business)}
        </div>
    );
}

export default SearchResults;