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


// TODO: Get a list of all the undefined job locations.
var undefinedJobLocations = [];

// An object to save the markers.
var JCLocations = {};

var locationMarkers = {};
var whOrderMarkers = {};
var concreteMarkers = {};

// An object of objects to save all the information about the jobs.
var JCDetails = {};

// Read in the data from our CSV file using d3.
Promise.all([

  // TODO: Figure our how to get data from local files.

  // Github Files
  d3.csv('https://raw.githubusercontent.com/mksmkzk/MappingReports/main/static/data/mapping.csv'),
  d3.csv('https://raw.githubusercontent.com/mksmkzk/MappingReports/main/static/data/orders.csv'),
  //d3.csv('https://raw.githubusercontent.com/mksmkzk/MappingReports/main/static/data/7-23%20CONCRETE%20SCHED.csv'),
  d3.csv('https://raw.githubusercontent.com/mksmkzk/MappingReports/main/static/data/ConcreteOrders.csv')
  // Network Files
  // d3.csv("file:///Z:/8-THE STANDARD/12-EoS to eCMS/Resources/Report to Map/Addresses List-Transform.csv"),
  // d3.csv("")

]).then(function(files) {
  
  // Debug Purpose: console.log the files.
  console.log(files[2]);


  // Function to loop through data and add each entry to the map.
  var AddMarkers = function(entry)
  {
    JCLocations[entry['Job Number']] = [entry['Latitude'], entry['Longitude']];

    //Update our job details object.
    JCDetails[entry['Job Number']] = { JobCode : entry['Job Number'],
                                     JobName : entry['Job Name'],
                                     JobAddress : entry['Address'],
                                     JobTags : entry['Tags']};

    // Create a new marker for each entry.
    locationMarkers[entry['Job Number']] = L.circleMarker([entry.Latitude, entry.Longitude])
      // Adding all our options 
      .addTo(jobLocations)
      .on('click', onClick)
      .bindPopup(entry['Job Number']);
  };

  // A Function to go through the orders and sort them by Job Number.
  var ExtractWarehouseOrders = function(entry) {
    // DEBUG AREA

    // Check if the variable is undefined
    try {
      if ( entry['Job Number'] !== 'SRVICE') {
        
        if (whOrderMarkers[entry['Job Number']] === undefined) {

          JCDetails[entry['Job Number']]['WHOrders'] = { [entry['Invoice Date']] : entry['Part Description'] + "\tQuantity: " + entry['Quantity Shipped'] + "<br>"};

          whOrderMarkers[entry['Job Number']] = L.circleMarker(JCLocations[entry['Job Number']])
            .addTo(orders)
            .on('click', onClick)
            .bindPopup(entry['Job Number'])
            .setStyle({color: 'orange', fillColor: 'orange'});
        }
        else {
          // console.log(content);
          if (JCDetails[entry['Job Number']]['WHOrders'][entry['Invoice Date']] === undefined) {
            JCDetails[entry['Job Number']]['WHOrders'][entry['Invoice Date']] = entry['Part Description'] + "\tQuantity: " + entry['Quantity Shipped'] + "<br>";
          } else {
            JCDetails[entry['Job Number']]['WHOrders'][entry['Invoice Date']] += entry['Part Description'] + "\tQuantity: " + entry['Quantity Shipped'] + "<br>";
          }
        }

        

        }
    } catch (error) {
      // Log any Errors.
      //console.log(entry['Job Number'])
      if (undefinedJobLocations.includes(entry["Job Number"]) === false) {
        undefinedJobLocations.push(entry["Job Number"]);
      }
      //console.log(error);
    }
  };

  // A Function to go through the orders and sort them by Job Number.
  var ExtractConcreteOrders = function(entry) {
    // DEBUG AREA

    // Check if the variable is undefined
    try {
      if (concreteMarkers[entry['JOB CODE']] === undefined) {

        JCDetails[entry['JOB CODE']]['ConOrders'] = { [entry['DATE']] : ["Type of Pour: " + entry['TYPE of POUR'] + "<br>" + 
                                                                          "Total Yards : " +  entry['YARDS ORDERED'] + "<br>" + 
                                                                          "Supplier: " + entry['CONCRETE CO'] + "<br>"]};
        
        concreteMarkers[entry['JOB CODE']] = L.circleMarker(JCLocations[entry['JOB CODE']])
          .addTo(concreteOrders)
          .bindPopup(entry['JOB CODE'])
          .on('click', onClick)
          .setStyle({color: 'red', fillColor: 'red'}); 
      } else {
        if (JCDetails[entry['JOB CODE']]['ConOrders'][entry['DATE']] === undefined) {
          JCDetails[entry['JOB CODE']]['ConOrders'][entry['DATE']] = ["Type of Pour: " + entry['TYPE of POUR'] + "<br>" + 
                                                                      "Total Yards : " +  entry['YARDS ORDERED'] + "<br>" + 
                                                                      "Supplier: " + entry['CONCRETE CO'] + "<br>"];
        } else {
          JCDetails[entry['JOB CODE']]['ConOrders'][entry['DATE']].push("Type of Pour: " + entry['TYPE of POUR'] + "<br>" + 
                                                                        "Total Yards : " +  entry['YARDS ORDERED'] + "<br>" + 
                                                                        "Supplier: " + entry['CONCRETE CO'] + "<br>");
        }    
      }
    } catch (e) {
      console.log(entry['JOB CODE']);
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
  function onClick(e) {
    // Get the jobcode from popup
    var jobCode = e.target.getPopup().getContent();
    PopulateSidebar(jobCode);
  }

  // Will update the sidebar with the information about the marker.
  function PopulateSidebar(jobCode) {
   
    // Change the header name of the sidebar to the job code. 
    var tail = '<span class="sidebar-close"><i class="fa fa-caret-left"></i></span>'

    // Update the header of the sidebar.
    document.getElementById('sidebar-header').innerHTML = jobCode + tail;

    // Update the details section
    document.getElementById('details').innerHTML = "Name: " + JCDetails[jobCode]['JobName'] + "<br>" +
                                                   "Address: " + JCDetails[jobCode]['JobAddress'] + "<br>" +
                                                   "Tags: " + JCDetails[jobCode]['JobTags'] + "<br>";

    // Update Warehouse Orders.
    if (JCDetails[jobCode]['WHOrders'] !== undefined) {
      document.getElementById('recent-orders').innerHTML = '<b>WareHouse Orders</b><br><br>';

      for (var key in JCDetails[jobCode]['WHOrders']){
        document.getElementById('recent-orders').innerHTML += "Date: " + key + "<br><br>" ;
        document.getElementById('recent-orders').innerHTML += JCDetails[jobCode]['WHOrders'][key] + "<br>";
      }
    }
    else {
      document.getElementById('recent-orders').innerHTML = '<b>WareHouse Orders</b><br><br>No recent warehouse orders for this job.<br><br>';
    }
    
    // Update Concrete Orders
    if (JCDetails[jobCode]['ConOrders'] !== undefined) {
      
      document.getElementById('concrete-orders').innerHTML = '<b>Concrete Orders</b><br><br>';

      for (var key in JCDetails[jobCode]['ConOrders']){
        document.getElementById('concrete-orders').innerHTML += "Date: " + key + "<br><br>" ;
        document.getElementById('concrete-orders').innerHTML += JCDetails[jobCode]['ConOrders'][key] + "<br>";
      }
    } else {
      document.getElementById('concrete-orders').innerHTML = '<b>Concrete Orders</b><br>No recent concrete orders for this job.<br><br>';
    }

    sidebar.open('home');
  }

  // A function to loop through the markers and open the popup.
  async function OpenPopupLoop(markers) {
    for (var key in markers) {
      markers[key].openPopup();
      PopulateSidebar(key);
      

      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  }
  
  files[0].forEach(AddMarkers);
  files[1].forEach(ExtractWarehouseOrders);
  files[2].forEach(ExtractConcreteOrders);
  // files[3].forEach(ExtractOrders3);


  // Open the popup of the first marker.
  //OpenPopupLoop(concreteMarkers);

});

