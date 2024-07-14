// Toggle Visibility Of Navbar When Button Clicked

// Send Email

const msg = document.querySelector(".form-message");

(function () {
  // https://dashboard.emailjs.com/admin/account
  emailjs.init("9eiNImI62_6mzNwoH");
})();

window.onload = function () {
  document
    .getElementById("contact-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      document.querySelector(".loader").classList.add("show");
      // these IDs from the previous steps
      emailjs.sendForm("service_laa7f79", "template_xdbejdi", this).then(
        function () {
          document.getElementById("contact-form").reset();
          document.querySelector(".loader").classList.remove("show");
          msg.innerHTML = "";
          msg.innerHTML += "<span class='success-msg'>Email Sent</span>";
          msg.classList.add("show");
          setTimeout(() => msg.classList.remove("show"), 2000);
        },
        function (error) {
          document.querySelector(".loader").classList.toggle("show");
          msg.classList.add("show");
          msg.innerHTML += "<span class='error-msg'>Email Not Sent</span>";
        }
      );
    });
};
