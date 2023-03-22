const { Schema, model } = require('mongoose');

// Schema to create Thought model
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,


    },
    createdAt: {
        type:Date,
        Default: Date.now()
    },
    userName: {
      type:String,
      required: true
    },
    reaction: [ReationsSchema]
  })

  thoughtSchema.virtual("reactCount".get(function () {
    return this.reactions.length
  }))

  const Thought= model("Thoughts",thoughtSchema)
  module.exports = Thought