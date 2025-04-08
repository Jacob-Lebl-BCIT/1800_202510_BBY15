// This file handles fetching and displaying events from Firestore

/**
 * Fetches events from Firestore and displays them in the events container
 */
function displayEvents() {
    // Get the events container element
    const eventsContainer = document.querySelector(".container");
    
    // Clear existing content
    eventsContainer.innerHTML = "";
    
    // Check if user is logged in
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // Reference to the user's events subcollection (same as in scripts-calendar.js)
        const eventsRef = firebase.firestore()
          .collection("users")
          .doc(user.uid)
          .collection("events");
        
        // Get events from Firestore
        eventsRef.get()
          .then((querySnapshot) => {
            if (querySnapshot.empty) {
              // If no events, display a message
              eventsContainer.innerHTML = '<div class="alert alert-info">No upcoming classes found.</div>';
            } else {
              // Process all events from all days
              let allEvents = [];
              
              // Collect all events from each day document
              querySnapshot.forEach((doc) => {
                const dayEventData = doc.data();
                
                // Each document has multiple events inside its 'events' array
                if (dayEventData.events && dayEventData.events.length > 0) {
                  // Create event objects with date information
                  dayEventData.events.forEach(event => {
                    allEvents.push({
                      title: event.title,
                      description: event.description || "No description available",
                      time: event.time,
                      day: dayEventData.day,
                      month: dayEventData.month,
                      year: dayEventData.year
                    });
                  });
                }
              });
              
              // Sort events by date (nearest first)
              allEvents.sort((a, b) => {
                const dateA = new Date(a.year, a.month - 1, a.day);
                const dateB = new Date(b.year, b.month - 1, b.day);
                return dateA - dateB;
              });
              
              // Filter out past events
              const today = new Date();
              today.setHours(0, 0, 0, 0); // Set to beginning of day
              
              const upcomingEvents = allEvents.filter(event => {
                const eventDate = new Date(event.year, event.month - 1, event.day);
                return eventDate >= today;
              });
              
              // Limit to 5 upcoming events
              const eventsToDisplay = upcomingEvents.slice(0, 5);
              
              if (eventsToDisplay.length === 0) {
                eventsContainer.innerHTML = '<div class="alert alert-info">No upcoming classes found.</div>';
              } else {
                // Display each event
                eventsToDisplay.forEach((event) => {
                  // Format the date
                  const eventDate = new Date(event.year, event.month - 1, event.day);
                  const day = eventDate.getDate();
                  const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
                  const dayOfWeek = eventDate.toLocaleString('default', { weekday: 'long' });
                  
                  // Get time from the event (already formatted in scripts-calendar.js)
                  const eventTime = event.time;
                  
                  // Create HTML for this event
                  const eventCard = `
                    <div class="row row-striped">
                      <div class="col-2 text-right">
                        <h1 class="display-4">${day}</h1>
                        <h2>${month}</h2>
                      </div>
                      <div class="col-10">
                        <h3 class="text-uppercase"><strong>${event.title || 'Event'}</strong></h3>
                        <ul class="list-inline">
                          <li class="list-inline-item"><i class="fa fa-calendar-o" aria-hidden="true"></i> ${dayOfWeek}</li>
                          <li class="list-inline-item"><i class="fa fa-clock-o" aria-hidden="true"></i> ${eventTime}</li>
                        </ul>
                        <p>${event.description}</p>
                      </div>
                    </div>
                  `;
                  
                  // Add this event to the container
                  eventsContainer.innerHTML += eventCard;
                });
              }
            }
          })
          .catch((error) => {
            console.error("Error getting events: ", error);
            eventsContainer.innerHTML = '<div class="alert alert-danger">Error loading events. Please try again later.</div>';
          });
      } else {
        // User not logged in
        eventsContainer.innerHTML = '<div class="alert alert-warning">Please log in to see your upcoming classes.</div>';
      }
    });
  }
  
  // Execute when the document is loaded
  document.addEventListener('DOMContentLoaded', function() {
    console.log("Events.js loaded, initializing event display");
    displayEvents();
  });