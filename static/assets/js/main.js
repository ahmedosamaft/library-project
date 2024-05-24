const BASE_URL = 'http://127.0.0.1:8000';
const API_BASE_URL = 'http://127.0.0.1:8000/api/';

// Cache the current page and search query to avoid delay in pagination rendering.
let cachedFetchPageCountTitle = null;
let cachedFetchPageCountAuthor = null;
let cachedFetchPageCountCategory = null;
let cachedBooksCount = null;
async function fetchPagesCount({ booksPerPage = 20, title, author, category }) {
  // NOTE: The current implementation is inefficient, it fetches all the movies
  // and returns the length of the list, this is a limitation of the current
  // API used, the fake books API, once this is implemented in our own API,
  // we should have a separate endpoint to fetch the total number of books.
  const isCached = cachedBooksCount !== null;
  const isSameTitle = title?.trim() === cachedFetchPageCountTitle?.trim();
  const isSameAuthor = author?.trim() === cachedFetchPageCountAuthor?.trim();
  const isSameCategory =
    category?.trim() === cachedFetchPageCountCategory?.trim();
  const isSameQuery = isSameTitle && isSameAuthor && isSameCategory;
  if (isCached && isSameQuery) {
    return Math.ceil(cachedBooksCount / booksPerPage);
  }

  const books = await fetchBooks({ title, author, category, all: true });

  return Math.ceil(books.length / booksPerPage);
}

async function fetchBorrowedBooks() {
  const url = new URL('books/borrowed', API_BASE_URL);

  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('User is not authenticated');
  }

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch borrowed books');
  }

  const borrowedBooks = await res.json();
  return borrowedBooks;
}

async function fetchBooks({
  page = 1,
  limit = 20,
  title,
  author,
  category,
  all,
}) {
  const url = new URL('books', API_BASE_URL);

  if (isNaN(page)) {
    page = 1;
  }

  if (isNaN(limit)) {
    limit = 20;
  }

  url.searchParams.append('page', page);
  if (!all) {
    url.searchParams.append('limit', limit);
  }

  if (title?.trim()) {
    url.searchParams.append('title', title);
  }

  if (author?.trim()) {
    url.searchParams.append('author', author);
  }

  if (category?.trim()) {
    url.searchParams.append('category', category);
  }

  const res = await fetch(url);
  const books = await res.json();

  return books;
}

async function fetchBookById(id) {
  const url = new URL(`books/${id}`, API_BASE_URL);

  const res = await fetch(url);
  const book = await res.json();

  return book;
}

async function login({ email, password }) {
  const url = new URL('login', API_BASE_URL);

  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Login failed.');
  }

  const data = await res.json();

  return data;
}

async function register({ name, email, password, isAdmin }) {
  const url = new URL('register', API_BASE_URL);

  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ name, email, password, isAdmin }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Registration failed.');
  }

  const data = await res.json();

  return data;
}

function checkEmailFormat(email) {
  const emailRegex = /^\S+@\S+\.\S+$/;

  return emailRegex.test(email);
}

function displayError(message, input) {
  // Each input is followed by a span.error element, we can put the message there
  // we also set the error class on the input element

  input.classList.add('error');
  input.nextElementSibling.innerText = message;
}

function clearError(input) {
  input.classList.remove('error');
  input.nextElementSibling.innerText = '';
}

/**
 * A class to manage the state of the system and synchronize it with the URL.
 *
 * The state can only persist strings, using other data types can be unreliable,
 * so stick to using strings whenever possible.
 */
class LibraryState {
  onChangeListeners = [];

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
    const previousState = this.state;
    const updatedState = { ...previousState, ...state };

    const url = new URL(window.location.href);

    Object.entries(updatedState).map(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });

    window.history.pushState(updatedState, '', url);

    this.notifyChangeListeners(updatedState, previousState);
  }

  notifyChangeListeners(state, previousState) {
    this.onChangeListeners.forEach((listener) => {
      listener(state, previousState);
    });
  }

  addOnChangeListener(listener) {
    this.onChangeListeners.push(listener);

    return () => this.removeOnChangeListener(listener);
  }

  removeOnChangeListener(listener) {
    this.onChangeListeners = this.onChangeListeners.filter(
      (item) => item !== listener
    );
  }
}
