var express    = require("express");
var app        = express();
var bodyparser = require("body-parser");
var mongoose   = require("mongoose");

app.use(bodyparser.urlencoded({extended: true}));

// tells Express where to find our CSS
app.use(express.static("public"));

// We can tell express to assume all files are EJS with: app.set("view engine", "ejs")
app.set("view engine", "ejs")

// Connect to Mongo Database
mongoose.connect("mongodb://localhost/market");

// Create schema object
var vendorSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String
})

// Create model object
var Vendor = mongoose.model("Vendor", vendorSchema);

// home page, display all vendors
app.get("/", function(req, res) {
  Vendor.find({}, function(err, vendors) {
    if(err) {
      console.log(err);
    } else {
      res.render("index", {vendors: vendors});
    }
  });
});

// create a new vendor
app.get("/addVendor", function(req, res) {
  res.render("addVendor");
});

app.post("/addVendor", function(req, res) {
  // get parameters from body
  var new_vendor_name        = req.body.vendor_name;
  var new_vendor_description = req.body.vendor_description;
  var new_vendor_img         = req.body.vendor_img;

  // create a vendor object
  var new_vendor = new Vendor({
    name: new_vendor_name,
    description: new_vendor_description,
    image: new_vendor_img
  });

  new_vendor.save(function(err, vendor){
    if(err) {
      console.log("Error: " + err);
    } else {
      // redirect back to root
      res.redirect("/");
    }
  })

});

app.listen("3000", function() {
  console.log("I'm listening on port 3000.")
});

