const  getTodos  = require("./utils/todo/getTodos.js");
const  savetodos  = require("./utils/todo/savetodos.js");
const express = require("express");
var session = require('express-session')
const app = express();
const fs = require("fs");
app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}))
app.set("view engine", "ejs");
app.get("/", function (request, response) {
        response.render("home", { username: request.session.username });
})
app.get("/todo", function (request, response) {
    if (request.session.isLoggedIn === true) {
        // response.sendFile(__dirname + "/src/week.html")
        response.render("todo",{username: request.session.username});
    }
    else {
        response.redirect("/login");
    }
})
app.get("/home.css", function (request, response) {
    response.sendFile(__dirname + "/src/css/home.css")
})
app.get("/login.css", function (request, response) {
    response.sendFile(__dirname + "/src/css/login.css")
})
app.get("/signup.css", function (request, response) {
    response.sendFile(__dirname + "/src/css/signup.css")
})
app.get("/todo.css", function (request, response) {
    response.sendFile(__dirname + "/src/css/todo.css")
})
app.get('/header.css', function (request, response) {
    response.sendFile(__dirname + "/src/css/header.css")
})
app.get("/script.js", function (request, response) {
    response.sendFile(__dirname + "/src/js/script.js")
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
    if (request.session.isLoggedIn) {
         response.redirect("login" ,{ username: request.session.username }); // now is there any need of if else situation isloggedin ANS: if user logged in render todo page else render login page
    }else{
        response.render('login', { username: request.session.username, usernotfound: request.session.usernotfound}); //
    }
})
app.get("/signup", function (request, response) { // go to login.ejs  you also come  not working
    if (request.session.isLoggedIn) {
        response.redirect("signup" ,{ username: request.session.username });
    }else{
    response.render("signup",{username: request.session.username ,email: request.session.email}); //also you dont need usernotfound
        }
})
app.post("/signup", function (request, response) {
    const username = request.body.username;
    const email = request.body.email;
    const password = request.body.password;
    const detail = {
        "username": username,
        "password": password,
        "email": email
    }
    fs.readFile(__dirname + "/user.txt", "utf-8", function (error, data) {
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
                    request.session.email = email;
                    response.redirect("/signup");
                }
                else {
                    users.push(detail);
                    fs.writeFile(__dirname + "/user.txt", JSON.stringify(users, null, 2), function (err) {
                        if (err) {
                            response.status(500);
                            console.log(err);
                        }
                        else {
                            response.status(200);
                            response.render("login", {username: null, usernotfound : false }); //added username: null now?. ANS: Oh yes! 
                        }
                    });
                }
            } catch (error) {
                response.status(500);//what happened
                console.log(error);
            }
        }
    })
})
app.post("/login", function (request, response) {
    const username = request.body.username;
    const password = request.body.password;
    request.session.usernotfound = false; 
    fs.readFile(__dirname + "/user.txt", "utf-8", function (error, data) {
        if (error) {
            response.send(error);
        } else {
            if (data.length > 0) {
                users = JSON.parse(data);
                const filteredUser = users.filter(function (user) {
                    return user.username === username && user.password === password;
                })
                if (filteredUser.length > 0) {
                    request.session.isLoggedIn = true;
                    request.session.username = username;
                    response.redirect("/");
                } else {
                    request.session.usernotfound = true;
                    response.redirect("/login");
                }
            }
            else {
                response.redirect("/login");
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
    fs.readFile(__dirname + "/result.txt", "utf-8", function (error, data) {
        if (error) {
            response.status(500);
            response.json({ error: error });
        } else {
            let todos = JSON.parse(data);
            const todoToUpdate = todos.find((todo) => todo.id === id);
            if (todoToUpdate) {
                todoToUpdate.marked = request.body.marked;
                fs.writeFile(__dirname + "/result.txt", JSON.stringify(todos, null, 2), function (err) {
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
    getTodos(null, true, function (error, todos) {
        if (error) {
            response.status(500);
            response.json({ error: error });
        } else {
            const filteredTodos = todos.filter(function (todoItem) {
                return todoItem.text !== text;
            });
            fs.writeFile(__dirname + "/result.txt", JSON.stringify(filteredTodos, null, 2), function (err) {
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