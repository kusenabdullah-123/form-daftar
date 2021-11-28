const fs = require("fs/promises");
const path = require("path");
const getMaxId = async () => {
  const data = await getDataAll();
  const id = data.map((item) => item.id);
  return data.length > 0 ? Math.max(...id) : 0;
};
const getDataAll = async () => {
  const file = await fs.readFile(path.join(__dirname, "/data.json"), "utf-8");
  return JSON.parse(file);
};
const postData = async (body) => {
  const data = await getDataAll();
  const parseBody = JSON.parse(body);
  const id = await getMaxId();
  parseBody["id"] = id + 1;
  data.push(parseBody);
  await fs.writeFile(
    path.join(__dirname, "/data.json"),
    JSON.stringify(data),
    "utf-8"
  );
};
const filterData = async (id) => {
  const data = await getDataAll();
  return data.filter((item) => item.id !== Number.parseInt(id));
};
const deleteData = async (id) => {
  const newData = await filterData(id);
  await fs.writeFile(
    path.join(__dirname, "/data.json"),
    JSON.stringify(newData),
    "utf-8"
  );
};
const setHeader = (res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Methods", "DELETE,GET, POST, PUT, PATCH");
};

module.exports = {
  getDataAll,
  postData,
  deleteData,
  filterData,
  setHeader,
};
