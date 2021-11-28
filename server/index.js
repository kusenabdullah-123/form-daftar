const http = require("http");
const {
  getDataAll,
  postData,
  deleteData,
  setHeader,
} = require("./anggotaController");
http
  .createServer(async (req, res) => {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS, POST, GET,DELETE",
      "Access-Control-Max-Age": 2592000,
      "Access-Control-Allow-Headers":
        "Access-Control-Allow-Origin,Origin, X-Requested-With, Content-Type, Accept",
    };
    if (req.method == "OPTIONS") {
      res.writeHead(200, headers);
      res.end();
      return;
    }
    if (req.method == "GET") {
      if (req.url == "/anggota") {
        setHeader(res);
        const data = await getDataAll();
        res.end(JSON.stringify({ status: "success", data }));
        return;
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
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
          await postData(body);
          setHeader(res);
          res.end(JSON.stringify({ status: "success Add data" }));
        });
      } else {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept"
        );
        res.setHeader(
          "Access-Control-Allow-Methods",
          "DELETE,GET, POST, PUT, PATCH"
        );
        res.end(JSON.stringify({ msg: "404 Not Found" }));
      }
    } else if (req.method == "DELETE") {
      let bodyDelete;
      req.on("data", (chunk) => {
        bodyDelete = JSON.parse(chunk.toString());
      });
      req.on("end", async () => {
        const { id } = bodyDelete;
        await deleteData(id);
        setHeader(res);
        res.end(JSON.stringify({ status: "success delete data" }));
      });
    }
  })
  .listen(process.env.PORT || 5000);
