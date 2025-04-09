/**
 * Creates a modal dialog for adding a new note using SweetAlert2 library
 * This function is triggered when the user clicks the associated button
 * 
 * @todo the "create note" request I think is sent from the client,
 * the client should send the request to the server, and the server should
 * handle the request and send it to the database -@Jacob-Lebl-BCIT
 */

/**
 * Handles the creation of a new note when the save button is clicked
 * This function is triggered by the onclick event of the save button in the popover
 */

async function userClick() {
    // Get values from the popover form inputs
    const titleInput = document.querySelector('#new-note-popover input[placeholder="Title"]');
    const contentInput = document.querySelector('#new-note-popover textarea[placeholder="Note content"]');
    
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    // Input validation
    if (!title) {
        alert('Title is required');
        return;
    }

    if (!content) {
        alert('Content is required');
        return;
    }

    if (title.length < 3) {
        alert('Title must be at least 3 characters');
        return;
    }

    try {
        // Create a new note in Firestore
        const user = firebase.auth().currentUser;
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        
        // Add note to user's notes subcollection with the document name as the title
        await db.collection("users").doc(user.uid).collection("notes").doc(title).set({
            title: title,
            content: content,
            timestamp: timestamp,
            lastModified: timestamp
        });
        
        // Clear the form
        titleInput.value = '';
        contentInput.value = '';
        
        // Close the popover
        const popover = document.getElementById('new-note-popover');
        popover.hidePopover();
        
        // Refresh the notes display
        if (window.location.pathname.includes('notes')) {
            displayCardsDynamically("notes");
        } else {
            displayNotes();
        }
        
    } catch (error) {
        console.error("Error saving note: ", error);
        alert('There was a problem saving your note. Please try again.');
    }
}

