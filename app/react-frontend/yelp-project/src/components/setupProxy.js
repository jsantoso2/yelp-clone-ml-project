// const proxy = require("http-proxy-middleware");

// module.exports = function(app) {
//     app.use(
//         proxy("/getOneBusinessData", {
//             target: "https://yelp-sentiment-backend.ue.r.appspot.com",
//             changeOrigin: true
//         })
//     );
    
//     app.use(
//         proxy("/getOneBusinessReview", {
//             target: "https://yelp-sentiment-backend.ue.r.appspot.com",
//             changeOrigin: true
//         })
//     );

// }