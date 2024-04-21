const bookId = LibraryState.I.state.id;

renderEditBookForm(bookId);

async function renderEditBookForm(id) {
  const book = await fetchBookById(id);

  titleInput.value = book.title;
  authorInput.value = book.author;
  categoryInput.value = book.genre[0];
  descriptionInput.value = book.description;
}
