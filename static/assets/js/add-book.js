async function onSubmitBookForm(formData) {
  console.log(formData);
  const accessToken = localStorage.getItem('access_token');
  const response = await fetch(`${API_BASE_URL}books/`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${accessToken}`,
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
