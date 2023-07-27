const fs = require("fs");
const getTodos = require("./getTodos.js");
function savetodos(todo, callback) {
    getTodos(null, true, function (error, todos) {
        if (error) {
            callback(error);
        } else {
            // Check if the todo already exists in the list
            const existingTodoIndex = todos.findIndex(
                (t) => t.username === todo.username && t.text === todo.text
            );

            if (existingTodoIndex !== -1) {
                // If the todo already exists, update its properties
                todos[existingTodoIndex] = todo;
            } else {
                // If the todo doesn't exist, add it to the list
                todos.push(todo);
            }
            fs.writeFile("result.txt", JSON.stringify(todos, null, 2), function (err) {
                if (err) {
                    callback(err);
                }
                callback();
            });
        }
    });
}
module.exports = savetodos;