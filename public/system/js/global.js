function handleLocal() {
    // Prompt box to enter National ID and DOB
    var nationalID = prompt("Please enter your National ID:");
    var dob = prompt("Please enter your Date of Birth (YYYY-MM-DD):");

    // Move to index1.html
    if (nationalID && dob) {
        window.location.href = "bookinglocal.html";
    }
};