///////////////////////////////////////////////////////////////////////////////
// Task: Working with our csv file.                                          //                  
//                                                                           //
// Logic: While we are working with the csv file, we need to parse it.       //
//      We need to create a function that will parse the csv file.           //
//      We need to create a function that will create a marker for each job. //
//      We will be setting the pop-up for each datapoint.                    //
//      Create a class to be easily updated?                                 //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////


// An object to save the markers.
var JCLocations = {};
var markers = {};
var orderMarkers = {};
var concreteMarkers = {};

// An object of objects to save all the information about the jobs.
var JCDetails = {};

// Read in the data from our CSV file using d3.
Promise.all([

  // TODO: Figure our how to get data from local files.

  // Local Files
  // d3.csv("../data/mapping.csv"),
  // d3.csv("../data/orders.csv")
  // Github Files
  d3.csv('https://raw.githubusercontent.com/ScottyMacCVC/EoStoECMS/main/Resources/Report%20to%20Map/static/data/mapping.csv'),
  d3.csv('https://raw.githubusercontent.com/ScottyMacCVC/EoStoECMS/main/Resources/Report%20to%20Map/static/data/orders.csv'),
  d3.csv('https://raw.githubusercontent.com/ScottyMacCVC/EoStoECMS/main/Resources/Report%20to%20Map/static/data/7-23%20CONCRETE%20SCHED.csv'),
  d3.csv('https://raw.githubusercontent.com/ScottyMacCVC/EoStoECMS/main/Resources/Report%20to%20Map/static/data/ConcreteOrders.csv')
  // Network Files
  // d3.csv("file:///Z:/8-THE STANDARD/12-EoS to eCMS/Resources/Report to Map/Addresses List-Transform.csv"),
  // d3.csv("")

]).then(function(files) {
  
  // Debug Purpose: console.log the files.
  // console.log(files[0]);
  // console.log(files[1]);
  // console.log(files[2]);

  // Function to loop through data and add each entry to the map.
  var AddMarkers = function(entry)
  {
    JCLocations[entry['Job Code']] = [entry['Latitude'], entry['Longitude']];

    //Update our job details object.
    JCDetails[entry['Job Code']] = { JobCode : entry['Job Code'],
                                     JobName : entry['Job Name'],
                                     JobAddress : entry['Address'],
                                     JobTags : entry['Tags']};

    // Create a new marker for each entry.
    markers[entry['Job Code']] = L.circleMarker([entry.Latitude, entry.Longitude])
      // Adding all our options 
      .addTo(jobLocations)
      .on('click', onClick)
      .bindPopup(entry['Job Code']);
      //+ "<br>Address: " + entry['Address']);

  };

  // A Function to go through the orders and sort them by Job Number.
  var ExtractOrders = function(entry) {
    // DEBUG AREA
    // console.log(entry['Job Number(QProduct)']);

    // Check if the variable is undefined
    try {
      if ( entry['Job Number(QProduct)'] !== 'SRVICE' ) {
        

        
        if (orderMarkers[entry['Job Number(QProduct)']] === undefined) {

          // Get the content of the marker popup.
          // content = markers[entry['Job Number(QProduct)']].getPopup().getContent();

          JCDetails[entry['Job Number(QProduct)']]['JobOrders'] = "Part: " + entry['Part Description'] + "\tQuantity: " + entry['Quantity Shipped'] + "<br>";

          orderMarkers[entry['Job Number(QProduct)']] = L.circleMarker(JCLocations[entry['Job Number(QProduct)']])
            .addTo(orders)
            //.bindPopup(content + "Part: " + entry['Part Description'] + "        Quantity: " + entry['Quantity Shipped'] + "<br>")
            .on('click', onClick)
            .bindPopup(entry['Job Number(QProduct)'])
            .setStyle({color: 'orange', fillColor: 'orange'});
        }
        else {
          //content = orderMarkers[entry['Job Number(QProduct)']].getPopup().getContent();
          // console.log(content);

          JCDetails[entry['Job Number(QProduct)']]['JobOrders'] += "Part: " + entry['Part Description'] + "\tQuantity: " + entry['Quantity Shipped'] + "<br>";

          orderMarkers[entry['Job Number(QProduct)']].getPopup().setContent(content + "Part: " + entry['Part Description'] + "        Quantity: " + entry['Quantity Shipped'] + "<br>");
        }

        

        }
      } catch (e) {
        // console.log(e);
      }
  };

  // A Function to go through the orders and sort them by Job Number.
  var ExtractOrders2 = function(entry) {
    // DEBUG AREA


    // Check if the variable is undefined
    try {
      if ( entry['JOB CODE'] !== 'SRVICE' ) {
        // Get the content of the marker popup.
        content = markers[entry['JOB CODE']].getPopup().getContent();
        //console.log(content);
        orderMarkers[entry['JOB CODE']] = L.circleMarker(JCLocations[entry['JOB CODE']])
          .addTo(concreteOrders)
          .bindPopup(content + "Total Yards: " + entry['YARDS ORDERED'] + "    Supplier: " + entry['CONCRETE CO'] + "<br>")
          .setStyle({color: 'red', fillColor: 'red'});
        
        }
      } catch (e) {
        // console.log(e);
      }
  };

    // A Function to go through the orders and sort them by Job Number.
    var ExtractOrders3 = function(entry) {
      // DEBUG AREA

  
      // Check if the variable is undefined
      try {
        if ( entry['Job code'] !== 'SRVICE' ) {
          // Get the content of the marker popup.
          content = markers[entry['Job code']].getPopup().getContent();
          //console.log(content);
          concreteMarkers[entry['Job code']] = L.circleMarker(JCLocations[entry['Job code']])
          .addTo(concreteOrders)
          .bindPopup(content + "<br>Total Yards: " + entry['Total Yards'] + "    Supplier: " + entry['Supplier'] + "<br>")
          .setStyle({color: 'red', fillColor: 'red'});
          
          }
        } catch (e) {
          // console.log(e);
        }
    };

  //console.log(markers)

  // A function to be called when the user clicks on a marker.
  // Will update the sidebar with the information about the marker.
  function onClick(e) {
    //console.log(document.getElementById('sidebar-header').innerHTML);
    // Change the header name of the sidebar to the job code. 
    var tail = '<span class="sidebar-close"><i class="fa fa-caret-left"></i></span>'
    var jobCode = e.target.getPopup().getContent();

    const header = document.getElementById('sidebar-header').innerHTML;

    // Update the header of the sidebar.
    document.getElementById('sidebar-header').innerHTML = jobCode + tail;

    // Update the details section
    document.getElementById('details').innerHTML = JCDetails[jobCode]['JobName'] + "<br>" + JCDetails[jobCode]['JobAddress'] + "<br>" + JCDetails[jobCode]['JobTags'] + "<br>";

    // Update the recent orders section.
    document.getElementById('recent-orders').innerHTML = '<b>Recent Orders</b><br>' + JCDetails[jobCode]['JobOrders'];
    
    sidebar.open('home');
  }
  
  files[0].forEach(AddMarkers);
  files[1].forEach(ExtractOrders);
  // files[2].forEach(ExtractOrders2);
  // files[3].forEach(ExtractOrders3);

});

