import React from 'react';
import { Link } from 'gatsby';

import fofStyles from './404.module.scss'
import Head from '../components/head';
// import Layout from '../components/layout';

const NotFound = () => {
    return (
            <div>
            <Head title="404" link="https://fonts.googleapis.com/css2?family=Lato&display=swap"/>
                
                
            <div id={fofStyles.main}>
                
    	        <div className={fofStyles.fof}>
        		    <h1>Error 404</h1>
                    <Link to="/">Head Home</Link>
    	        </div>
            </div>
            </div>
        
    )
}

export default NotFound;