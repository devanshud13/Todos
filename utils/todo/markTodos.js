// const fs = require("fs");

// function markTodos(request, response) {
//   const id = parseInt(request.params.id);
//   fs.readFile("result.txt", "utf-8", function (error, data) {
//     if (error) {
//       console.error(error);
//       response.status(500).send("Internal server error");
//       return;
//     }
//     const results = JSON.parse(data);
//     const filteredResults = results.filter(function (result) {
//       return result.id === id;
//     });
//     if (filteredResults[0].marked === true) {
//       filteredResults[0].marked = false;
//     } else {
//       filteredResults[0].marked = true;
//     }
//     fs.writeFile("result.txt", JSON.stringify(results, null, 2), function (error) {
//       if (error) {
//         console.error(error);
//         response.status(500).send("Internal server error");
//         return;
//       }
//       response.status(200).send("Data updated successfully");
//     });
//   });
// }

// module.exports = markTodos;

const TodoData = require("../../modals/todoData");

function markTodos(request, response) {
  const id = parseInt(request.params.id);
  TodoData.findOne({ id: id, username: request.session.username })
    .then(function (todo) {
      if (!todo) {
        response.status(404);
        response.send("Todo not found");
      } else {
        todo.marked = !todo.marked;
        return todo.save();
      }
    })
    .then(function () {
      response.status(200).send("Data updated successfully");
    })
    .catch(function (error) {
      response.status(500);
      response.json({ error: error });
    });
}

module.exports = markTodos;