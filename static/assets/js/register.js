const form = document.getElementById('register-form');
const nameInput = document.getElementById('name-input');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const isAdminInput = document.getElementById('is-admin-input');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!validateInputs()) {
    return;
  }

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const isAdmin = isAdminInput.checked;

  // TODO: The register will be fully implemented once the API is implemented.
  try {
    await register({ name, email, password, isAdmin });
  } catch (error) {
    console.error(error);
    alert('An error occurred in registration. Please try again.');
  }
});

function validateInputs() {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  let isValid = true;

  if (!name) {
    isValid = false;
    displayError('Name is required.', nameInput);
  } else {
    clearError(nameInput);
  }

  if (!email) {
    isValid = false;
    displayError('Email is required.', emailInput);
  } else if (!checkEmailFormat(email)) {
    isValid = false;
    displayError('Email is not valid.', emailInput);
  } else {
    clearError(emailInput);
  }

  if (!password) {
    isValid = false;
    displayError('Password is required.', passwordInput);
  } else if (password.length < 8) {
    isValid = false;
    displayError('Password must be at least 8 characters long.', passwordInput);
  } else {
    clearError(passwordInput);
  }

  return isValid;
}
