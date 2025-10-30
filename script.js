// FORM SUBMISSION HANDLER WITH GOOGLE SHEETS INTEGRATION
document.addEventListener("DOMContentLoaded", function () {
  const applicationForm = document.getElementById("applicationForm");
  const submitBtn = document.getElementById("submitBtn");

  // Check if elements exist before using them
  if (submitBtn) {
    const btnText = submitBtn.querySelector(".btn-text");
    const btnLoading = submitBtn.querySelector(".btn-loading");
  }

  // Initialize floating labels
  if (applicationForm) {
    initFloatingLabels();
  }

  if (applicationForm) {
    applicationForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      // Show loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        const btnText = submitBtn.querySelector(".btn-text");
        const btnLoading = submitBtn.querySelector(".btn-loading");
        if (btnText && btnLoading) {
          btnText.style.display = "none";
          btnLoading.style.display = "inline-block";
        }
      }

      try {
        // Get form data
        const formData = getFormData();
        console.log("Submitting form data:", formData);

        // Send to Google Sheets
        await submitToGoogleSheets(formData);

        // Show success message
        showMessage(
          "Application submitted successfully! We will contact you soon.",
          "success"
        );
        applicationForm.reset();
        resetFloatingLabels();
      } catch (error) {
        console.error("Submission error:", error);
        showMessage(
          "There was an error submitting your application. Please try again.",
          "error"
        );
      } finally {
        // Reset button state
        if (submitBtn) {
          submitBtn.disabled = false;
          const btnText = submitBtn.querySelector(".btn-text");
          const btnLoading = submitBtn.querySelector(".btn-loading");
          if (btnText && btnLoading) {
            btnText.style.display = "inline-block";
            btnLoading.style.display = "none";
          }
        }
      }
    });
  }

  // Initialize floating labels functionality
  function initFloatingLabels() {
    const floatingInputs = document.querySelectorAll(
      ".form-group.floating input"
    );

    floatingInputs.forEach((input) => {
      // Set initial state
      if (input.value) {
        input.parentElement.classList.add("filled");
      }

      // Add event listeners
      input.addEventListener("focus", function () {
        this.parentElement.classList.add("focused");
      });

      input.addEventListener("blur", function () {
        if (!this.value) {
          this.parentElement.classList.remove("focused");
        }
        this.parentElement.classList.toggle("filled", !!this.value);
      });
    });
  }

  // Reset floating labels after form submission
  function resetFloatingLabels() {
    const floatingInputs = document.querySelectorAll(
      ".form-group.floating input"
    );
    floatingInputs.forEach((input) => {
      input.parentElement.classList.remove("focused", "filled");
    });
  }

  // Get form data as object
  function getFormData() {
    const formData = new FormData(applicationForm);
    return {
      fullname: formData.get("fullname") || "",
      address: formData.get("address") || "",
      city: formData.get("city") || "",
      email: formData.get("email") || "",
      phone: formData.get("phone") || "",
      terms: formData.get("terms") ? "Yes" : "No",
      newsletter: formData.get("newsletter") ? "Yes" : "No",
      timestamp: new Date().toISOString(),
      source: "Website Application Form",
    };
  }

  // Submit data to Google Sheets
  async function submitToGoogleSheets(formData) {
    // Your Google Apps Script Web App URL
    const GOOGLE_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbyCGumuqiurqev-dQ-glpkHka9HGzL9O182tWBcV4r_u4u2RMb_ONt-UGMVOcRBZePmrw/exec";

    try {
      // Use no-cors mode for Google Apps Script
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Important for Google Apps Script
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // With no-cors mode, we can't read the response
      // So we assume success if no error is thrown
      console.log("Form submitted to Google Sheets");
      return { result: "success" };
    } catch (error) {
      console.error("Error submitting to Google Sheets:", error);
      throw new Error("Failed to submit application");
    }
  }

  // Show message to user
  function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector(".form-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create new message
    const messageDiv = document.createElement("div");
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.textContent = message;

    // Add styles
    messageDiv.style.cssText = `
      padding: 1rem;
      margin: 1rem 0;
      border-radius: 8px;
      font-weight: 500;
      text-align: center;
      ${
        type === "success"
          ? "background-color: #d1fae5; color: #065f46; border: 1px solid #a7f3d0;"
          : "background-color: #fee2e2; color: #991b1b; border: 1px solid #fecaca;"
      }
    `;

    // Insert message before the form
    if (applicationForm) {
      applicationForm.parentNode.insertBefore(messageDiv, applicationForm);
    }

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.remove();
      }
    }, 5000);
  }

  // Set target date to October 31, 2025 at 11:59:59 PM
  const targetDate = new Date("October 31, 2025 23:59:59").getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    // If countdown is finished
    if (distance < 0) {
      const countdownElement = document.querySelector(".countdown-inline");
      if (countdownElement) {
        countdownElement.innerHTML =
          '<span style="color: #ffeb3b; font-weight: bold;">EXPIRED</span>';
      }
      return;
    }

    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update the countdown display
    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");

    if (daysElement) daysElement.textContent = days;
    if (hoursElement) hoursElement.textContent = hours;
    if (minutesElement) minutesElement.textContent = minutes;
    if (secondsElement) secondsElement.textContent = seconds;
  }

  // Update countdown immediately
  updateCountdown();

  // Update countdown every second
  setInterval(updateCountdown, 1000);

  // SET CURRENT YEAR IN FOOTER
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
