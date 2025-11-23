const { streamToFile } = require("../../src/utils/streamUtils");
const fs = require("fs");
const path = require("path");

test("streamToFile saves file", async () => {
  const tmp = path.join(__dirname, "tmp_test.txt");
  fs.writeFileSync(tmp, "hello");
  const dest = path.join(__dirname, "../../uploads/tmp_test_saved.txt");
  await streamToFile(tmp, "tmp_test_saved.txt");
  expect(fs.existsSync(dest)).toBe(true);
  fs.unlinkSync(dest);
});
