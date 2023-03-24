const { Thought, User } = require("../models");

const thoughtController = {
  getAllThoughts(req, res) {
    Thought.find({})
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")

      .then((data) => res.json(data))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },
  getSingleThought(req, res) {
    Thought.find({ _id: req.params.id })
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")

      .then((data) => res.json(data))
      .catch((err) => {
        res.sendStatus(400);
      });
  },

  createThought(req, res) {
    Thought.create(req.body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((data) => {
        if (!data) {
          return res.status(404).json({ message: "No user with this id" });
        }

        res.json({ message: "Thought  made" });
      })
      .catch((err) => res.json(err));
  },
  updateThought(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
    })
      .then((data) => {
        if (!data) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(data);
      })
      .catch((err) => res.json(err));
  },
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ id: params.id })
      .then((data) => {
        if (!data) {
          return res.status(404).json({ message: "No thought with this id!" });
        }

        return User.findOneAndUpdate(
          { thoughts: params.id },
          { $pull: { thoughts: params.id } },
          { new: true }
        );
      })
      .then((data) => {
        if (!data) {
          return res
            .status(404)
            .json({ message: "No user found with this thought id" });
        }
        res.json({ message: "Thought successfully deleted!" });
      })
      .catch((err) => res.json(err));
  },

  // add reaction
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { new: true }
    )
      .then((data) => {
        if (!data) {
          res.status(404).json({ message: "No thought with this id" });
          return;
        }
        console.log(data);
        res.json(data);
      })
      .catch((err) => res.json(err));
  },

  // delete reaction
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((data) => res.json(data))
      .catch((err) => res.json(err));
  },
};

module.exports = thoughtController;
