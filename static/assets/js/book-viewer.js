const container = document.getElementById('books-list-container');

renderBooks();

async function renderBooks() {
  const books = await fetchBooks({ all: true });

  const bookItems = books.map(createBookItem);

  container.replaceChildren(...bookItems);
}

function createBookItem(book) {
  const bookItem = document.createElement('tr');
  const genreList = renderGenres(book.genres);
  const content = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${genreList}</td>
    <td>${book.description}</td>
    <td>
      <a href="edit-book.html?id=${book.id}" class="edit action-button">Edit</a>
    </td>
    <td>
      <form method="GET" action="${API_BASE_URL}books/${book.id}">
        <input type="hidden" name="id" value="${book.id}">
        <button type="submit" class="delete">Delete</button>
      </form>
    </td>
  `;

  bookItem.innerHTML = content;

  return bookItem;
}
