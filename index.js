const signup = require("./utils/authentication/signup.js");
const login = require("./utils/authentication/login.js");
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
app.post("/signup", signup);
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
app.post("/login", login);
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
    fs.readFile("result.txt", "utf-8", function (error, data) {
        if (error) {
            console.error(error);
            response.status(500).send("Internal server error");
            return;
        }
        const results = JSON.parse(data);
        const filteredResults = results.filter(function (result) {
            return result.id === id
        });
        if (filteredResults[0].marked === true) {
            filteredResults[0].marked = false;
        }else{
            filteredResults[0].marked = true;
        }
        fs.writeFile("result.txt", JSON.stringify(results, null, 2), function (error) {
            if (error) {
                console.error(error);
                response.status(500).send("Internal server error");
                return;
            }
            response.status(200).send("Data deleted successfully");
        }
        );
    });
});
app.post("/todoos", function (request, response) {
    const todo = request.body.todo;
    const numi = new Date();
    const num = numi.getTime();
    const avtar = request.file;
    const todoObject = {
        userName: request.session.username,
        text: todo,
        id: num,
        marked: false,
        avtar: avtar.filename
    };
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
                todos.push(todoObject);
                fs.writeFile("result.txt", JSON.stringify(todos,null,2), function (error) {
                    if (error) {
                        response.status(500);
                        response.json({ error: error });
                    } else {
                        response.status(200);
                        response.redirect("/todo")
                    }
                })
            }
            catch (error) {
                response.status(500);
                response.json({ error: error });

            }
        }
    })
});
app.get("/data", function (request, response){
    fs.readFile("result.txt", function (error, data){
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
                })
                response.status(200);
                response.json(filteredTodos);
            }
            catch (error) {
                response.status(500);
                response.json({ error: error });

            }
        }
    })
})
app.delete("/delete/:id", function (request, response) {
    const id = parseInt(request.params.id);
    fs.readFile("result.txt", "utf-8", function (error, data) {
        if (error) {
            console.error(error);
            response.status(500).send("Internal server error");
            return;
        }
        const results = JSON.parse(data);
        const filteredResults = results.filter(function (result) {
            return result.id !== id; 
        });
        fs.writeFile("result.txt", JSON.stringify(filteredResults, null, 2), function (error) {
            if (error) {
                console.error(error);
                response.status(500).send("Internal server error");
                return;
            }
            response.status(200).send("Data deleted successfully");
        });
    });
});
app.listen(8080, () => {
    console.log("Server is running on port 8080");
});