const container = document.getElementById('book-container');
const loader = document.getElementById('books-loader');
const searchInput = document.getElementById('search-input');
const searchForm = document.getElementById('search-form');
const paginationContainer = document.getElementById('pagination-container');
const previousPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');

renderBooks({
  page: LibraryState.I.state.page,
  search: LibraryState.I.state.search,
});

renderPagination();

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const search = searchInput.value.trim();

  const state = { search, page: '1' };

  LibraryState.I.setState(state);

  renderBooks(state);
});

previousPageButton.addEventListener('click', () => {
  const currentPage = getCurrentPage();
  const previousPage = currentPage - 1;
  changePage(previousPage);
});

nextPageButton.addEventListener('click', () => {
  const currentPage = getCurrentPage();
  const nextPage = currentPage + 1;
  changePage(nextPage);
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

async function renderPagination() {
  const { search } = LibraryState.I.state;
  const pagesCount = await fetchPagesCount({ search });

  const pages = Array.from({ length: pagesCount }, (_, index) => {
    return index + 1;
  });

  const currentPage = getCurrentPage();
  const paginationButtons = pages.map((page) =>
    createPaginationButton({
      page,
      isActive: isActivePage(currentPage, page),
    })
  );

  togglePreviousNextButtons(currentPage, pagesCount);

  paginationContainer.replaceChildren(
    previousPageButton,
    ...paginationButtons,
    nextPageButton
  );
}

function isActivePage(currentPage, page) {
  if (!currentPage) {
    return +page === 1;
  }

  return +currentPage === +page;
}

function createPaginationButton({ page, isActive }) {
  const paginationButton = document.createElement('button');

  paginationButton.dataset.page = page;
  paginationButton.classList.add('pagination-button');

  if (isActive) {
    paginationButton.classList.add('active');
  }

  paginationButton.innerText = page;

  paginationButton.addEventListener('click', () => changePage(page));

  return paginationButton;
}

function getCurrentPage() {
  const currentPage = LibraryState.I.state.page;

  if (currentPage) {
    return +currentPage;
  }

  return 1;
}

function changePage(page) {
  const currentPage = getCurrentPage();

  if (isActivePage(currentPage, page)) {
    return;
  }

  LibraryState.I.setState({ page });

  renderBooks({
    page,
    search: LibraryState.I.state.search,
  });

  const paginationButtons = document.querySelectorAll('.pagination-button');

  paginationButtons.forEach((button) => {
    if (!button.dataset.page) {
      return;
    }

    const isActive = isActivePage(button.dataset.page, page);

    if (isActive) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

LibraryState.I.addOnChangeListener(async (state, previousState) => {
  if (state.search != previousState.search) {
    renderPagination();
  }

  const pagesCount = await fetchPagesCount({ search: state.search });

  togglePreviousNextButtons(state.page, pagesCount);
});

function togglePreviousNextButtons(currentPage, pagesCount) {
  if (pagesCount === 0) {
    previousPageButton.disabled = true;
    nextPageButton.disabled = true;
  } else {
    previousPageButton.disabled = isActivePage(currentPage, 1);
    nextPageButton.disabled = isActivePage(currentPage, pagesCount);
  }
}
