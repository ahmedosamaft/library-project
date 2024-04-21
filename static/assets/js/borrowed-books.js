const container = document.getElementById('books-list-container');

renderBooks();

async function renderBooks() {
  const books = await fetchBorrowedBooks();

  const bookItems = books.map(createBookItem);

  container.replaceChildren(...bookItems);
}

function createBookItem(book) {
  const bookItem = document.createElement('tr');

  const content = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.borrowDate}</td>
    <td>${book.returnDate}</td>
  `;

  bookItem.innerHTML = content;

  return bookItem;
}
