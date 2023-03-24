const User = require("../models/User");

module.exports = {
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: "friends",
        select: "-__v",
      })
      .select("-__v")
      .sort({ id: -1 })
      .then((data) => res.json(data))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  getSingleUser(req, res) {
    User.findOne({ id: req.params.userId })
      .select("-__v")
      .populate({
        path: "friends",
        select: "-__v",
      })
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .select("-__v")
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((data) => res.json(data))
      .catch((err) => res.json(err));
  },
  updateUser(req, res) {
    User.findOneAndUpdate({ id: req.params.id }, req.body, {
      new: true,
    })
      .then((data) => {
        if (!data) {
          console.log(err);
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        console.log(data);
        res.json(data);
      })
      .catch((err) => {
        res.json(err);
      });
  },

  // delete user
  deleteUser(req, res) {
    User.findOneAndDelete({ id: req.params.id })
      .then((data) => {
        console.log(data);
        if (!data) {
          return res.status(404).json({ message: "No user with this id!" });
        }
        res.json(data);
      })
      .catch((err) => res.json(err));
  },

  // add friend
  addFriend(req, res) {
    User.findOneAndUpdate(
      { id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true, runValidators: true }
    )
      .then((data) => {
        if (!data) {
          res.status(404).json({ message: "No user with this id" });
          return;
        }
        res.json(data);
      })
      .catch((err) => res.json(err));
  },

  // delete friend
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((data) => {
        if (!data) {
          return res.status(404).json({ message: "No user with this id!" });
        }
        res.json(data);
      })
      .catch((err) => res.json(err));
  },
};
