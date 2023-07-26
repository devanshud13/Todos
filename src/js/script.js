const userName = txt;
const prevText = document.getElementById("todo-input");
let todosFetched = false;
getTodos();
function callButton(event) {
    if (event.key === "Enter") {
        handleChange();
    }
}
function handleChange() {
    const inputvalue = prevText.value;
    addtodo(inputvalue,false);
    prevText.value = "";
}
function addtodo(inputvalue,id,marked) {
    const numi = new Date()
    const num = numi.getTime();
    console.log(num);
    const newli = document.createElement("div");
    newli.setAttribute("id", id);
    if(marked){
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
    else{
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
        handleSave(inputvalue, num,marked); 
}
function handleCut(id){
    const div = document.getElementById(id);
    if(div.style.textDecoration === "line-through"){
        div.style.textDecoration = "none";
        handleMarked(id,false);
    }
    else{
        div.style.textDecoration = "line-through";
        handleMarked(id,true);

    }
}
function handleMarked(id,marked){
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
function handleSave(todo, num,marked= false) {
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
                addtodo(todo.text, todo.id,todo.marked);
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
        body: JSON.stringify({text: todo, username: userName, }),
    }).then(function (response) {
        if (response.status === 200) {
          callback();
        } else {
          callback("Something went wrong");
        }
      });
}  