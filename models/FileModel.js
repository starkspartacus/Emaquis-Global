const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const date = Date.now();

const File = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    fileName: {
      type: String,
      unique: true,
    },
    size: {
      type: Number,
    },
    type: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: date,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "files",
  }
);

module.exports = model("File", File);
