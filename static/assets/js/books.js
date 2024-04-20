const container = document.getElementById('book-container');
const searchParams = new URLSearchParams(window.location.search);

async function main() {
  const page = searchParams.get('page');

  const books = await fetchBooks(page);

  books.forEach((book) => {
    const bookCard = createBookCard(book);
    container.appendChild(bookCard);
  });
}

main();
