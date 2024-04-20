const API_BASE_URL = 'https://freetestapi.com/api/v1/';

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

function createBookDetailsContent(book) {
  const content = `
    <div>
      <div>
        <img src="${book.cover_image}" alt="${book.title} book cover" />
      </div>
      <h2>${book.title}</h2>
      <table>
        <tr>
          <th>Author</th>
          <td>${book.author}</td>
        </tr>
        <tr>
          <th>Category</th>
          <td>${book.genre[0]}</td>
        </tr>
        <tr>
          <th>Availability</th>
          <!-- Hard-coded until we implement it in our API. -->
          <td>Available</td>
        </tr>
      </table>

      <button>Borrow</button>
    </div>
    <div>
      <h3>Description</h3>
      <p>${book.description}</p>
    </div>
  `;

  return content;
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
