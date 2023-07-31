const fs = require("fs");

function markTodos(request, response) {
  const id = parseInt(request.params.id);
  fs.readFile("result.txt", "utf-8", function (error, data) {
    if (error) {
      console.error(error);
      response.status(500).send("Internal server error");
      return;
    }
    const results = JSON.parse(data);
    const filteredResults = results.filter(function (result) {
      return result.id === id;
    });
    if (filteredResults[0].marked === true) {
      filteredResults[0].marked = false;
    } else {
      filteredResults[0].marked = true;
    }
    fs.writeFile("result.txt", JSON.stringify(results, null, 2), function (error) {
      if (error) {
        console.error(error);
        response.status(500).send("Internal server error");
        return;
      }
      response.status(200).send("Data updated successfully");
    });
  });
}

module.exports = markTodos;