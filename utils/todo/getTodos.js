const fs = require("fs");

function getTodos(request, response) {
  fs.readFile("result.txt", function (error, data) {
    if (error) {
      response.status(500);
      response.json({ error: error });
    } else {
      if (data.length === 0) {
        data = "[]";
      }
      try {
        const todos = JSON.parse(data);
        const filteredTodos = todos.filter(function (todo) {
          return todo.userName === request.session.username;
        });
        response.status(200);
        response.json(filteredTodos);
      } catch (error) {
        response.status(500);
        response.json({ error: error });
      }
    }
  });
}

module.exports = getTodos;