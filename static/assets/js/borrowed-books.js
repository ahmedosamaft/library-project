const container = document.getElementById('books-list-container');

renderBooks();

async function renderBooks() {
  const borrowedList = await fetchBorrowedBooks();

  const bookItems = borrowedList.map(createBookItem);

  container.replaceChildren(...bookItems);
}

function createBookItem(record) {
  const bookItem = document.createElement('tr');
  console.log(record);
  const content = `
    <td>${record.book.title}</td>
    <td>${record.book.author}</td>
    <td>${new Date(record.borrowed_time).toLocaleString()}</td>
    <td>${new Date(record.due_time).toLocaleString()}</td>
  `;

  bookItem.innerHTML = content;

  return bookItem;
}
