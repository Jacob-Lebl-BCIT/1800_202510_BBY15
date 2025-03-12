function loadSkeleton() {
    fetch('/pages/skeleton/nav.html')
        .then(response => {
            if (response.ok) {
                return response.text();
            }
            throw new Error('Failed to load navigation');
        })
        .then(html => {
            document.getElementById('placeholder_nav').innerHTML = html;
            console.log("Navigation loaded successfully");
        })
        .catch(error => {
            console.error("Error loading navigation:", error);
        });
}

loadSkeleton();