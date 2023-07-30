const userName = txt;
const prevText = document.getElementById("todo-input");
const imageInput = document.getElementById("avtar-input");
let todosFetched = false;
getTodos();
function callButton(event) {
    if (event.key === "Enter") {
        handleChange();
    }
}
function handleChange() {
    const inputvalue = prevText.value;
    addtodo(inputvalue, false);
    prevText.value = "";
}
function addtodo(inputvalue, id, marked) {
    const numi = new Date()
    const num = numi.getTime();
    const newli = document.createElement("div");
    newli.setAttribute("id", id);
    if (marked) {
        newli.innerHTML = `<div id = ${num} class ="special">
<li id="${num}c" style="text-decoration: line-through;">${inputvalue}</li>
<div class = "cut">
<div class="form-check">
  <input class="form-check-input" checked type="checkbox" onclick = handleCut("${num}c")  value="" id="flexCheckDefault">
<button id="todo-delete"onclick = handleDelete(${num}) >
<i class="fi fi-bs-cross id="fi"></i></button>
</div>
</div>`
    }
    else {
        newli.innerHTML = `<div id = ${num} class ="special">
<li id="${num}c">${inputvalue}</li>
<div class = "cut">
<div class="form-check">
  <input class="form-check-input"  type="checkbox" onclick = handleCut("${num}c")  value="" id="flexCheckDefault">
<button id="todo-delete"onclick = handleDelete(${num}) >
<i class="fi fi-bs-cross id="fi"></i></button>
</div>
</div>`
    }
    document.getElementById("list").appendChild(newli);
    handleSave(inputvalue, num, marked);

}
function handleCut(id) {
    const div = document.getElementById(id);
    if (div.style.textDecoration === "line-through") {
        div.style.textDecoration = "none";
        handleMarked(id, false);
    }
    else {
        div.style.textDecoration = "line-through";
        handleMarked(id, true);

    }
}
function handleMarked(id, marked) {
    fetch(`/todos/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
            username: userName,
            id: id,
            marked: marked,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    })
}
function handleDelete(num) {
    const button = document.getElementById(num);
    const todo = button.closest(".special"); // Find the closest parent element with class "special"

    deleteTodo(todo.querySelector("li").innerText, function (error) {
        if (error) {
            alert(error);
        } else {
            todo.remove();
        }
    });
}
function handleSave(todo, num, marked = false) {
    fetch("/", {
        method: "POST",
        body: JSON.stringify({
            username: userName,
            id: num,
            text: todo,
            marked: marked,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    })
}
function getTodos() {
    fetch("/todos?name=" + userName)
        .then(function (response) {
            if (response.status !== 200) {
                throw new Error("Something went wrong");
            }
            return response.json();
        })
        .then(function (todos) {
            todos.forEach(function (todo) {
                const marked = todo.marked === true;
                addtodo(todo.text, todo.id, todo.marked);
            });
        })
        .catch(function (error) {
            alert(error);
        });
}
function deleteTodo(todo, callback) {
    fetch("/", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: todo, username: userName, }),
    }).then(function (response) {
        if (response.status === 200) {
            callback();
        } else {
            callback("Something went wrong");
        }
    });
}  










`
<div class="container">
    <div class="left">
        <div class="txt">
            <h1>Task List</h1>
        </div>
        <ul id="list">
        </ul>
    </div>
    <div class="right">
        <input type="text" name="todo" id="todo-input" placeholder="I need to..." onkeypress=callButton(event)>
            <input type="file" name="avtar" id="avtar-input" >
            <input type="submit" value="submit">
            <button id="todo-btn" onclick=handleChange()>
        </button>
    </div>
</div>`












const getTodos  = require("./utils/todo/getTodos.js");
const savetodos  = require("./utils/todo/savetodos.js");
const signup = require("./utils/authentication/signup.js");
const login = require("./utils/authentication/login.js");
const patchTodo = require("./utils/todo/patchTodo.js");
const deleteTodo = require("./utils/todo/deleteTodo.js");
const express = require("express");
var session = require('express-session')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
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
app.use(upload.single('avtar'));//if file is single use file & if multiple use array
app.use(express.static("src"));
app.use(express.static("uploads"));
app.set("view engine", "ejs");
app.get("/", function (request, response) {
    response.render("home", { username: request.session.username });
})
app.get("/todo", function (request, response) {
    if (request.session.isLoggedIn === true) {
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
app.get("/signup", function (request, response) { 
    const Email = request.session.email;
    request.session.email = null;
    if (request.session.isLoggedIn) {
        response.redirect("signup" ,{ username: request.session.username });
    }else{
    response.render("signup",{username: request.session.username ,email:Email});
        }
})
app.post("/signup", signup);
app.get("/login", function (request, response) {
    const user = request.session.usernotfound;
    request.session.usernotfound = false;
    if (request.session.isLoggedIn) {
         response.redirect("login" ,{ username: request.session.username });
         return;
    }else{
         response.render('login', { username: request.session.username,usernotfound:user});
    }
})
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
app.get("/todoAvtar", function (request, response) {
    response.sendFile(__dirname + "/src/images/todoAvtar.png")
})
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