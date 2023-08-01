// const fs = require("fs");

// function deleteTodos(request, response) {
//   const id = parseInt(request.params.id);
//   fs.readFile("result.txt", "utf-8", function (error, data) {
//     if (error) {
//       console.error(error);
//       response.status(500).send("Internal server error");
//       return;
//     }
//     const results = JSON.parse(data);
//     const filteredAvtar = results.filter(function (result) {
//       return result.id === id;
//     });
//     fs.unlink(`uploads/${filteredAvtar[0].avtar}`, function (error) {
//       if (error) {
//         console.error(error);
//         response.status(500).send("Internal server error");
//         return;
//       }
//     });
//     const filteredResults = results.filter(function (result) {
//       return result.id !== id;
//     });
//     fs.writeFile("result.txt", JSON.stringify(filteredResults, null, 2), function (error) {
//       if (error) {
//         console.error(error);
//         response.status(500).send("Internal server error");
//         return;
//       }
//       response.status(200).send("Data deleted successfully");
//     });
//   });
// }

// module.exports = deleteTodos;
const fs = require("fs");
const TodoData = require("../../modals/todoData");
function deleteTodos(request, response) {
  const id = parseInt(request.params.id);
  TodoData.findOneAndDelete({ id: id, username: request.session.username })
    .then(function (todo) {
      if (!todo) {
        response.status(404);
        response.send("Todo not found");
      } else {
        fs.unlink(`uploads/${todo.avtar}`, function (error) {
          if (error) {
            console.error(error);
          }
        });
        response.status(200);
        response.send("Data deleted successfully");
      }
    })
    .catch(function (error) {
      response.status(500);
      response.json({ error: error });
    });
}

module.exports = deleteTodos;