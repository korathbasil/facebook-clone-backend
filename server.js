const express = require("express");

const app = express();
PORT = 8000;

app.get('/', (req, res) => {
  res.json({"helloooo": "gahubsa"})
})


app.listen(PORT, () => console.log("server started at "+PORT));
