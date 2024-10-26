const http = require("http");
const fs = require("fs");

const PORT = 8080;

let data;
const data_JSON = fs.readFileSync("data.json");
data = JSON.parse(data_JSON);

const server = http.createServer((req, res) => {
  console.log(req.url);
  const method = req.method;
  const url = req.url;
  res.setHeader("Content-type", "application/json");

  if (method === "GET") {
    if (url.startsWith("/users?id=")) {
      const id = url.split("=")[1];
      const user = data.filter((user) => user.id === Number(id));

      if (user.length > 0) {
        res.write(JSON.stringify(user));
      } else {
        res.write(JSON.stringify({ message: "user not found" }));
      }
    } else {
      res.write(JSON.stringify(data));
    }
    res.end();
  }

  if (method === "POST") {
    let body = "";
    req.on("data", (buff) => {
      body += buff;
    });

    req.on("end", () => {
      const praseData = JSON.parse(body);

      const addNewUser = {
        id: data.length + 1,
        ...praseData,
      };
      data.push(addNewUser);

      fs.writeFileSync("data.json", JSON.stringify(data), (err) => {
        console.log(err);
      });

      res.write(JSON.stringify({ message: "done" }));
      res.end();
    });
  }
  if (method === "DELETE") {
    let body = "";
    req.on("data", (buff) => {
      body += buff;
    });

    req.on("end", () => {
      const json_id = JSON.parse(body);
      const id = json_id.id;
      const new_data = data.filter((user) => Number(user.id) !== id);
      fs.writeFileSync("data.json", JSON.stringify(new_data), (err) => {
        console.log(err);
      });

      res.write(JSON.stringify({ message: "deleted" }));
      res.end();
    });
  }
});

server.listen(PORT, console.log(`you site is running on port: ${PORT}`));


// fs.appendFile('text.txt', "HELLO", (error) => {
//   if (error) {
//     console.error(error);
//   } else {
//     console.log("done")
//   }
// });

// fs.readFile("text.txt", "utf8", (err, data) => {
// if(err){
//     console.log(err)
// } else {
//     console.log(data)
// }})

// fs.unlink("text.txt",(err) => {
//     if(err){
//         console.log(err)
//     } else {
//         console.log("deleted succesfuly")
//     }
// })
