const bookId = LibraryState.I.state.id;

renderEditBookForm(bookId);

async function renderEditBookForm(id) {
  const book = await fetchBookById(id);

  titleInput.value = book.title;
  authorInput.value = book.author;
  yearInput.value = book.publication_year;
  categoryInput.value = book.category;
  descriptionInput.value = book.description;
}

async function onSubmitBookForm(formData) {
  const response = await $fetch(`${API_BASE_URL}books/${bookId}/`, {
    method: 'PUT',
    body: formData,
  });

  if (response.ok) {
    window.location.href = '/book-viewer.html';
  } else {
    // Server responded with an error
    console.error('Error sending data to server');
  }
}
