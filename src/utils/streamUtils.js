const fs = require("fs");
const path = require("path");

function streamToFile(tempPath, filename) {
  const target = path.join(__dirname, "../../uploads", filename);
  return new Promise((resolve, reject) => {
    const read = fs.createReadStream(tempPath);
    const write = fs.createWriteStream(target);
    read.pipe(write);
    write.on("finish", () => resolve(target));
    write.on("error", reject);
  });
}

module.exports = { streamToFile };
