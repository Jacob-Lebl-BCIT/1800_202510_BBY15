const calendar = document.querySelector(".calendar"),
    date = document.querySelector(".date"),
    daysContainer = document.querySelector(".days"),
    prev = document.querySelector(".prev");
next = document.querySelector(".next");
todayBtn = document.querySelector(".today-btn");
gotoBtn = document.querySelector(".goto-btn");
dateInput = document.querySelector(".date-input");
eventDay = document.querySelector(".event-day"),
eventDate = document.querySelector(".event-date");
eventsContainer = document.querySelector(".events");
addEventSubmit = document.querySelector(".add-event-btn");


let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

//sets the empty array if there is no event
let eventsArray = [];

//then calls get
getEvents();

// function to add days :)
function initCalendar() {
    //to get the prev month, days and the current month
    //all days and rem next month days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 7 - lastDay.getDay() - 1;

    // updates the top of the calendar
    date.innerHTML = months[month] + " " + year;


    // adding days on DOM
    let days = "";
    for (let x = day; x > 0; x--) {
        days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
    }

    for (let i = 1; i <= lastDate; i++) {
        let event = eventsArray.some(eventObj => eventObj.day === i && eventObj.month === month + 1 && eventObj.year === year);
        if (i === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
            activeDay = i;
            getActiveDay(i);
            updateEvents(i);
            days += `<div class="day today active${event ? " event" : ""}">${i}</div>`;
        } else {
            days += `<div class="day${event ? " event" : ""}">${i}</div>`;
        }
    }

    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="day next-date">${j}</div>`;
    }
    daysContainer.innerHTML = days;
    addListener();
}

    initCalendar();

    // prev month

    function prevMonth() {
        month--;
        if (month < 0) {
            month = 11;
            year--;
        }
        initCalendar();
    }
    
    function nextMonth() {
        month++;
        if (month > 11) {
            month = 0;
            year++;
        }
        initCalendar();
    }
    
    //add eventListener on prev and next button

    prev.addEventListener("click", prevMonth);
    next.addEventListener("click", nextMonth);

    //goto date and goto today functionality section

    todayBtn.addEventListener("click", () => {
        today = new Date();
        month = today.getMonth();
        year = today.getFullYear();
        initCalendar();
    });

    dateInput.addEventListener("input", (e) => {
        dateInput.value = dateInput.value.replace(/[^0-9]/g, "");
        if (dateInput.value.length === 2) {
            //adds a slash if two numbers are entered
            dateInput.value += "/";
        } if (dateInput.value.length > 7) {
            //don't allow more than 7 characters
            dateInput.value = dateInput.value.slice(0, 7);
        } if (e.inputType === "deleteContentBackward") {
            if (dateInput.value.length === 3) {
                //delete the last character if backspace is pressed
                dateInput.value = dateInput.value.slice(0, 2);
            }
        }
    });

    gotoBtn.addEventListener("click", () => {
        const dateArr = dateInput.value.split("/");
        if (dateArr.length === 2 && dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
            month = dateArr[0] - 1;
            year = parseInt(dateArr[1]);
            initCalendar();
        } else {
            alert("Invalid Date");
        }
    });


    const addEventBtn = document.querySelector(".add-event"),
        addEventContainer = document.querySelector(".add-event-wrapper"),
        addEventCloseBtn = document.querySelector(".close"),
        addEventTitle = document.querySelector(".event-name"),
        addEventFrom = document.querySelector(".event-time-from"),
        addEventTo = document.querySelector(".event-time-to");



    addEventBtn.addEventListener("click", () => {
        addEventContainer.classList.toggle("active");
    });
    addEventCloseBtn.addEventListener("click", () => {
        addEventContainer.classList.remove("active");
    });

    document.addEventListener("click", (e) => {
        if (e.target !== addEventBtn && !addEventContainer.contains(e.target)) {
            addEventContainer.classList.remove("active");
        }
    });

    //Allows only 50 char in title
    addEventTitle.addEventListener("input", (e) => {
        addEventTitle.value = addEventTitle.value.slice(0, 50);
    });


    //time format in from and to time

    addEventFrom.addEventListener("input", (e) => {
        //removes anything else than numbers
        addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
        // if two numbers entered auto add ""
        if (addEventFrom.value.length === 2) {
            addEventFrom.value += ":";
            // don't allow more than 5 characters
        } if (addEventFrom.value.length > 5) {
            addEventFrom.value = addEventFrom.value.slice(0, 5);
        }
    });

    //same with to time
    addEventTo.addEventListener("input", (e) => {
        //removes anything else than numbers
        addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
        // if two numbers entered auto add ""
        if (addEventTo.value.length === 2) {
            addEventTo.value += ":";
            // don't allow more than 5 characters
        } if (addEventTo.value.length > 5) {
            addEventTo.value = addEventTo.value.slice(0, 5);
        }
    });


    function addListener() {
        const days = document.querySelectorAll(".day");
        days.forEach((day) => {
            day.addEventListener("click", (e) => {
                //set current day as active day
                activeDay = Number(e.target.innerHTML);

                //call active day after a click
                getActiveDay(e.target.innerHTML);
                updateEvents(Number(e.target.innerHTML));

                //remove active from already active day
                days.forEach((day) => {
                    day.classList.remove("active");
                });

                //if previous day is clicked 
                if (e.target.classList.contains("prev-date")) {
                    prevMonth();
                    setTimeout(() => {
                        //selects all days of that month
                        const days = document.querySelectorAll(".day");

                        //after the month is changed, add active class to the active day
                        days.forEach((day) => {
                            if (!day.classList.contains("prev-date") && day.innerHTML === e.target.innerHTML) {
                                day.classList.add("active");
                            }
                        });
                    }, 100);

                //same with next (month) date
                } else if (e.target.classList.contains("next-date")) {
                    nextMonth();
                    setTimeout(() => {

                        //selects all days of that month
                        const days = document.querySelectorAll(".day");

                        //after the month is changed, add active class to the active day
                        days.forEach((day) => {
                            if (!day.classList.contains("next-date") && day.innerHTML === e.target.innerHTML) {
                                day.classList.add("active");
                            }
                        });
                    }, 100);
                } else {
                    //remaining (Current) days
                    e.target.classList.add("active");

                }



            });
        });
    }



// fetch the active day
    function getActiveDay(date) {
        const day = new Date(year, month, date);
        eventDay.innerHTML = day.toString().split(" ")[0];
        eventDate.innerHTML = `${date} ${months[month]} ${year}`;
    }

// updates the events on the DOM
    function updateEvents(date) {
        let events = eventsArray.find(event => event.day === date && event.month === month + 1 && event.year === year)?.events.map(e => `
            <div class="event">
                <div class="title"><i class="fas fa-circle"></i><h3 class="event-title">${e.title}</h3></div>
                <div class="event-time"><span>${e.time}</span></div>
            </div>
        `).join("") || '<div class="no-event"><h3>No Events</h3></div>';
        eventsContainer.innerHTML = events;
        saveEvents();
    }

    // Javascript DOM for on-click event, when the user tries to add an event, go to a certain month, or go to today's date
addEventSubmit.addEventListener("click", () => {
    const title = addEventTitle.value.trim();
    const timeFrom = addEventFrom.value.trim();
    const timeTo = addEventTo.value.trim();
    if (!title || !timeFrom || !timeTo) {
        alert("Please fill all fields");
        return;
    }
    
    let timeFromFormatted = convertTime(timeFrom);
    let timeToFormatted = convertTime(timeTo);
    
    let eventAdded = eventsArray.some(event => event.day === activeDay && event.month === month + 1 && event.year === year);
    if (eventAdded) {
        eventsArray.find(event => event.day === activeDay && event.month === month + 1 && event.year === year).events.push({ title, time: `${timeFromFormatted} - ${timeToFormatted}` });
    } else {
        eventsArray.push({ day: activeDay, month: month + 1, year, events: [{ title, time: `${timeFromFormatted} - ${timeToFormatted}` }] });
    }
    updateEvents(activeDay);
    addEventWrapper.classList.remove("active");
});
    
function convertTime(time) {
    let [hour, min] = time.split(":");
    let format = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${min} ${format}`;
}


    //function to remove the events "on-click"

    eventsContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("event")) {
            const evenTitle = e.target.children[0].children[1].innerHTML;
            //get the title of event than search for the event in the eventsArray
            eventsArray.forEach((event) => {
                if (
                    event.day === activeDay &&
                    event.month === month + 1 &&
                    event.year === year
                ) {
                    event.events.forEach((item, index) => {
                        if (item.title === evenTitle) {
                            event.events.splice(index, 1);
                        }
                    });

                    //if there are no events left, remove the day from the eventsArray
                    if (event.events.length === 0) {
                        eventsArray.splice(eventsArray.indexOf(event), 1);
                        //after removing the event, remove the event class from the day
                        const activeDayElem = document.querySelector(".day.active");
                        if (activeDayElem.classList.contains("event")) {
                            activeDayElem.classList.remove("event");
                        }
                    }
                }
            });
            //update the events
            updateEvents(activeDay);
        }
    });


// Store events in local storage (CHANGE THIS TO FIREBASE)
// [March 19] This is trying to fetch the events from local storage, so it DOESNT WORK in the live server, we need to figure it out
// in our firestore :)

function saveEvents() {
    localStorage.setItem("events", JSON.stringify(eventsArray));
}

function getEvents() {
    if (localStorage.getItem("events" === null)) {
        return;
    }
    try {
    eventsArray.push(... JSON.parse(localStorage.getItem("events")));
    } catch (e) {
        console.error(e);
    }
}
