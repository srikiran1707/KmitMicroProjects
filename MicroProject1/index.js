var express = require("express");
var bodyParser = require("body-parser");
var app = express();
let middleware = require("./middleware.js");
let server = require("./server.js");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017";
const dbName = "HospitalInfo";
const Vents = "Vents";
const Hos = "Hos";
let db;
MongoClient.connect(
  url,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err, client) => {
    db = client.db(dbName);
    app.get("/showAllHos", middleware.checkToken, (req, res) => {
      db.collection(Hos)
        .find()
        .toArray()
        .then((result) => res.json(result));
    });
    app.get("/showAllVents", middleware.checkToken, (req, res) => {
      db.collection(Vents)
        .find()
        .toArray()
        .then((result) => res.json(result));
    });
    app.post("/vStatus", middleware.checkToken, (req, res) => {
      db.collection(Vents)
        .find({ status: req.body.status })
        .toArray()
        .then((result) => res.json(result));
    });
    app.post("/vStatusByHName", middleware.checkToken, (req, res) => {
      db.collection(Vents)
        .find({ name: req.body.hospname })
        .toArray()
        .then((result) => res.json(result));
    });
    app.post("/hosDetailsByHName", middleware.checkToken, (req, res) => {
      db.collection(Hos)
        .find({ name: req.body.hospname })
        .toArray()
        .then((result) => res.json(result));
    });
    app.post("/addNewVent", middleware.checkToken, (req, res) => {
      db.collection(Vents).insert({
        hId: req.body.nhId,
        ventilatorId: req.body.nvId,
        status: req.body.nstatus,
        name: req.body.nname,
      });
    });
    app.put("/updateVentStatus", middleware.checkToken, (req, res) => {
      db.collection(Vents)
        .updateOne(
          { ventilatorId: req.body.ventId },
          { $set: { status: req.body.ventStatus } }
        )
        .then(() =>
          res.json({
            message: "Done",
          })
        );
    });
    app.delete("/removeVent", middleware.checkToken, (req, res) => {
      db.collection(Vents)
        .deleteOne({ ventilatorId: req.body.vId })
        .then(() =>
          res.json({
            message: "Done",
          })
        );
    });
  }
);
app.listen(1010);
