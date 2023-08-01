// const fs = require('fs');

// function login(request, response) {
//     const username = request.body.username;
//     const password = request.body.password;
//     request.session.usernotfound = false;
//     fs.readFile("user.txt", "utf-8", function (error, data) {
//         if (error) {
//             response.send(error);
//         } else {
//             if (data.length > 0) {
//                 users = JSON.parse(data);
//                 const filteredUser = users.filter(function (user) {
//                     return user.username === username && user.password === password;
//                 })
//                 if (filteredUser.length > 0) {
//                     request.session.isLoggedIn = true;
//                     request.session.username = username;
//                     response.redirect("/");
//                 } else {
//                     request.session.usernotfound = true;
//                     response.redirect("/login");
//                 }
//             }
//             else {
//                 request.session.usernotfound = true;
//                 response.redirect("/login");
//             }
//         }
//     });
// }
// module.exports = login;

const User = require("../../modals/users");

function login(request, response){
    const username = request.body.username;
    const password = request.body.password;
    request.session.usernotfound = false;
    User.findOne({username: username, password: password})
    .then(function(user){
        if(user){
            request.session.isLoggedIn = true;
            request.session.username = username;
            response.redirect("/");
        }else{
            request.session.usernotfound = true;
            response.redirect("/login");
        }
    })
}
module.exports = login;