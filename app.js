//
// Global Packages
//
const express = require("express"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  session = require("express-session"),
  passport = require("passport"),
  passportLocalMongoose = require("passport-local-mongoose"),
  app = express();

//
// connect mongoose
//
mongoose.connect("mongodb://localhost:27017/todoList", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

//
// Set Variables
//
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: "Who dat",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// const list = ["buy groceries", "make dinner"];

//
// Items Schema
//
const itemsSchema = new mongoose.Schema({
  type: mongoose.Schema.Types.ObjectId,
  name: String
});

itemsSchema.plugin(passportLocalMongoose);

const Item = mongoose.model("Item", itemsSchema);
//
// User Schema
//
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  items: [itemsSchema],
});

userSchema.plugin(passportLocalMongoose);

//
// model
//
const User = new mongoose.model("user", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//
// Landing Route
//
app.route("/").get((req, res) => {
  res.render("landing");
});

//
// List Route
//

app
  .route("/list")
  .get((req, res) => {
    if (req.isAuthenticated()) {
      const foundItems = req.user.items;
      res.render("list", { listItem: foundItems });
      // console.log(foundItems);
    } else {
      res.redirect("/");
    }
  })
  .post((req, res) => {
    const newItem = req.body.newItem;
    // console.log(newItem);
    const userName = req.user.username;
    const item = new Item({
      name: newItem
    });
    console.log(item);
    User.findOne({ username: userName }, function (err, foundUser) {
      // console.log(foundUser);
      if (foundUser.username === userName) {
        foundUser.items.push(item);
        foundUser.save();
        res.redirect("/list");
      } else {
        console.log(err);
        res.redirect("/list");
      } 
    });
  });

// 
// Delete Route 
// 
app
.route("/delete")
.post(function(req,res){
    console.log(req.body.checkbox);
    const checkedItem = req.body.checkbox;
    // console.log(req.body);
    // console.log(req.user);
    console.log(req.user.username);
    const loggedUser = req.user.username;
    // User.findOneAndUpdate({username: loggedUser}, {items:{_id: checkedItem}},null, function(err,
    User.findByIdAndUpdate(
      { items:{_id: checkedItem}},
      {
        _id: "",
        name: ""
      },
      function(err, foundUser){
      if(err){
        console.log(err);
      } else {
        console.log(foundUser.items);
        // foundUser.items.pull({_id: checkedItem});
        console.log(foundUser.items);
        res.redirect("/list");
      }
    });
});
  // app
  // .route("/delete")
  // .post((req,res)=>{
  //   // res.send("Delete post");
  //   console.log(req.body.checkbox);
  //   const userName = req.user.username;
  //   const checkedItem = req.body.checkbox;
  //   User.findOne({ username: userName }, function (err, foundUser) {
  //     if (foundUser.username === userName) {
  //      console.log(foundUser.items);
  //       res.redirect("/list");
  //       foundUser.findByIdAndDelete({_id: checkedItem}, function(err){
  //         if(!err){
  //           console.log(this);
  //           res.redirect("/list");
  //         }
  //       });
  //     } else {
  //       console.log(err);
  //       res.redirect("/list");
  //     } 
  //   });
  // });


  
  

//
// Login Route
//

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });
    req.login(user, (err) => {
      if (err) {
        console.log(err);
        res.redirect("/login");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/list");
        });
      }
    });
  });

//
// Register Route
//

app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    User.register(
      { username: req.body.username },
      req.body.password,
      (err, user) => {
        if (err) {
          console.log(err);
          res.redirect("register");
        } else {
          passport.authenticate("local")(req, res, () => {
            res.redirect("/list");
          });
        }
      }
    );
  });

//
//  Listen
//
app.listen(process.env.PORT || 3000, () => {
  console.log("TodoList App Operational, running on PORT 3000!");
});
