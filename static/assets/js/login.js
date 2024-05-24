const form = document.getElementById('login-form');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!validateInputs()) {
    return;
  }
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const response = await $fetch(API_BASE_URL + 'users/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('is_admin', data.user.is_staff);
      window.location.href = 'index.html';
    } else {
      const errorData = await response.json();

      document.querySelector('.error').textContent =
        'Login failed: ' + (errorData.detail || 'Unknown error');
    }
  } catch (error) {
    console.error('An error occurred:', error);
    document.querySelector('.error').textContent =
      'An error occurred: ' + error.message;
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
