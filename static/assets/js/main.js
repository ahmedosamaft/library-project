const API_BASE_URL = 'https://freetestapi.com/api/v1/';

// Cache the current page and search query to avoid delay in pagination rendering.
let cachedFetchPageCountSearch = null;
let cachedBooksCount = null;
async function fetchPagesCount({ booksPerPage = 20, search }) {
  // NOTE: The current implementation is inefficient, it fetches all the movies
  // and returns the length of the list, this is a limitation of the current
  // API used, the fake books API, once this is implemented in our own API,
  // we should have a separate endpoint to fetch the total number of books.
  const isCached = cachedBooksCount !== null;
  const isSameQuery = search?.trim() === cachedFetchPageCountSearch?.trim();
  if (isCached && isSameQuery) {
    return Math.ceil(cachedBooksCount / booksPerPage);
  }

  const url = new URL('books', API_BASE_URL);

  if (search?.trim()) {
    url.searchParams.append('search', search);
  }

  const res = await fetch(url);
  const books = await res.json();

  return Math.ceil(books.length / booksPerPage);
}

async function fetchBooks({ page = 1, limit = 20, search }) {
  const url = new URL('books', API_BASE_URL);

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
  const url = new URL(`books/${id}`, API_BASE_URL);

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
