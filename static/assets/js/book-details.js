const container = document.getElementById('book-details-container');
const loader = document.getElementById('book-loader');

async function renderBookDetails(id) {
  loader.classList.remove('hidden');
  container.classList.add('hidden');

  const book = await fetchBookById(id);
  const content = createBookDetailsContent(book);
  container.innerHTML = content;

  loader.classList.add('hidden');
  container.classList.remove('hidden');
}

const bookId = LibraryState.I.state.id;

renderBookDetails(bookId);

function createBookDetailsContent(book) {
  const content = `
    <div>
      <div>
        <img src="${BASE_URL + book.cover_image}" alt="${
    book.title
  } book cover" />
      </div>
      <h2>${book.title}</h2>
      <table>
        <tr>
          <th>Author</th>
          <td>${book.author}</td>
        </tr>
        <tr>
          <th>Category</th>
          <td>${book.category}</td>
        </tr>
        <tr>
          <th>Availability</th>
          <!-- Hard-coded until we implement it in our API. -->
          <td>Available</td>
        </tr>
      </table>

      <button onclick="borrowBook(${book.id})">Borrow</button>
    </div>
    <div>
      <h3>Description</h3>
      <p>${book.description}</p>
    </div>
  `;

  return content;
}

async function borrowBook(bookId) {
  const res = await $fetch(`${API_BASE_URL}books/${bookId}/borrow/`, {
    method: 'POST',
  });

  if (res.ok) {
    location.href = '/borrowed-books.html';
  } else {
    try {
      const data = await res.json();

      if (data.error) {
        alert(data.error);
      } else {
        throw new Error('Unknown error.');
      }
    } catch (error) {
      alert('Failed to borrow book.');
    }
  }
}
