//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
  name: "Welcome to your todolist!"
});

const item2 = new Item ({
  name: "Hit the + button to add a new item."
});

const item3 = new Item ({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

// Use async/await for handling promises
(async function insertDefaultItems() {
  try {
    const foundItems = await Item.find({});
    if (foundItems.length === 0) {
      await Item.insertMany(defaultItems);
      console.log("Successfully Saved Default Items To Database");
    }
  } catch (err) {
    console.log(err);
  }
})();

app.get("/", async function(req, res) {
  try {
    const foundItems = await Item.find({});
    res.render("list", {listTitle: "Today", newListItems: foundItems});
  } catch (err) {
    console.log(err);
  }
});

app.post("/", async function(req, res){
  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  try {
    await item.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.get("/work", function(req, res){
  res.render("list", {listTitle: "Work List", newListItems: []}); // You need to define 'workItems'
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
