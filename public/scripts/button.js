/**
 * Creates a modal dialog for adding a new note using SweetAlert2 library
 * This function is triggered when the user clicks the associated button
 */

async function userClick() {
    // Using SweetAlert2 to create an interactive modal dialog
    // The 'await' keyword pauses execution until the user interacts with the dialog
    // The destructured 'value' is renamed to 'formValues' for clarity
    const { value: formValues } = await Swal.fire({
        title: "Create a new Note!", // Sets the title text at the top of the modal
        
        // The 'html' option allows us to define custom form elements
        // We create two input fields: one for the title and one for the content
        html:
            '<input id="swal-title" class="swal2-input" placeholder="Title">' + // Title input field
            '<textarea id="swal-content" class="swal2-textarea" placeholder="Note content"></textarea>', // Content textarea - allows multiline input
        
        focusConfirm: false, // Prevents the Confirm button from being automatically focused
        showCancelButton: true, // Adds a Cancel button to let users abort the operation
        
        // The preConfirm function runs when the user clicks the Confirm button
        // It collects and validates the form data before proceeding
        preConfirm: () => {
            // Get values from both input fields
            const title = document.getElementById('swal-title').value;
            const content = document.getElementById('swal-content').value;
            
            // Input validation - ensure the title is provided
            if (!title) {
                Swal.showValidationMessage('Title is required'); // Shows an error message below the inputs
                return false; // Returning false prevents the modal from closing
            }
            
            // Input validation - ensure content is provided
            if (!content) {
                Swal.showValidationMessage('Content is required');
                return false;
            }
            
            // Additional validation - enforce minimum title length
            if (title.length < 3) {
                Swal.showValidationMessage('Title must be at least 3 characters');
                return false;
            }
            
            // Return the validated values as an object to be used later
            return { title, content };
        }
    });

    // This code executes after the modal is closed
    // formValues will be undefined if the user clicked Cancel or closed the modal
    // formValues will contain the title and content if validation passed
    if (formValues) {
        // Show a success message with the entered information
        Swal.fire(
            'Note Created!', // Success dialog title
            `Title: ${formValues.title}<br>Content: ${formValues.content}`, // Display the collected data
            'success' // Sets the icon to a checkmark
        );
        
        // TODO: We need to Save the notes in our database (yes, the comments are all AI generated)
        
        // TODO: Update the UI to show the new note, e.g., by adding a new card also sync it with our "all notes" section
    }
}