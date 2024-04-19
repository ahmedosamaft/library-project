const container = document.getElementById('book-container');

async function main() {
  const res = await fetch('https://freetestapi.com/api/v1/books');
  const books = await res.json();

  books.forEach((book) => {
    const bookCard = document.createElement('article');

    const content = `
      <img src="${book.cover_image}" alt="${book.title} book cover" />
      <div class="book-info">
        <h4>${book.title}</h4>
        <p>by ${book.author}</p>
      </div>
    `;

    bookCard.innerHTML = content;

    container.appendChild(bookCard);
  });
}

main();
