function createBookCard(book) {
  const bookCard = document.createElement('article');

  const content = `
      <img src="${book.cover_image}" alt="${book.title} book cover" />
      <div class="book-info">
        <h4>${book.title}</h4>
        <p>by ${book.author}</p>
      </div>
    `;

  bookCard.innerHTML = content;

  return bookCard;
}

async function fetchBooks(page = 1, limit = 20) {
  const url = new URL('https://freetestapi.com/api/v1/books');

  url.searchParams.append('page', page);
  url.searchParams.append('limit', limit);

  const res = await fetch(url);
  const books = await res.json();

  return books;
}
