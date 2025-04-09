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
                // Redirect to login page or show a message
                if (!window.location.pathname.endsWith("/land") && !window.location.pathname.endsWith("/login")) {
                window.location.href = "/land";
                }

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

            // Notes propegation
            notes.forEach((note, index) => {
                const noteElement = document.createElement("div");
                noteElement.className = "note";
                noteElement.id = "note-" + index;
                // Body of the note
                noteElement.innerHTML = `
                    <div class="note-header">
                        <h3>${note.title}</h3>
                    </div>
                    <p>${truncateText(note.content, 20)}</p>
                    <div class="note-footer">
                        <span>Note #${index + 1}</span>
                    </div>`;

                // Create popover for this note
                const popover = document.createElement("div");
                popover.className = "note-popover";
                popover.id = "note-popover-" + index;
                popover.setAttribute("popover", "");
                popover.innerHTML = `
                    <div class="popover-header">
                        <h3>${note.title}</h3>
                        <button class="btn-close" popovertarget="note-popover-${index}"></button>
                    </div>
                    <div class="popover-content">
                        <p>${note.content}</p>
                        <div class="note-meta">
                            <span class="date">Created: ${note.timestamp ? new Date(note.timestamp.toDate()).toLocaleDateString() : 'Unknown'}</span>
                            <span class="category">Note #${index + 1}</span>
                        </div>
                        <div class="d-flex justify-content-end mt-3">
                            <button class="btn btn-danger" onclick="deleteNote('${note.title}')">Delete Note</button>
                        </div>
                    </div>`;
                document.body.appendChild(popover);

                // Add click event to show popover
                noteElement.addEventListener("click", () => {
                    popover.showPopover();
                });

                notesContainer.appendChild(noteElement);
            });
        })
        .catch(error => {
            console.error("Error fetching user notes:", error);
        });
}

// Add this function before the displayNotes function
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    
    // Find the last space before maxLength
    let truncated = text.substr(0, maxLength);
    let lastSpace = truncated.lastIndexOf(' ');
    
    // If we found a space, cut at that point and add ellipsis
    if (lastSpace !== -1) {
        return truncated.substr(0, lastSpace) + '...';
    }
    
    // If no space found, just cut at maxLength and add ellipsis
    return truncated + '...';
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

// Function to delete a note with confirmation
async function deleteNote(noteTitle) {
    // Close any open note popover first
    const openNotePopover = document.querySelector('div.note-popover[popover]:popover-open');
    if (openNotePopover) {
        openNotePopover.hidePopover();
    }

    // Create and show confirmation popover
    const confirmPopover = document.createElement('div');
    confirmPopover.setAttribute('popover', 'manual'); // Use manual to prevent auto-closing
    confirmPopover.className = 'note-popover'; // Use the same class as note popovers
    confirmPopover.innerHTML = `
        <div class="popover-header">
            <h3>Delete Note</h3>
            <button class="btn-close" popovertarget="${confirmPopover.id}"></button>
        </div>
        <div class="popover-content">
            <p>Are you sure you want to delete this note? This action cannot be undone.</p>
            <div class="note-meta">
                <span class="category">Deleting: ${noteTitle}</span>
            </div>
            <div class="d-flex justify-content-end mt-3">
                <button class="btn btn-secondary me-2" onclick="this.closest('[popover]').hidePopover()">Cancel</button>
                <button class="btn btn-danger confirm-delete">Delete Note</button>
            </div>
        </div>`;
    
    document.body.appendChild(confirmPopover);
    confirmPopover.showPopover();

    // Handle delete confirmation
    const deleteButton = confirmPopover.querySelector('.confirm-delete');
    deleteButton.addEventListener('click', async () => {
        try {
            const user = firebase.auth().currentUser;
            if (user) {
                // Delete the note from Firestore
                await db.collection("users").doc(user.uid).collection("notes").doc(noteTitle).delete();
                
                // Show success message using Toastify
                Toastify({
                    text: "Note deleted successfully!",
                    close: true,
                    duration: 2500,
                    style: {
                      background: "var(--secondary)",
                    },
                    offset: {
                        y: '3pc'
                    }
                }).showToast();

                // Hide confirmation popover
                confirmPopover.hidePopover();
                // Remove the popover element after hiding
                setTimeout(() => confirmPopover.remove(), 300);

                // Refresh the notes display
                displayNotes();
            }
        } catch (error) {
            console.error("Error deleting note:", error);
            Toastify({
                text: "Error deleting note. Please try again.",
                close: true,
                duration: 2500,
                style: {
                    background: "var(--danger)",
                },
                offset: {
                    y: '3pc'
                }
            }).showToast();
        }
    });

    // Remove popover when hidden
    confirmPopover.addEventListener('beforetoggle', (event) => {
        if (event.newState === 'closed') {
            setTimeout(() => confirmPopover.remove(), 300);
        }
    });
}

