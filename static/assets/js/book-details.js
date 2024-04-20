const container = document.getElementById('book-details-container');
const loader = document.getElementById('book-loader');

async function renderBookDetails(id) {
  loader.classList.remove('hidden');
  container.classList.add('hidden');

  const book = await fetchBookById(id);
  const content = createBookDetailsContent(book);
  container.innerHTML = content;

  loader.classList.add('hidden');
  container.classList.remove('hidden');
}

const bookId = LibraryState.I.state.id;

renderBookDetails(bookId);
