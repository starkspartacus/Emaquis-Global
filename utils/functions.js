const Jimp = require("jimp");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

exports.handleError = (error, res) => {
  console.log(error);
  res.status(500).send({ success: false, error: error.message });
};

exports.handleResizeImage = async (file, size, quality, output) => {
  await Jimp.read(file, (err, lenna) => {
    if (err) throw err;
    lenna
      .resize(size, size) // resize
      .quality(quality) // set JPEG quality
      .write(output); // save
  });
  return "resized";
};

exports.handleMkdir = async (dest, dir) => {
  fs.mkdir(path.join(__dirname, `../../${dest}/${dir}`), (err) => {
    if (err) {
      return console.error(err);
    }
    console.log("Directory created successfully!");
  });
};

exports.handleReadCsv = async (csvFile) => {
  const results = [];
  fs.createReadStream(csvFile)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      console.log("End");
      return results;
    });
};

exports.handleReadDirectoy = (directoryRoute) => {
  const directoryPath = path.join(__dirname, directoryRoute);
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return console.log("Impossible to scan directory : " + err);
    }
    files.forEach(function (file) {
      console.log(file);
    });
  });
};
