const container = document.getElementById('book-container');
const loader = document.getElementById('books-loader');
const searchInput = document.getElementById('search-input');
const searchForm = document.getElementById('search-form');

renderBooks({
  page: LibraryState.I.state.page,
  search: LibraryState.I.state.search,
});

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const search = searchInput.value.trim();

  const state = { search, page: '1' };

  LibraryState.I.setState(state);

  renderBooks(state);
});

async function renderBooks({ page, search }) {
  loader.classList.remove('hidden');
  container.classList.add('hidden');

  if (search?.trim()) {
    searchInput.value = search;
  }

  const books = await fetchBooks({
    page,
    search,
  });

  loader.classList.add('hidden');
  container.classList.remove('hidden');

  const bookCards = books.map(createBookCard);

  container.replaceChildren(...bookCards);
}
