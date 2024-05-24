async function onSubmitBookForm(formData) {
  const response = await $fetch(`${API_BASE_URL}books/`, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    window.location.href = '/book-viewer.html';
  } else {
    // Server responded with an error
    console.error('Error sending data to server');
  }
}
