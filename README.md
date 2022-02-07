# Yelp-Camp-Project
<img src="https://res.cloudinary.com/vivekcloud/image/upload/v1644219670/Yelp-Camp/hoyhvmb6rebsmoeeuasf.png" height="500" width="850">
<img src="https://res.cloudinary.com/vivekcloud/image/upload/v1644219672/Yelp-Camp/cr8lhafdwy1k2vawjqbd.png" height="500" width="850">
<img src="https://res.cloudinary.com/vivekcloud/image/upload/v1644219677/Yelp-Camp/ncqw7z79neneshsnpjq8.png" height="500" width="850">

YelpCamp is a website where users can create and review campgrounds. In order to review or create a campground, you need to have an account.
<br>
It is a web application where different users(read campers) can put in their comments and concerns, so that it is a well informed and well prepared camping trip for other users.

<h2> Live Demo </h2>
Got to https://frozen-waters-11960.herokuapp.com/
<br>
Username - user12345
<br>
Password - 12345

<h2> Features </h2>
<ul>
  <li>Authentication - Before creating/reviewing a campground, user needs to login/register. Authentication is handled using passport.js </li>
  <li>Authorization - The user cannot delete campgrounds or reviews made by other users as he is not authorized. </li>
  <li>
    Campground Features - 
    <ul>
      <li>Basic CRUD operations</li>
      <li>Upload campground photos while making a new campground or editing a campground.</l>
      <li>Delete existing campground photos.</li>
      <li>View location of a campground (with the help of maps) on the show page. Handled using mapbox.</li>
    </ul>
  </li>
  <li>Cluster Map - On the index page, a cluster map is provided, denoting density of campgrounds in a particular area.</li>
  <li>Interactive - Flash messages responding to users interaction with the app </li>
  <li>Responsive web design</li>
</ul>

<h2>Run It Locally</h2>
This app contains API secrets and passwords that have been hidden deliberately. However, if you want to run this locally, follow - 
<ul>
  <li>Install MongoDB</li>
  <li>
    Clone the repository and install dependencies.
    <br>
    <code> https://github.com/Vivekvar/Yelp-Camp-Project.git </code>
    <br>
    <code> cd yelpcamp </code>
    <br>
    <code> npm install </code>
  </li>
  <li>
    Create a cloudinary account to get an cloud name, API key and secret code. Make a .env file in the root of the project and add the following - 
    <br>
    <code> CLOUDINARY_CLOUD_NAME='cloudname' </code>
    <br>
    <code> CLOUDINARY_KEY='api_key' </code>
    <br>
    <code> CLOUDINARY_SECRET='secret_code' </code>
  </li>
  <li> Run <code>mongod</code>  in one terminal and <code>node app.js</code>  in another terminal. </li>
  <li> Go to <code>http://localhost:3000/</code> </li>
</ul>

<h2>Bulit With</h2>
<ul>
  <li>CSS</li>
  <li>Javascript</li>
  <li>Bootstrap</li>
  <li>Node</li>
  <li>Express</li>
  <li>MongoDB</li>
  <li>Mongoose</li>
  <li>EJS</li>
  <li>Mapbox</li>
  <li>Cloudinary</li>
  <li>Heroku</li>
  <li>Joi</li>
  <li>Passport</li>
  <li>Multer</li>
</ul>
