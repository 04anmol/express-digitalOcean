import "dotenv/config";
import express from "express";
import logger from "./logger.js";
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

let teaData = [];
let nextId = 1;

//add a tea
app.post("/teas", (req, res) => {
  const { name, price } = req.body;
  const newTea = { id: nextId++, name, price };
  teaData.push(newTea);
  res.status(201).send(newTea); //status 201 is more correct for creation
});

//get all tea
app.get("/teas", (req, res) => {
  res.status(200).send(teaData);
});

//get a tea
app.get("/teas/:id", (req, res) => {
  const teaId = parseInt(req.params.id);
  const tea = teaData.find((t) => teaId === t.id);
  if (!tea) {
    return res.status(404).send("Tea Not Found");
  }
  res.status(200).send(tea);
});

//update a tea
app.put("/teas/:id", (req, res) => {
  const teaId = parseInt(req.params.id);
  const tea = teaData.find((t) => teaId === t.id);
  if (!tea) {
    return res.status(404).send("Tea Not Found");
  }
  const { name, price } = req.body;
  tea.name = name;
  tea.price = price;
  res.status(200).send(tea);
});

//delete a tea
app.delete("/teas/:id", (req, res) => {
  const index = teaData.findIndex((t) => t.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).send("Tea Not Found");
  }
  const temp = { ...teaData[index] };
  teaData.splice(index, 1);
  res
    .status(200)
    .send(`${temp.name} with id: ${temp.id} was deleted successfully`);
});

app.listen(port, () => {
  console.log(`Server is running at port: ${port}...`);
});
