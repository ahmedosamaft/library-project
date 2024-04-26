const form = document.getElementById('login-form');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!validateInputs()) {
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // TODO: The login will be fully implemented once the API is implemented.
  try {
    const { isAdmin } = await login({ email, password });
    if (isAdmin) {
      window.location.href = '/book-viewer.html';
    } else {
      window.location.href = '/';
    }
  } catch (error) {
    console.error(error);
    alert('An error occurred while logging in. Please try again.');
  }
});

function validateInputs() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  let isValid = true;

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
