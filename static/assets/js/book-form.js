const APIUrl = '';

const form = document.getElementById('book_form');
const imageInput = document.getElementById('book_cover');
const imageElement = document.getElementById('book_cover_image');
const coverContainer = document.getElementById('book_cover_container');
const allowedImageFormat = ['image/jpeg', 'image/jpg', 'image/png'];
const maxImageSizeInMB = 5;

const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const publishedYearInput = document.getElementById('published_year');
const isbnInput = document.getElementById('isbn');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!validateInputs()) {
    return;
  }

  const formData = new FormData();
  formData.append('title', titleInput.value.trim());
  formData.append('author', authorInput.value.trim());
  formData.append('publishedYear', publishedYearInput.value);
  formData.append('isbn', isbnInput.value.trim());
  formData.append('image', imageInput.files[0]);

  try {
    const response = await fetch(APIUrl, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      // Server response is OK
      console.log('Data sent successfully');
      // Optionally, reset the form
      form.reset();
    } else {
      // Server responded with an error
      console.error('Error sending data to server');
    }
  } catch (error) {
    // An error occurred during the fetch operation
    console.error('Error:', error);
  }
});

function setError(element, message) {
  const inputControl = element.parentElement;
  const errorHolder = inputControl.querySelector('span.error');
  errorHolder.innerText = message + '*';
  element.classList.add('error');
  element.classList.remove('success');
}

function setSuccess(element) {
  const inputControl = element.parentElement;
  const errorHolder = inputControl.querySelector('span.error');
  errorHolder.innerText = '';
  element.classList.remove('error');
  element.classList.add('success');
}

function validateInputs() {
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const publishedYear = publishedYearInput.value;
  const isbn = isbnInput.value.trim();
  const image = imageInput.files[0];

  if (image === undefined) {
    setError(imageInput, `Book cover is required`);
    imageElement.removeAttribute('src');
    coverContainer.style.setProperty('display', 'none');
  } else {
    setSuccess(imageInput);
  }

  if (title === '') {
    setError(titleInput, 'Title is required');
  } else {
    setSuccess(titleInput);
  }

  if (author === '') {
    setError(authorInput, 'Author is required');
  } else {
    setSuccess(authorInput);
  }

  if (publishedYear === '') {
    setError(publishedYearInput, 'Published Year is required');
  } else {
    setSuccess(publishedYearInput);
  }

  if (isbn === '') {
    setError(isbnInput, 'Isbn is required');
  } else {
    setSuccess(isbnInput);
  }
}

imageInput.addEventListener('change', (event) => {
  const file = event?.target?.files[0];
  const fileSize = file?.size; // Size in bytes
  const fileType = file?.type; // Mime type

  if (!imageInput.files.length) {
    setError(imageInput, `Book cover is required`);
    imageElement.removeAttribute('src');
    coverContainer.style.setProperty('display', 'none');
  } else {
    setSuccess(imageInput);
  }
  // Check if file size exceeds 5MB
  if (fileSize > maxImageSizeInMB * 1024 * 1024) {
    setError(imageInput, $`File size exceeds ${maxImageSizeInMB}MB limit.`);
    event.target.value = '';
    imageElement.removeAttribute('src');
    coverContainer.style.setProperty('display', 'none');
    return;
  }

  // Check if file type is not jpg, jpeg, or png
  if (!allowedImageFormat.includes(fileType)) {
    setError(imageInput, `Only ${allowedImageFormat.map((e) => e.split('/')[1]).join(', ')} formats are allowed.`);
    event.target.value = '';
    imageElement.removeAttribute('src');
    coverContainer.style.setProperty('display', 'none');
    return;
  }

  // If validation passes, display the selected image
  if (event?.target?.files && event?.target?.files.length) {
    imageElement.setAttribute('src', URL.createObjectURL(event.target.files[0]));
    coverContainer.style.setProperty('display', 'block');
  } else {
    imageElement.removeAttribute('src');
    coverContainer.style.setProperty('display', 'none');
  }
});
