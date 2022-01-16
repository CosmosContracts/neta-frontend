require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    siteUrl: "https://neta.money",
    title: "NETA Money | Decentralized Store of Value",
  },
  plugins: [
    "gatsby-plugin-material-ui",
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
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "NETA Money",
        short_name: "NETA",
        start_url: "/",
        background_color: "#F0827D",
        theme_color: "#F0827D",
        display: "standalone",
        icon: "src/images/favicon.png",
      },
    },
  ],
};
