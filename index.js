const express = require("express");
const uuid = require("uuid");
const app = express();
const PORT = process.env.PORT || 3001;

const fs = require("fs");
const path = require("path");
const pathToFile = path.resolve("./data.json");

const cors = require("cors");
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const getResources = () => JSON.parse(fs.readFileSync(pathToFile));

// get all items
app.use("/api/posts", (req, res) => {
  const resources = getResources();

  return res.send(resources);
});

app.use("/api/post", (req, res) => {
  const resources = getResources();

  // adds new post
  if (req.method === "POST") {
    const newResource = {
      ...req.body,
      id: uuid.v4(),
      date: new Date().toISOString(),
    };
    resources.unshift(newResource);

    fs.writeFile(pathToFile, JSON.stringify(resources, null, 2), (error) => {
      if (error) {
        return res.status(422).send("Cannot store data in the file!");
      }

      return res.send("Data has been saved!");
    });
  }
});

app.listen(PORT, () => {
  console.log("server is listening od port: " + PORT);
});
