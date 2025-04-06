var currentUser;
document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");
    //Function that calls everything needed for the main page  
    function doAll() {
        firebase.auth().onAuthStateChanged(user => {
            console.log("Auth state changed");
            if (user) {
                currentUser = db.collection("users").doc(user.uid); //global
                console.log(currentUser);
                // the following functions are always called when someone is logged in

                insertNavBar();

                // insertNewNoteButton();

                displayCardsDynamically("notes");

            } else {
                // No user is signed in.
                console.log("No user is signed in");
                // window.location.href = "/login";
            }
        });
    }
    doAll();
});


function insertNavBar() {
    fetch('/pages/skeleton/navbar_items.html')
        .then(response => {
            if (response.ok) {
                return response.text();
            }
            throw new Error('Failed to load navigation');
        })
        .then(html => {
            document.getElementById('navbar-items-placeholder').outerHTML = html;

            // add event listener to logout button after the HTML is loaded
            document.getElementById("logout-button").addEventListener("click", logout);
        })
        .catch(error => {
            console.error("Error loading navigation:", error);
        });
}

function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("noteCardTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable.     
    const notesContainer = document.getElementById("notes-container");
    notesContainer.innerHTML = "";
    const user = firebase.auth().currentUser;    
    const notesContainerElement = document.createElement("div");
    notesContainerElement.classList.add("row");
    notesContainerElement.classList.add("row-cols-1");
    notesContainerElement.classList.add("row-cols-md-3");
    notesContainerElement.classList.add("g-4");
    
    const notesSnapshot = db.collection("users").doc(user.uid).collection("notes").orderBy("timestamp", "desc").get()
        .then(allNotes => {
            var i = 1;  
            allNotes.forEach(doc => { 
                
                const noteElement = document.createElement("div");
                noteElement.className = "col";
                noteElement.id = "note-" + i;
                const cardContainerElement = document.createElement("div");
                cardContainerElement.classList.add("card");
                cardContainerElement.classList.add("h-100");
                noteElement.appendChild(cardContainerElement);
                const cardBodyElement = document.createElement("div");
                cardBodyElement.className = "card-body";
                const cardTitleElement = document.createElement("h5");
                const cardSubTitleElement = document.createElement("h6");
                const cardTextElement = document.createElement("p");

                cardTitleElement.className = "card-title";
                cardTitleElement.innerText = doc.data().title;
                
                cardTextElement.className = "card-text";
                cardTextElement.innerText = doc.data().content;
                const cardFooterElement = document.createElement("div");
                cardFooterElement.classList.add("card-footer");
                cardFooterElement.classList.add("d-flex");
                cardFooterElement.classList.add("justify-content-between");

                const cardFooterFullNoteElement = document.createElement("a");
                cardFooterFullNoteElement.className = ("card-link");
                cardFooterFullNoteElement.innerText = "Full Note";

                const cardFooterShareElement = document.createElement("a");
                cardFooterShareElement.className = ("card-link");
                cardFooterShareElement.innerText = "Share";
                cardFooterElement.appendChild(cardFooterFullNoteElement);
                cardFooterElement.appendChild(cardFooterShareElement);
                cardBodyElement.appendChild(cardTitleElement);
                cardBodyElement.appendChild(cardSubTitleElement);
                cardBodyElement.appendChild(cardTextElement);
                
                cardContainerElement.appendChild(cardBodyElement);
                cardContainerElement.appendChild(cardFooterElement);
                notesContainerElement.appendChild(noteElement);

                // Create popover for this note
                const popover = document.createElement("div");
                popover.className = "note-popover";
                popover.id = "note-popover-" + i;
                popover.setAttribute("popover", "");
                popover.innerHTML = `
                    <div class="popover-header">
                        <h3>${doc.data().title}</h3>
                        <button class="btn-close" popovertarget="note-popover-${i}"></button>
                    </div>
                    <div class="popover-content">
                        <p>${doc.data().content}</p>
                        <div class="note-meta">
                            <span class="date">Created: ${doc.data().timestamp ? new Date(doc.data().timestamp.toDate()).toLocaleDateString() : 'Unknown'}</span>
                            <span class="category">Note #${i + 1}</span>
                        </div>
                    </div>`;
                document.body.appendChild(popover);
                // Add click event to show popover
                cardFooterFullNoteElement.addEventListener("click", () => {
                    popover.showPopover();
                });
                i++;
            })
            notesContainer.appendChild(notesContainerElement);
        })
}
function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log("logging out user");

        window.location.href = "/";

    }).catch((error) => {
        // An error happened.
        console.log("error logging out user: " + error);
    });
}