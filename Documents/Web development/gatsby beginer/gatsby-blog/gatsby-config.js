/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */
require("dotenv").config({
  path: `.env`,
})

module.exports = {
  /* Your site config here */
  siteMetadata: {
    title: 'Soumya-Raj Biswal',
    author: 'Soumyaraj Biswal'
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    //for using sass
    'gatsby-plugin-sass',
    //helps to make the local files in project available for graphql
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'src',
        path: `${__dirname}/src/`
      }
    },
    //image handling plugin
    'gatsby-plugin-sharp',

    //helps to parse markdown files and make them available in graphql
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-relative-images',
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 750,
              linkImagesToOriginal: false
            }
          }
        ]
      }
    },
    {
      //CONTENTFUL CMS PLUGIN
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: process.env.GATSBY_CONTENTFUL_SPACE_ID,
        // Learn about environment variables: https://gatsby.dev/env-vars
        accessToken: process.env.GATSBY_CONTENTFUL_ACCESS_TOKEN,
      }
    }

    
  ],
}
