const File = require("../models/FileModel");
const date = new Date(Date.now());

module.exports = function () {
  /*********************/
  //      CREATE
  /*********************/
  //Create one
  this.createFile = async function (body) {
    const payload = {
      ...body,
      createdAt: date,
    };
    const newFile = new File(payload);
    return await newFile.save();
  };

  /*********************/
  //      READ
  /*********************/
  //Find one
  this.findById = async function (id) {
    return File.findOne({ _id: id, deleted: false });
  };

  //Find by Search
  this.findBySearch = async function (search) {
    const reg = new RegExp(search, "ig");
    const result = await File.find({ name: { $regex: reg }, deleted: false });
    return result;
  };

  /*********************/
  //      UPDATE
  /*********************/
  //Update
  this.updateFile = async function (id, body) {
    return File.updateOne({ _id: id }, body, { new: true });
  };

  /*********************/
  //      DELETE
  /*********************/
  this.deleteOne = async function (id) {
    return File.updateOne({ _id: id }, { deleted: true });
  };
};
