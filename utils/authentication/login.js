const fs = require('fs');

function login(request, response) {
    const username = request.body.username;
    const password = request.body.password;
    request.session.usernotfound = false;
    fs.readFile("user.txt", "utf-8", function (error, data) {
        if (error) {
            response.send(error);
        } else {
            if (data.length > 0) {
                users = JSON.parse(data);
                const filteredUser = users.filter(function (user) {
                    return user.username === username && user.password === password;
                })
                if (filteredUser.length > 0) {
                    request.session.isLoggedIn = true;
                    request.session.username = username;
                    response.redirect("/");
                } else {
                    request.session.usernotfound = true;
                    response.redirect("/login");
                }
            }
            else {
                request.session.usernotfound = true;
                response.redirect("/login");
            }
        }
    });
}

// function login(username, password, callback) {
//     fs.readFile("user.txt", "utf-8", function (error, data) {
//         if (error) {
//             callback(error, "");
//         }
//         if (data.length > 0) {
//             users = JSON.parse(data);
//             const filteredUser = users.filter(function (user) {
//                 return user.username === username && user.password === password;
//             })
//             if (filteredUser.length != 1) {
//                 callback("user not found","");
//                 return;
//             }
//             callback(null,"");
//         }

//     });
// }

module.exports = login;