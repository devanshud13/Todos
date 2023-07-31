function logout(request, response) {
    request.session.destroy(function (error) {
      if (error) {
        console.error(error);
      } else {
        response.redirect("/");
      }
    });
  }
  
  module.exports = logout;