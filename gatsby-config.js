require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    siteUrl: "https://neta.money",
    title: "NETA Money | Decentralized Store of Value",
  },
  pathPrefix: "__GATSBY_IPFS_PATH_PREFIX__",
  plugins: [
    "gatsby-plugin-ipfs",
    "gatsby-plugin-material-ui",
    "gatsby-plugin-styled-components",
    "gatsby-plugin-image",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
  ],
};
