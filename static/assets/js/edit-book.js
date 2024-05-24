const bookId = LibraryState.I.state.id;

renderEditBookForm(bookId);

async function renderEditBookForm(id) {
  const book = await fetchBookById(id);

  titleInput.value = book.title;
  authorInput.value = book.author;
  categoryInput.value = book.genre[0];
  descriptionInput.value = book.description;
}

async function onSubmitBookForm(formData) {
  const response = await $fetch(`${API_BASE_URL}books/${bookId}`, {
    method: 'PATCH',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    window.location.href = BASE_URL + 'book-viewer.html';
  } else {
    // Server responded with an error
    console.error('Error sending data to server');
  }
}
