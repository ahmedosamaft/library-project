const API_BASE_URL = 'https://freetestapi.com/api/v1/books';

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

async function fetchBooks({ page = 1, limit = 20, search }) {
  const url = new URL(API_BASE_URL);

  if (isNaN(page)) {
    page = 1;
  }

  if (isNaN(limit)) {
    limit = 20;
  }

  url.searchParams.append('page', page);
  url.searchParams.append('limit', limit);

  if (search?.trim()) {
    url.searchParams.append('search', search);
  }

  const res = await fetch(url);
  const books = await res.json();

  return books;
}

async function fetchBookById(id) {
  const url = new URL(`/${id}`, API_BASE_URL);

  const res = await fetch(url);
  const book = await res.json();

  return book;
}
