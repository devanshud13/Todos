const fs = require('fs');
const getTodos = require('./getTodos.js');

function deleteTodo(request, response) {
  const text = request.body.text;
  getTodos(null, true, function (error, todos) {
    if (error) {
      response.status(500);
      response.json({ error: error });
    } else {
      const filteredTodos = todos.filter(function (todoItem) {
        return todoItem.text !== text;
      });
      fs.writeFile("result.txt", JSON.stringify(filteredTodos, null, 2), function (err) {
        if (err) {
          response.status(500);
          response.json({ error: err });
        } else {
          response.status(200);
          response.send();
        }
      });
    }
  });
}

module.exports = deleteTodo;