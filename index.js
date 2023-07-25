const express = require("express");
var session = require('express-session')
const app = express();
const fs = require("fs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}))
app.get("/", function (request, response) {
    response.sendFile(__dirname + "/home.html")
})
app.get("/userNotFound", function (request, response) {
    response.sendFile(__dirname + "/userNotFound.html")
})
app.post('/logout', function (req, res) {
    req.session.isLoggedIn = false;
console.log("logged out");
});
app.get("/todo", function (request, response) {
    if (request.session.isLoggedIn) {
        response.sendFile(__dirname + "/week.html")
    }
    else {
        response.redirect("/login");
    }
})
app.get("/script.js", function (request, response) {
    response.sendFile(__dirname + "/script.js")
})
app.get("/signup.js", function (request, response) {
    response.sendFile(__dirname + "/signup.js")
})
app.get("/login.js", function (request, response) {
    response.sendFile(__dirname + "/login.js")
})
app.get("/home.js", function (request, response) {
    response.sendFile(__dirname + "/home.js")
})
app.get("/todos", function (request, response) {
    const name = request.query.name;
    getTodos(name, false, function (error, todos) {
        if (error) {
            response.status(500);
            response.json({ error: error });
        } else {
            response.status(200);
            response.json(todos);
        }
    });
})
app.get("/login", function (request, response) {
    response.sendFile(__dirname + "/login.html");
})
app.get("/signup", function (request, response) {
    response.sendFile(__dirname + "/signup.html");
})
// app.post("/signup", function (request, response) {
//     const username = request.body.username;
//     const email = request.body.email;
//     const password = request.body.password;
//     const detail = {
//         "username": username,
//         "password": password,
//         "email": email
//     }
//     fs.readFile(__dirname + "/user.json", "utf-8", function (error, data) {
//         if (error) {
//             response.status(500);
//             console.log(error);
//         }
//         else {
//             if (data.length === 0) {
//                 data = "[]";
//             }
//             try {
//                 const users = JSON.parse(data);
//                 users.push(detail);
//                 fs.writeFile(__dirname + "/user.json", JSON.stringify(users, null, 2), function (err) {
//                     if (err) {
//                         response.status(500);
//                         console.log(err);
//                     } else {
//                         response.status(200);
//                         response.redirect("/login");
//                     }
//                 });
//             }
//             catch (error) {
//                 response.status(500);
//                 console.log(error);
//             }
//         }
//     })
// })
app.post("/signup", function (request, response) {
    const username = request.body.username;
    const email = request.body.email;
    const password = request.body.password;
    const detail = {
        "username": username,
        "password": password,
        "email": email
    }
    fs.readFile(__dirname + "/user.json", "utf-8", function (error, data) {
        if (error) {
            response.status(500);
            console.log(error);
        }
        else {
            if (data.length === 0) {
                data = "[]";
            }
            try {
                const users = JSON.parse(data);
                const filteredUser = users.filter(function (user) {
                    return user.email === email;
                })
                if (filteredUser.length > 0) {
                    response.redirect("/signup?gmail=" +"user_already_exists");
                }
                else {
                    users.push(detail);
                    fs.writeFile(__dirname + "/user.json", JSON.stringify(users, null, 2), function (err) {
                        if (err) {
                            response.status(500);
                            console.log(err);
                        } 
                        else {
                            response.status(200);
                            response.redirect("/login");
                        }
                    });
                }
            } catch (error) {
                response.status(500);
                console.log(error);
            }
        }
    })
})
app.post("/login", function (request, response) {
    const username = request.body.username;
    const password = request.body.password;
    fs.readFile(__dirname + "/user.json", "utf-8", function (error, data) {
        if (error) {
            response.send(error);
        } else {
            users = JSON.parse(data);
            const filteredUser = users.filter(function (user) {
                return user.username === username && user.password === password;
            })
            console.log(filteredUser);
            if (filteredUser.length > 0) {
                request.session.isLoggedIn = true;
                response.redirect("/?Uname=" + username);
            } else {
                response.redirect("/userNotFound");
            }
        }
    });
});
app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.error(err);
        } else {
            res.redirect('/');
        }
    });
});
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
    savetodos(todo, function (error, savedTodo) {
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
    getTodos(null, true, function (error, todos) {
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
    console.log("Server is running on port 8080");
});
function getTodos(username, all, callback) {
    fs.readFile(__dirname + "/result.json", "utf-8", function (error, data) {
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
