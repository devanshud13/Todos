const getTodos = require("./utils/todo/getTodos.js");
const saveTodos = require("./utils/todo/saveTodos.js");
const markTodos = require("./utils/todo/markTodos.js");
const deleteTodos = require("./utils/todo/deleteTodos.js");
const signup = require("./utils/authentication/signup.js");
const login = require("./utils/authentication/login.js");
const logout = require("./utils/authentication/logout.js");

const express = require("express");
var session = require('express-session')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const app = express();
const fs = require("fs");

app.use(function (req, res, next) {
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
app.use(upload.single('avtar'));
app.use(express.static("src"));
app.use(express.static("uploads"));
app.set("view engine", "ejs");

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

app.get("/signup", function (request, response) {
    const Email = request.session.email;
    request.session.email = null;
    if (request.session.isLoggedIn) {
        response.redirect("signup", { username: request.session.username });
    } else {
        response.render("signup", { username: request.session.username, email: Email });
    }
})
app.get("/login", function (request, response) {
    const user = request.session.usernotfound;
    request.session.usernotfound = false;
    if (request.session.isLoggedIn) {
        response.redirect("login", { username: request.session.username });
        return;
    } else {
        response.render('login', { username: request.session.username, usernotfound: user });
    }
})
app.get("/", function (request, response) {
    response.render("home", { username: request.session.username });
})
app.get("/todo", function (request, response) {
    if (request.session.isLoggedIn === true) {
        response.render("data", { username: request.session.username });
    }
    else {
        response.redirect("/login");
    }
})
app.post("/signup", signup);
app.post("/login", login);
app.get("/logout", logout);
app.get("/data",getTodos);
app.post("/todoos",saveTodos);
app.patch("/todos/:id", markTodos);
app.delete("/delete/:id", deleteTodos);
app.listen(8080, () => {
    console.log("Server is running on port 8080");
});