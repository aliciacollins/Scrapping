
$(function () {
  $("#submit").on("click", function (event) {
      console.log("I clicked")
      // Grab the id associated with the article from the submit button
      var thisId = $(this).attr("data-id");

      // Post comment to article
      $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
          // Value taken from note textarea
          body: $("#bodyinput").val().trim()
          
        }
        
      })
        // With that done
        .then(function (data) {
          // Log the response
          console.log(data);
          $("#bodyinput").val("");
        });
    
      // Also, remove the values entered in the input and textarea for note entry
     
  });
});



  // Run a POST request to change the note, using what's entered in the inputs
  


// $("#myButton").on("click", function () {
//   console.log("yooooo");
//   $.getJSON("/scrape", function (err, data) {
//     if (err !== null) {
//       console.log(data)
//       window.location.reload();
//     } else {
//       alert('oops')
//     }
//   });
// });
// $.getJSON("/articles", function(data) {

//   for (var i = 0; i < data.length; i++) {
//     // id not working
//     console.log("id",data[i]._id)
//     $("#articles").append("<p data-id='" + data[i]._id + "'><b>" + data[i].title + "</b><br />" + data[i].summary + "<br />"+ data[i].link + "</p>");
//   }
// });

