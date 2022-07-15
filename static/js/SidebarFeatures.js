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
      document.getElementById('recent-orders').innerHTML = '<b>Warehouse Orders</b><br><br>';
  
      for (var key in JCDetails[jobCode]['WHOrders']){
        document.getElementById('recent-orders').innerHTML += "Date: " + key + "<br><br>" ;
        document.getElementById('recent-orders').innerHTML += JCDetails[jobCode]['WHOrders'][key] + "<br>";
      }
    }
    else {
      document.getElementById('recent-orders').innerHTML = '<b>Warehouse Orders</b><br><br>No recent warehouse orders for this job.<br><br>';
    }
    
    // Update Concrete Orders
    if (JCDetails[jobCode]['ConOrders'] !== undefined) {
      console.log(JCDetails[jobCode]['ConOrders']);
      document.getElementById('concrete-orders').innerHTML = '<b>Concrete Orders</b><br>';
  
      for (var key in JCDetails[jobCode]['ConOrders']){
        JCDetails[jobCode]['ConOrders'][key].forEach(function(jobParam) {
          console.log(jobParam);
  
          document.getElementById('concrete-orders').innerHTML += "<br>Div: " + jobParam.division + "    Date: " + key +  "    Sub Job: " + jobParam.subjob + "<br><br>";
          document.getElementById('concrete-orders').innerHTML += "Customer: " + jobParam.customer + "<br>" +
                                                                  "Pour Type: " + jobParam.pourType + "<br>" +
                                                                  "Crew: " + jobParam.crew + "<br>" +
                                                                  "Start Time: " + jobParam.startTime + "<br>" +
                                                                  "Yards Ordered: " + jobParam.totalYards + "<br>" +
                                                                  "Supplier: " + jobParam.supplier + "<br>" +
                                                                  "Supplier Phone: " + jobParam.supplierPhone + "<br>" +
                                                                  "Comments: " + jobParam.comments + "<br>";
        });
      }
    } else {
      document.getElementById('concrete-orders').innerHTML = '<b>Concrete Orders</b><br>No recent concrete orders for this job.<br><br>';
    }
  
    sidebar.open('home');
  }
