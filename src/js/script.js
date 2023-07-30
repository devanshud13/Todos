const userName = txt;
fetch('/data')
  .then(response => response.json())
  .then(data => {
    data.forEach(item => {
        const inputvalue = item.text;
        const num = item.id;
        const avtar = item.avtar;
        const marked = item.marked;
        console.log(inputvalue);
        console.log(num);
        console.log(avtar);
        const newli = document.createElement("div");
        newli.setAttribute("id", num);
        if (marked == true) {
            newli.innerHTML = `<div id=${num} class="special">
        <li id="${num}c" style="text-decoration: line-through;">${inputvalue}</li>
        <img id="todo-image-${num}" src="${avtar}" alt="Todo Image" class="avtar">
        <div class="cut">
        <div class="form-check">
            <input id="${num}" onclick=handleCut(this.id) class="form-check-input" checked type="checkbox"  value="">
            <button id="${num}" onclick=handleDelete(this.id)>
            <i class="fi fi-bs-cross id="fi"></i></button>
        </div>
        </div>
        <img id="todo-image-${num}" src="" alt="Todo Image" style="display: none;">
        </div>`;
        } else {
            newli.innerHTML = `<div id=${num} class="special">
        <li id="${num}c">${inputvalue}</li>
        <img id="todo-image-${num}" src="${avtar}" alt="Todo Image" class="avtar">
        <div class="cut">
        <div class="form-check">
            <input id="${num}" onclick=handleCut(this.id) class="form-check-input" type="checkbox"  value="" >
            <button id=${num} onclick=handleDelete(this.id)>
            <i class="fi fi-bs-cross id="fi"></i></button>
        </div>
        </div>
        <img id="todo-image-${num}" src="" alt="Todo Image" class="avtar" style="display: none;">
        </div>`;
        }
        document.getElementById("list").appendChild(newli);
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
  function handleCut(id) {
    const div = document.getElementById(id);
    if (div.style.textDecoration === "line-through") {
        div.style.textDecoration = "none";
    }else{
        div.style.textDecoration = "line-through";
    }
    fetch(`/todos/${id}`, {
        method: "PATCH",
    })
        .then(function (response) {
            if (response.status !== 200) {
                throw new Error("Something went wrong");
            }
            return response.json();
        }
        )
  }
  function handleDelete(num) {
    const div = document.getElementById(num);
    div.remove();
    fetch(`/delete/${num}`, {
      method: "DELETE"
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    })
    .catch(error => {
      console.error("Error:", error);
    });
  }