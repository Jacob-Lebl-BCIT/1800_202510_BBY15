$(document).ready(function() {
    $('#calendar').evoCalendar({
    
        calendarEvents: [{
            id: 'event1',
            name: 'Event Name',
            date: 'March/12/2025',
            description:"This is a test description",
            type: "holiday",
            everyYear: true
        
        }
        ]
    })
})

