// const fs = require("fs");

// function saveTodos(request, response) {
//   const todo = request.body.todo;
//   const numi = new Date();
//   const num = numi.getTime();
//   const avtar = request.file;
//   const todoObject = {
//     userName: request.session.username,
//     text: todo,
//     id: num,
//     marked: false,
//     avtar: avtar.filename
//   };
//   fs.readFile("result.txt", function (error, data) {
//     if (error) {
//       response.status(500);
//       response.json({ error: error });
//     } else {
//       if (data.length === 0) {
//         data = "[]";
//       }
//       try {
//         const todos = JSON.parse(data);
//         todos.push(todoObject);
//         fs.writeFile("result.txt", JSON.stringify(todos, null, 2), function (error) {
//           if (error) {
//             response.status(500);
//             response.json({ error: error });
//           } else {
//             response.status(200);
//             response.redirect("/todo");
//           }
//         });
//       } catch (error) {
//         response.status(500);
//         response.json({ error: error });
//       }
//     }
//   });
// }

// module.exports = saveTodos;


 const TodoData = require("../../modals/todoData");

function saveTodos(request, response) {
  const todo = request.body.todo;
  const numi = new Date();
  const num = numi.getTime();
  const avtar = request.file;
  const todoObject = {
    username: request.session.username,
    text: todo,
    id: num,
    marked: false,
    avtar: avtar.filename
  };

  TodoData.create(todoObject)
    .then(function (todo) {
      response.status(200);
      response.redirect("/todo");
    })
    .catch(function (error) {
      response.status(500);
      response.json({ error: error });
    });
}

module.exports = saveTodos;