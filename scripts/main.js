var currentUser;  

document.addEventListener("DOMContentLoaded", (event) => {
console.log("DOM fully loaded and parsed");
//Function that calls everything needed for the main page  
function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global

            // the following functions are always called when someone is logged in
            
            insertNameFromFirestore();

                fetch('/pages/skeleton/navbar_items.html')
                    .then(response => {
                        if (response.ok) {
                            return response.text();
                        }
                        throw new Error('Failed to load navigation');
                    })
                    .then(html => {
                        document.getElementById('navbar-items-placeholder').outerHTML = html;
                        console.log("html: " + html);

                         // add event listener to logout button after the HTML is loaded
                         document.getElementById("logout-button").addEventListener("click", logout);
                    })
                    .catch(error => {
                        console.error("Error loading navigation:", error);
                    });


                    
                    
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

