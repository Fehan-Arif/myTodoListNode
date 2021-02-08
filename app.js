// 
// Global Packages
// 
const   express                 = require("express"), 
        bodyParser              = require("body-parser"),
        mongoose                = require("mongoose"),
        session                 = require("express-session"),
        passport                = require("passport"),
        passportLocalMongoose   = require("passport-local-mongoose"),
        app                     = express();


// 
// connect mongoose 
// 
mongoose.connect('mongodb://localhost:27017/todoList', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  });

// 
// Set Variables
// 
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
    secret: "Who dat",
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());


const list = ["buy groceries", "make dinner"];

//
// User Schema 
// 
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    Items: [{
        name: String
    }]
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
// Routes
// 
app.route("/")
.get((req,res) => {
    res.render("landing");
});

app.route("/list")
.get((req,res) => {
    res.render("list", {listItem: list});
})
.post((req,res)=> {
    let newItem = req.body.newItem;
    list.push(newItem);
    res.redirect("/list")
})
.delete((req,res)=>{

});


app.route("/login")
.get((req,res)=>{
    res.render("login");
});


app.route("/register")
.get((req,res)=>{
    res.render("register");
});
// 
//  Listen
// 
app.listen(process.env.PORT || 3000, () => {
    console.log("TodoList App Operational, running on PORT 3000!")
});