// For form validations
// Bootstap will check validations over here. It will make an array of all parts where 'check-validation' class is applied and will loop over them one by one to check them individually.
// If any part breaks validation, it will stop the form submission and propagation.

(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to.
    const forms = document.querySelectorAll('.check-validation')

    // Loop over them and prevent submission
    Array.from(forms)
        .forEach(function (form) {
            // On submit, check all those fields.
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }
                // change classes to 'was-validated', once checked and found true.
                form.classList.add('was-validated')
            }, false)
        })
})()