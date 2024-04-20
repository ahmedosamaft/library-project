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

function createBookCard(book) {
  const bookCard = document.createElement('article');

  const content = `
    <img src="${book.cover_image}" alt="${book.title} book cover" />
    <div class="book-info">
      <h4>${book.title}</h4>
      <p>by ${book.author}</p>

      <a href="book-details.html?id=${book.id}">View Details</a>
    </div>
  `;

  bookCard.innerHTML = content;

  return bookCard;
}
