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

/**
 * A class to manage the state of the system and synchronize it with the URL.
 *
 * The state can only persist strings, using other data types can be unreliable,
 * so stick to using strings whenever possible.
 */
class LibraryState {
  constructor() {
    // Set the browser state from the search parameters in the URL.
    const url = new URL(window.location.href);
    const state = {};

    url.searchParams.forEach((value, key) => {
      state[key] = value;
    });

    window.history.replaceState(state, '', url);
  }

  static get I() {
    if (!this._instance) {
      this._instance = new LibraryState();
    }

    return this._instance;
  }

  get state() {
    return window.history.state;
  }

  setState(state) {
    const updatedState = { ...this.state, ...state };

    const url = new URL(window.location.href);

    Object.entries(updatedState).map(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });

    window.history.pushState(updatedState, '', url);
  }
}
