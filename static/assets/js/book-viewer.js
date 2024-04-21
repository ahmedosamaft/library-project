const container = document.getElementById('books-list-container');

renderBooks();

async function renderBooks() {
  const books = await fetchBooks({ all: true });

  const bookItems = books.map(createBookItem);

  container.replaceChildren(...bookItems);
}

function createBookItem(book) {
  const bookItem = document.createElement('tr');

  const content = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td class="action-buttons">
      <a href="edit-book.html?id=${book.id}" class="edit">Edit</a>

      <form method="POST" action="delete-book">
        <input type="hidden" name="id" value="${book.id}">
        <button type="submit" class="delete">Delete</button>
      </form>
    </td>
  `;

  bookItem.innerHTML = content;

  return bookItem;
}