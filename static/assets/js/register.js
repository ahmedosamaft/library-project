const form = document.getElementById('register-form');
const nameInput = document.getElementById('name-input');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const isAdminInput = document.getElementById('is-admin-input');

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

document
  .getElementById('register-form')
  .addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validateInputs()) {
      return;
    }
    const name = nameInput.value.trim();
    const isAdmin = isAdminInput;
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;

    try {
      const response = await $fetch(API_BASE_URL + 'users/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: name,
          last_name: 'p',
          is_stuff: isAdmin,
          username: email,
          password: password,
        }),
      });
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        window.location.href = 'index.html';
      } else {
        const errorData = await response.json();
        console.error('Login failed', errorData);
        document.querySelector('.error').textContent =
          'Login failed: ' + (errorData.detail || 'Unknown error');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      document.querySelector('.error').textContent =
        'An error occurred: ' + error.message;
    }
  });
