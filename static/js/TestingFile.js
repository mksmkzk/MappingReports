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
var recentOrderList = [];

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
  d3.csv('https://raw.githubusercontent.com/mksmkzk/MappingReports/main/static/data/ConcreteOrdersMap.csv')
  // Network Files
  // d3.csv("file:///Z:/8-THE STANDARD/12-EoS to eCMS/Resources/Report to Map/Addresses List-Transform.csv"),
  // d3.csv("")

]).then(function(files) {
  
  // Debug Purpose: console.log the files.
  //console.log(files[2]);


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

          if (recentOrderList.includes(entry['Job Number']) === false && entry['Job Number'] !== '') {  
             recentOrderList.push(entry['Job Number']);
             document.getElementById('locationList').innerHTML += '<li><a href="#" onclick="PopulateSidebar(\'' + entry['Job Number'] + '\')">' + entry['Job Number'] + '</a></li>';
          }

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

        JCDetails[entry['JOB CODE']]['ConOrders'] = { [entry['DATE']] : [{ division : entry['DIVSIONS'],
                                                                          crew : entry['CREW'],
                                                                          subjob : entry['SUB JOB'],
                                                                          customer : entry['CUSTOMER'],
                                                                          pourType :  entry['TYPE of POUR'], 
                                                                          totalYards : entry['YARDS ORDERED'],
                                                                          supplier : entry['CONCRETE CO'],
                                                                          supplierPhone : entry['PHONE NO'],
                                                                          startTime : entry['START TIME'],
                                                                          comments : entry['COMMENTS']}] };
        
  
        if (recentOrderList.includes(entry['JOB CODE']) === false && entry['JOB CODE'] !== '') {  
          recentOrderList.push(entry['JOB CODE']);
          document.getElementById('locationList').innerHTML += '<li><a href="#" onclick="PopulateSidebar(' + entry['JOB CODE'] + ')">' + entry['JOB CODE'] + '</a></li>';
        }

        concreteMarkers[entry['JOB CODE']] = L.circleMarker(JCLocations[entry['JOB CODE']])
          .addTo(concreteOrders)
          .bindPopup(entry['JOB CODE'])
          .on('click', onClick)
          .setStyle({color: 'red', fillColor: 'red'}); 
      } else {
        if (JCDetails[entry['JOB CODE']]['ConOrders'][entry['DATE']] === undefined) {
          JCDetails[entry['JOB CODE']]['ConOrders'][entry['DATE']] = [{ division : entry['DIVISION'],
                                                                        crew : entry['CREW'],
                                                                        subjob : entry['SUB JOB'],
                                                                        customer : entry['CUSTOMER'],
                                                                        pourType :  entry['TYPE of POUR'], 
                                                                        totalYards : entry['YARDS ORDERED'],
                                                                        supplier : entry['CONCRETE CO'],
                                                                        supplierPhone : entry['PHONE NO'],
                                                                        startTime : entry['START TIME'],
                                                                        comments : entry['COMMENTS']}];
        } else {
          JCDetails[entry['JOB CODE']]['ConOrders'][entry['DATE']].push({division : entry['DIVISION'],
                                                                          crew : entry['CREW'],
                                                                          subjob : entry['SUB JOB'],
                                                                          customer : entry['CUSTOMER'],
                                                                          pourType :  entry['TYPE of POUR'], 
                                                                          totalYards : entry['YARDS ORDERED'],
                                                                          supplier : entry['CONCRETE CO'],
                                                                          supplierPhone : entry['PHONE NO'],
                                                                          startTime : entry['START TIME'],
                                                                          comments : entry['COMMENTS']});
        }    
      }
    } catch (e) {
      console.log(entry['JOB CODE']);
        // console.log(e);
        if (undefinedJobLocations.includes(entry["JOB CODE"]) === false) {
          undefinedJobLocations.push(entry["JOB CODE"]);
        }
    }
  };


  // A function to be called when the user clicks on a marker.
  function onClick(e) {
    // Get the jobcode from popup
    var jobCode = e.target.getPopup().getContent();
    PopulateSidebar(jobCode);
  }

  


  
  files[0].forEach(AddMarkers);
  files[1].forEach(ExtractWarehouseOrders);
  files[2].forEach(ExtractConcreteOrders);
  // files[3].forEach(ExtractOrders3);  

  
});

// A function to loop through the markers and open the popup.
async function OpenPopupLoop(markers) {
  for (var key in markers) {
    markers[key].openPopup();
    PopulateSidebar(key);
    

    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Infinite loop to cycle concrete orders

// OpenPopupLoop(concreteMarkers);

