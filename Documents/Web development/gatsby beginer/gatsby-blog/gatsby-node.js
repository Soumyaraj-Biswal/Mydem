const path = require('path');

//creates a new node for each object  
// module.exports.onCreateNode = ({ node, actions}) => {
//     const { createNodeField} = actions;

//     if( node.internal.type === 'MarkdownRemark')
//     {
//         const slug = path.basename(node.fileAbsolutePath, '.md');
        
//         createNodeField({
//             node,
//             name: 'slug',
//             value: slug
//         });
//     }


// }

module.exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions; 

    // get path to template
    const blogTemplate = path.resolve( `./src/templates/blog.js`);

    //get markdown data
    const res = await graphql(`
    query{
        allContentfulBlogPost{
          edges{
            node{
              slug
              
            }
          }
        }
      }
    `);
    // create new pages
    res.data.allContentfulBlogPost.edges.forEach(edge => {
        createPage({
            component: blogTemplate,
            path: `/blog/${edge.node.slug}` ,
            context: {
                slug: edge.node.slug
            }
        })
    });
}