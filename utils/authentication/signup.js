const fs = require('fs');

function signup(request, response) {
  const username = request.body.username;
  const email = request.body.email;
  const password = request.body.password;
  const detail = {
    "username": username,
    "password": password,
    "email": email
  }
  fs.readFile("user.txt", "utf-8", function (error, data) {
    if (error) {
      response.status(500);
      console.log(error);
    }
    else {
      if (data.length === 0) {
        data = "[]";
      }
      try {
        const users = JSON.parse(data);
        const filteredUser = users.filter(function (user) {
          return user.email === email;
        })
        if (filteredUser.length > 0) {
          request.session.email = email;
          response.redirect("/signup");
        }
        else {
          users.push(detail);
          fs.writeFile("user.txt", JSON.stringify(users, null, 2), function (err) {
            if (err) {
              response.status(500);
              console.log(err);
            }
            else {
              response.status(200);
              response.render("login", { username: null, usernotfound: false });
            }
          });
        }
      } catch (error) {
        response.status(500);
        console.log(error);
      }
    }
  })
}

module.exports = signup;