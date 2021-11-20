const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const { parse } = require("querystring");

http
  .createServer(async (req, res) => {
    const file = await fs.readFile(path.join(__dirname, "/data.json"), "utf-8");
    let data = JSON.parse(file);
    const id = data.map((item) => item.id);
    const max = data.length > 0 ? Math.max(...id) : 0;
    if (req.method == "GET") {
      if (req.url == "/data") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "success", data }));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ msg: "404 Not Found" }));
      }
    } else if (req.method == "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", async () => {
        let resultPost = parse(body);
        resultPost["id"] = max + 1;
        data.push(resultPost);
        await fs.writeFile(
          path.join(__dirname, "/data.json"),
          JSON.stringify(data),
          "utf-8"
        );
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "success" }));
      });
    } else if (req.method == "DELETE") {
      const urlSplit = req.url.split("?");
      const i = urlSplit[1].split("=")[1];
      if (urlSplit[0] == "/data") {
        const newData = data.filter((item) => item.id !== Number.parseInt(i));
        await fs.writeFile(
          path.join(__dirname, "/data.json"),
          JSON.stringify(newData),
          "utf-8"
        );
      }
    }
  })
  .listen(5000);
