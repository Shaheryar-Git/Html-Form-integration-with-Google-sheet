const consultantLinks = {
  Agostino: "https://calendly.com/agostino",
  Domenico: "https://calendly.com/domenico",
  Paolo: "https://calendly.com/paolo",
};

// Retrieve existing codes from local storage or set default
let existingCodes = JSON.parse(localStorage.getItem("existingCodes")) || ["CODE1", "CODE2", "CODE3", "CODE4","CODE5", "CODE6", "CODE7", "CODE8", "CODE9","CODE10"];

let usedCodes = JSON.parse(localStorage.getItem("usedCodes")) || [];

let isLoading = false; // Variable to track loading state

document.getElementById("form").addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = {};
  formData.forEach(function (value, key) {
    data[key] = value;
  });

  const enteredCode = data["Codice"];

  // Check if the code is in existingCodes
    if (!existingCodes.includes(enteredCode)) {
      Swal.fire({
        icon: "error",
        title: "Invalid CODE!",
        confirmButtonText: "OK",
      });
      return; // Exit the function without submitting
    }

  // Check if the code has already been used
  if (usedCodes.includes(enteredCode)) {
    Swal.fire({
      icon: "error",
      title: "Code Already Used!",
      confirmButtonText: "OK",
    });
    return; // Exit the function without submitting
  }


  // Set loading state to true and update button
  setLoadingState(true);

  const selectedConsultant = data["Consulente"]; // Ensure the form input name is exactly 'Consulente'

  // Check if a consultant is selected and valid
  if (selectedConsultant && consultantLinks[selectedConsultant]) {
    // Submit data via fetch request
    fetch(
      "https://script.google.com/macros/s/AKfycbwrIHzQ8WbHsxHJAsGEYb4VGb_3d9Ig8KqjtG8QxBAcoyfri4Byti-FALKi_HZ-owsVQQ/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        mode: "no-cors",
      }
    )
      .then(() => {
        // On successful form submission
        Swal.fire({
          icon: "success",
          title: "Form Submitted Successfully!",
          text: "Your form has been submitted successfully! Redirecting to the consultant's page.",
          timer: 5000,
        }).then(() => {
          // Redirect to consultant's Calendly link
          window.location.href = consultantLinks[selectedConsultant];
        });

        // Remove the used code from existingCodes and update local storage
        existingCodes = existingCodes.filter((code) => code !== enteredCode);
        usedCodes.push(enteredCode);

        localStorage.setItem("existingCodes", JSON.stringify(existingCodes));
        localStorage.setItem("usedCodes", JSON.stringify(usedCodes));
        console.log("Updated Existing Codes:", existingCodes);
        console.log("Updated Used Codes:", usedCodes);

        // Reset the form
        document.getElementById("form").reset();
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Error Submitting Form",
          text: "Please try again later.",
          confirmButtonText: "OK",
        });
      })
      .finally(() => {
        // Set loading state to false after submission completes
        setLoadingState(false);
      });
  } else {
    // Set loading state to false if no consultant is selected
    setLoadingState(false);
    Swal.fire({
      icon: "error",
      title: "Select a Consultant!",
      text: "Please select a consultant.",
      confirmButtonText: "OK",
    });
  }
});

// Function to update the loading state and button text
function setLoadingState(loading) {
  isLoading = loading;
  const submitButton = document.getElementById("submitButton");
  if (loading) {
    submitButton.textContent = "Submitting..."; // Change button text to indicate loading
    submitButton.disabled = true; // Disable the button during loading
  } else {
    submitButton.textContent = "Submit Form"; // Reset button text after loading
    submitButton.disabled = false; // Re-enable the button
  }
}
