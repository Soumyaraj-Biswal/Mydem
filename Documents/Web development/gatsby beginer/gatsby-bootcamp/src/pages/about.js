import React from 'react';
import {Link} from 'gatsby';
import Head from '../components/head';
import Layout from '../components/layout';

const AboutPage = () => {
    return (
        <Layout>
            <Head title="About" />
            <h1>About</h1>
            <p>kashdjhsdfkjhgfkhsagfgksdgfkjagjfgajkghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhsf</p>
            <p>Want to work with me<Link to="/contact">Contact on</Link></p>
            
        </Layout>
    )
}

export default AboutPage