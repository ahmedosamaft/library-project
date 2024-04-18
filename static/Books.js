async function main() {
  let books = await (await fetch('https://freetestapi.com/api/v1/books')).json();
  console.log(books);
  let container = document.getElementById('bookContainer');
  books.forEach((book) => {
    let card = `
          <img src="${book.cover_image}" alt="${book.title} book cover" />
          <h4>${book.title}</h4>
          <p>${book.author}</p>
  `;
    let child = document.createElement('article');
    child.id = book.id;
    child.innerHTML = card;
    container.appendChild(child);
  });
}
main();
