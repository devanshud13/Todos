const fs = require("fs");
function getTodos(username, all, callback) {
    fs.readFile("result.json", "utf-8", function (error, data) {
        if (error) {
            callback(error);
        } else {
            if (data.length === 0) {
                data = "[]";
            }
            try {
                let todos = JSON.parse(data);
                if (all) {
                    callback(null, todos);
                    return;
                }
                const filteredTodos = todos.filter(function (todo) {
                    return todo.username === username;
                })
                callback(null, filteredTodos);
            } catch (error) {
                callback(null, []);
            }
        }
    })
}
module.exports = getTodos;  