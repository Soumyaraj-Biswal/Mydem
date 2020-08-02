import React from 'react';
import Layout from '../components/layout';
import { graphql } from "gatsby";
import { documentToReactComponents} from '@contentful/rich-text-react-renderer';
import Head from '../components/head';

// export const query = graphql`
//     query ($slug: String!){
//         markdownRemark(
//             fields: {
//                 slug: {
//                     eq: $slug
//                 }
//             }
//         ) {
//             frontmatter{
//                 title
//                 date
//             }
//             html
//         }
//     }
// `

export const query = graphql`
    query($slug: String!){
        contentfulBlogPost(slug: {eq: $slug}){
            title
            publishedDate(formatString: "MMMM Do, YYYY")
            body{
                json
            }
        }
    }

`;


const Blog = (props) => {
    let options = {
        renderNode: {
          'embedded-asset-block': (node) =>{
            const data = node.data.target.fields.file['en-US'];
            const alt = data.title;
            const src = data.url;
            return <img alt={alt} src={src}/>
          }
        }
    }

    return (
        <Layout>
            <Head title={props.data.contentfulBlogPost.title} />
            <h1>{props.data.contentfulBlogPost.title}</h1>
            <i>{props.data.contentfulBlogPost.publishedDate}</i>
            {documentToReactComponents(props.data.contentfulBlogPost.body.json, options)}
        </Layout>
    );
}

export default Blog;