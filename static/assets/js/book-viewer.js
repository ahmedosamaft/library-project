const container = document.getElementById('books-list-container');

renderBooks();

async function renderBooks() {
  const books = await fetchBooks({ all: true });

  const bookItems = books.map(createBookItem);

  container.replaceChildren(...bookItems);
}

async function deleteBook(bookId) {
  const res = await $fetch(`${API_BASE_URL}books/${bookId}`, {
    method: 'DELETE',
  });

  if (res.ok) {
    renderBooks();
  } else {
    alert('Failed to delete book.');
  }
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
      <button class="delete" onclick="deleteBook(${book.id})">Delete</button>
    </td>
  `;

  bookItem.innerHTML = content;

  return bookItem;
}
