const container = document.getElementById('books-list-container');

renderBooks();

async function renderBooks() {
  const borrowedList = await fetchBorrowedBooks();

  const bookItems = borrowedList.map(createBookItem);

  container.replaceChildren(...bookItems);
}

async function returnBook(bookId) {
  const res = await $fetch(`${API_BASE_URL}books/${bookId}/return/`, {
    method: 'POST',
  });

  if (res.ok) {
    renderBooks();
  } else {
    alert('Failed to return book.');
  }
}

function createBookItem(record) {
  const bookItem = document.createElement('tr');

  const content = `
    <td>${record.book.title}</td>
    <td>${record.book.author}</td>
    <td>${new Date(record.borrowed_time).toLocaleString()}</td>
    <td>${new Date(record.due_time).toLocaleString()}</td>
    <td>
      ${
        record.returned
          ? 'Returned'
          : `<button class="action-button" onclick="returnBook(${record.id})">Return</button>`
      }
    </td>
  `;

  bookItem.innerHTML = content;

  return bookItem;
}
