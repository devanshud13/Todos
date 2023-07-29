const fs = require('fs');
function patchTodo(request, response) {
  const id = parseInt(request.params.id);
  fs.readFile("result.txt", "utf-8", function (error, data) {
    if (error) {
      response.status(500);
      response.json({ error: error });
    } else {
      let todos = JSON.parse(data);
      const todoToUpdate = todos.find((todo) => todo.id === id);
      if (todoToUpdate) {
        todoToUpdate.marked = request.body.marked;
        fs.writeFile("result.txt", JSON.stringify(todos, null, 2), function (err) {
          if (err) {
            response.status(500);
            response.json({ error: err });
          } else {
            response.status(200);
            response.json(todoToUpdate);
          }
        });
      } else {
        response.status(404);
        response.json({ message: "Todo not found." });
      }
    }
  });
}

module.exports = patchTodo;