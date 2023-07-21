const express = require("express");
const app = express();
const fs = require("fs");
app.use(express.json());
app.get("/", function (request, response) {
    response.sendFile(__dirname + "/week.html")
})
app.get("/script.js", function (request, response) {
    response.sendFile(__dirname + "/script.js")
})
app.get("/todos", function (request, response) {
    const name = request.query.name;
    getTodos(name,false, function (error, todos) {
        if (error) {
            response.status(500);
            response.json({ error: error });
        } else {
            response.status(200);
            response.json(todos);
        }
    });
})
// app.put("/", function (request, response) {
//     const todo = request.body;
//     savetodos(todo, function (error) {
//         if (error) {
//             response.status(500);
//             response.json({ error: error });
//         } else {
//             response.status(200);
//             response.send();
//         }
//     })
// })
app.patch("/todos/:id", function (request, response) {
    const id = parseInt(request.params.id);
    fs.readFile(__dirname + "/result.json", "utf-8", function (error, data) {
      if (error) {
        response.status(500);
        response.json({ error: error });
      } else {
        let todos = JSON.parse(data);
        const todoToUpdate = todos.find((todo) => todo.id === id);
        if (todoToUpdate) {
          todoToUpdate.marked = request.body.marked;
          fs.writeFile(__dirname + "/result.json", JSON.stringify(todos, null, 2), function (err) {
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
  });
app.post("/", function (request, response) {
    // todos.push(request.body);
    const todo = request.body;
    savetodos(todo, function (error,savedTodo) {
        if (error) {
            response.status(500);
            response.json({ error: error });
        } else {
    response.status(200);
    response.send(savedTodo);
        }
    })
});
app.delete("/", function (request, response) {
    const text = request.body.text;
    const username = request.body.username;
    getTodos(null,true, function (error, todos) {
        if (error) {
            response.status(500);
            response.json({ error: error });
        } else {
            const filteredTodos = todos.filter(function (todoItem) {
                return todoItem.text !== text;
            });
            fs.writeFile(__dirname + "/result.json", JSON.stringify(filteredTodos, null, 2), function (err) {
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
});
app.listen(8080, () => {
    console.log("Server is running on port 8000");
});
function getTodos(username,all,callback) {
    fs.readFile(__dirname + "/result.json","utf-8", function (error, data) {
            if (error) {
                callback(error);
            }else{
                if(data.length === 0){
                    data = "[]";
                }
                try{
                    let todos = JSON.parse(data);
                   if(all){
                       callback(null,todos);
                       return;
                     }
                    const filteredTodos = todos.filter(function (todo) {
                        return todo.username === username;
                    })
                    callback(null,filteredTodos);
                }catch(error){
                    callback(null , []);
                }
            }
    })
}
// function savetodos(todo,callback){
//   getTodos(null,true, function (error, todos) {
//       if (error) {
//           callback(error);
//       } else {
//           todos.push(todo);

//   fs.writeFile(__dirname + "/result.json", JSON.stringify(todos,null,2), function (err) {
//       if (err) {
//           callback(err);
//       }
//       callback();
//   })
// }
// });
// }
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

          fs.writeFile(__dirname + "/result.json", JSON.stringify(todos, null, 2), function (err) {
              if (err) {
                  callback(err);
              }
              callback();
          });
      }
  });
}
