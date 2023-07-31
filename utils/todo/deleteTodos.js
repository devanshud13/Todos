const fs = require("fs");

function deleteTodos(request, response) {
  const id = parseInt(request.params.id);
  fs.readFile("result.txt", "utf-8", function (error, data) {
    if (error) {
      console.error(error);
      response.status(500).send("Internal server error");
      return;
    }
    const results = JSON.parse(data);
    const filteredAvtar = results.filter(function (result) {
      return result.id === id;
    });
    fs.unlink(`uploads/${filteredAvtar[0].avtar}`, function (error) {
      if (error) {
        console.error(error);
        response.status(500).send("Internal server error");
        return;
      }
    });
    const filteredResults = results.filter(function (result) {
      return result.id !== id;
    });
    fs.writeFile("result.txt", JSON.stringify(filteredResults, null, 2), function (error) {
      if (error) {
        console.error(error);
        response.status(500).send("Internal server error");
        return;
      }
      response.status(200).send("Data deleted successfully");
    });
  });
}

module.exports = deleteTodos;