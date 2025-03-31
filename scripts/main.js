// will contain user id when logged in
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

                insertNameFromFirestore();

                insertNavBar();

                insertNewNoteButton();

                displayNotes();

            } else {
                // No user is signed in.
                console.log("No user is signed in");
                // window.location.href = "/login";
            }
        });
    }
    doAll();



});
// Insert name function using the global variable "currentUser"
function insertNameFromFirestore() {
    currentUser.get().then(userDoc => {
        //get the user name
        var user_Name = userDoc.data().name;
        console.log(user_Name);
        // $("#name-goes-here").text(user_Name); //jquery
        document.getElementById("name-goes-here").innerText = user_Name;
    })
}

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
            consofetchle.error("Error loading navigation:", error);
        });
}

function insertNewNoteButton() {
    // insert the new note button
    fetch('/pages/skeleton/new_note_btn.html')
        .then(response => {
            if (response.ok) {
                return response.text();
            }
            throw new Error('Failed to load new note button');
        })
        .then(html => {
            document.getElementById('placeholder-new-note-btn').outerHTML = html;
        })
        .catch(error => {
            console.error("Error loading new note button:", error);
        });

}

// Function to fetch user notes from Firestore
async function fetchUserNotes() {
    const user = firebase.auth().currentUser;
    if (user) {
        const notesSnapshot = await db.collection("users").doc(user.uid).collection("notes").orderBy("timestamp", "desc").get();
        return notesSnapshot.docs.map(doc => doc.data());
    }
    return [];
}

// display notes function
function displayNotes() {
    fetchUserNotes()
        .then(notes => {
            const notesContainer = document.getElementById("notes-container");
            notesContainer.innerHTML = ""; // Clear existing notes

            if (notes.length === 0) {
                notesContainer.innerHTML = "<p>No notes available.</p>";
                return;
            }

            notes.forEach(note => {
                const noteElement = document.createElement("div");
                noteElement.className = "note card px-3 py-3 mb-3";
                noteElement.innerHTML = `
                    <h3>${note.title}</h3>
                    <p>${note.content}</p>
                    <button class="details-note-btn" data-note-id="${note.id}">Details</button>
                `;
                notesContainer.appendChild(noteElement);
            });

            // Add event listeners to open details for each note
            const deleteButtons = document.querySelectorAll(".details-note-btn");
            deleteButtons.forEach(button => {
                button.addEventListener("click", openDetails);
            });
        })
        .catch(error => {
            console.error("Error fetching user notes:", error);
        });
}


loadNotes = new Promise((resolve, reject) => {});



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

