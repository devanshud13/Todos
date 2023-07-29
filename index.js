const  getTodos  = require("./utils/todo/getTodos.js");
const  savetodos  = require("./utils/todo/savetodos.js");
const signup = require("./utils/authentication/signup.js");
const login = require("./utils/authentication/login.js");
const patchTodo = require("./utils/todo/patchTodo.js");
const deleteTodo = require("./utils/todo/deleteTodo.js");
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
        response.render("data",{username: request.session.username});
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
         response.redirect("login" ,{ username: request.session.username });
    }else{
        response.render('login', { username: request.session.username, usernotfound: request.session.usernotfound}); //
    }
})
app.get("/signup", function (request, response) { 
    if (request.session.isLoggedIn) {
        response.redirect("signup" ,{ username: request.session.username });
    }else{
    response.render("signup",{username: request.session.username ,email: request.session.email});
        }
})
app.post("/signup", signup);
app.post("/login", login);
app.delete("/", deleteTodo);
app.patch("/todos/:id", patchTodo);
app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.error(err);
        } else {
            res.redirect('/');
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
app.listen(8080, () => {
    console.log("Server is running on port 8080");
});