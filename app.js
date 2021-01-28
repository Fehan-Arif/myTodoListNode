// 
// Global Packages
// 
const   express     = require("express"), 
        bodyParser  = require("body-parser"),
        app         = express();

// 
// Set Variables
// 
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// 
// Routes
// 
app.route("/")
.get((req,res) => {
    res.render("landing");
});


// 
//  Listen
// 
app.listen(process.env.PORT || 3000, () => {
    console.log("TodoList App Operational, running on PORT 3000!")
});