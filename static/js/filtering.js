
// A function to loop through all the recent warehouse and concrete orders and add them to the sidebar.
// function AddRecentOrdersToList(orders) {
//     console.log(orders);
//     for (var key in orders) {
//         console.log('here')
//         if (recentOrderList.includes(key) === false) {  
//             recentOrderList.push(key);
//             document.getElementById('locationList').innerHTML += '<li><a href="#" onclick="PopulateSidebar(' + key + ')">' + key + '</a></li>';
//         }
//     }
// } 
    

// A function to filter the list of job locations when the user types out the results
function FilterLocations() {
    // Declare variables
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("locationList");
    li = ul.getElementsByTagName('li');
  
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }