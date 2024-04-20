const container = document.getElementById('book-container');
const searchInput = document.getElementById('search-input');
const loader = document.getElementById('books-loader');
const searchParams = new URLSearchParams(window.location.search);

async function main() {
  const page = searchParams.get('page');
  const search = searchParams.get('search');

  if (search?.trim()) {
    searchInput.value = search;
  }

  const books = await fetchBooks({ page, search });

  loader.classList.add('hidden');

  books.forEach((book) => {
    const bookCard = createBookCard(book);
    container.appendChild(bookCard);
  });
}

main();
