const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const multiparty = require("multiparty");
http
  .createServer(async (req, res) => {
    const file = await fs.readFile(path.join(__dirname, "/data.json"), "utf-8");
    let data = JSON.parse(file);
    const id = data.map((item) => item.id);
    const max = data.length > 0 ? Math.max(...id) : 0;
    if (req.method == "GET") {
      if (req.url == "/anggota") {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
        res.setHeader("Access-Control-Max-Age", 2592000);
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ status: "success", data }));
        return;
      } else {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
        res.setHeader("Access-Control-Max-Age", 2592000);
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ msg: "404 Not Found" }));
        return;
      }
    } else if (req.method == "POST") {
      if (req.url == "/anggota") {
        let body;
        req.on("data", (chunk) => {
          body = chunk.toString();
        });
        req.on("end", async () => {
          const parseBody = JSON.parse(body);
          parseBody["id"] = max + 1;
          data.push(parseBody);
          await fs.writeFile(
            path.join(__dirname, "/data.json"),
            JSON.stringify(data),
            "utf-8"
          );
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Access-Control-Allow-Methods", "OPTIONS, POST");
          res.setHeader("Access-Control-Max-Age", 2592000);
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ status: "success Add data" }));
          return;
        });
      } else {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "OPTIONS, POST");
        res.setHeader("Access-Control-Max-Age", 2592000);
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ msg: "404 Not Found" }));
        return;
      }
    } else if (req.method == "DELETE" || req.method == "OPTIONS") {
      const urlSplit = req.url.split("?");
      const i = urlSplit[1].split("=")[1];
      if (urlSplit[0] == "/anggota") {
        const newData = data.filter((item) => item.id !== Number.parseInt(i));
        await fs.writeFile(
          path.join(__dirname, "/data.json"),
          JSON.stringify(newData),
          "utf-8"
        );
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "OPTIONS, DELETE");
        res.setHeader("Access-Control-Max-Age", 2592000);
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ status: "success delete data" }));
      }
    }
  })
  .listen(process.env.PORT || 5000);
