// 
// Global Packages
// 
const   express     = require("express"), 
        bodyParser  = require("body-parser"),
        app         = express();

// 
// Set Variables
// 

// 
// Routes
// 
app.route("/")
.get((req,res) => {
    res.send("Hello World");
});


// 
//  Listen
// 
app.listen(process.env.PORT || 3000, () => {
    console.log("TodoList App Operational, running on PORT 3000!")
});