const express = require("express");
const connection = require("../connection");
const auth = require("../services/auth");
const role = require("../services/checkRole");

const router = express.Router();

router.post("/add", auth.authenticate, role.checkRole, (req, res) => {
  let event = req.body;
  let query =
    'insert into event (name, description, percentage, product_id, type , status) values(?,?,?,?,?,"true")';

  connection.query(
    query,
    [event.name, event.description, event.percentage, event.product_id , event.type],
    (err, results) => {
      if (!err) {
        return res.status(200).json({ message: "event added successfully" });
      } else {
        return res.status(500).json({ err });
      }
    }
  );
});

router.get("/get", auth.authenticate, (req, res, next) => {
  let query =
    "select e.id, e.name, e.description, e.percentage, e.product_id, e.type, e.status, p.id as product_id, p.name as productName from event as e INNER JOIN product as p where e.product_id=p.id ";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({ data: results });
    } else {
      return res.status(500).json({ err });
    }
  });
});

router.get("/getByproduct_id/:id", auth.authenticate, (req, res, next) => {
  const id = req.params.id;
  let query =
    'select id, name from event where product_id=? and status="true"';
  connection.query(query, [id], (err, results) => {
    if (!err) {
      return res.status(200).json({ data: results });
    } else {
      return res.status(500).json({ err });
    }
  });
});

router.get("/getByID/:id", (req, res, next) => {
  const id = req.params.id;
  let query = "select id,name,description,percentage , type from event where id=?";
  connection.query(query, [id], (err, results) => {
    if (!err) {
      return res.status(200).json({ data: results[0] });
    } else {
      return res.status(500).json({ err });
    }
  });
});

router.patch("/update", auth.authenticate, role.checkRole, (req, res, next) => {
  let event = req.body;
  let query =
    "update event set name=?, product_id=?, description=?, percentage=?,type=? where id=?";
  connection.query(
    query,
    [
      event.name,
      event.product_id,
      event.description,
      event.percentage,
      event.type,
      event.id,
    ],
    (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res.status(404).json({ message: "event ID not found" });
        }
        return res
          .status(200)
          .json({ message: "event updated successfully" });
      } else {
        return res.status(500).json({ err });
      }
    }
  );
});

router.delete(
  "/delete/:id",
  auth.authenticate,
  role.checkRole,
  (req, res, next) => {
    const id = req.params.id;
    let query = "delete from event where id=?";
    connection.query(query, [id], (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res.status(404).json({ message: "event ID not found" });
        }
        return res
          .status(200)
          .json({ message: "event deleted successfully" });
      } else {
        return res.status(500).json({ err });
      }
    });
  }
);

router.patch(
  "/updateStatus",
  auth.authenticate,
  role.checkRole,
  (req, res, next) => {
    const event = req.body;
    let query = "update event set status=? where id=?";
    connection.query(query, [event.status, event.id], (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res.status(404).json({ message: "event ID not found" });
        }
        return res
          .status(200)
          .json({ message: "event status has been updated successfully" });
      } else {
        return res.status(500).json({ err });
      }
    });
  }
);

module.exports = router;
