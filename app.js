//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require('lodash');
const { indexOf } = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://tugrulsubekci:VpyaoxwZVwv9xRt9@blacklash.l3efeyb.mongodb.net/blogExample?authMechanism=DEFAULT', {useNewUrlParser: true});

const postSchema = new mongoose.Schema({
  title: String,
  content: String
})

const Post = mongoose.model('Post', postSchema);

app.get('/', async (req, res) => {
  const savedPosts = await Post.find();

  res.render("home.ejs", {
    homeParagraph : homeStartingContent,
    posts : savedPosts
  });

});

app.get('/about', (req, res) => {
  res.render("about.ejs", {
    aboutParagraph : aboutContent
  });
});

app.get('/contact', (req, res) => {
  res.render("contact.ejs", {
    contactParagraph : contactContent
  });
});
app.get('/compose', (req, res) => {
  res.render("compose.ejs");
});

app.post("/compose", async (req, res) => {
  var newPost = new Post({
    title: req.body.titleText,
    content: req.body.postText
  });

  await newPost.save();

  res.redirect("/");
});

app.get("/posts/:postTitle", async (req, res) => {
  console.log(req.params.postTitle);

  let postObjects = await Post.find();
  let titles = [];

  postObjects.forEach((postObject) => {
    let title = lodash.replace(lodash.lowerCase(postObject.title)," ", "-") ;
    titles.push(title);
  });

  let param = lodash.replace(lodash.lowerCase(req.params.postTitle)," ", "-");
  
  if(titles.includes(param)) {
    let index = lodash.indexOf(titles,param);
    res.render("post", {
      title : postObjects[index].title,
      paragraph : postObjects[index].content
    })
  }
});

let PORT = process.env.PORT

if(PORT === undefined || PORT === null || PORT === "") {
  PORT = 3000;
}

app.listen(PORT, function() {
  console.log("Server started on port "+ PORT);
});
