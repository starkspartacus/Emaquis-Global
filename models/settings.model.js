const { Schema } = require("mongoose");

const SettingModel = new Schema({
  product_return_type: {
    type: String,
    default: "full", //full | halt | tip
  },
});

module.exports = mongoose.model("Setting", SettingModel);
