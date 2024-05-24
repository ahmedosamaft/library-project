const APIUrl = '';

const form = document.getElementById('book-form');
const imageInput = document.getElementById('book-cover-input');
const imageElement = document.getElementById('book-cover-input_image');
const coverContainer = document.getElementById('book-cover-input-container');
const yearInput = document.getElementById('year-input');
const allowedImageFormat = ['image/jpeg', 'image/jpg', 'image/png'];
const maxImageSizeInMB = 5;

const titleInput = document.getElementById('title-input');
const authorInput = document.getElementById('author-input');
const descriptionInput = document.getElementById('description-input');
const categoryInput = document.getElementById('category-input');

async function onSubmitBookForm(formData) {
  const response = await $fetch(`${API_BASE_URL}books/`, {
    method: 'POST',
    body: formData,
  });

  if (response.ok) {
    window.location.href = '/book-viewer.html';
  } else {
    // Server responded with an error
    console.error('Error sending data to server');
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!validateInputs()) {
    return;
  }

  const formData = new FormData();
  formData.append('title', titleInput.value.trim());
  formData.append('author', authorInput.value.trim());
  formData.append('description', descriptionInput.value);
  formData.append('genres', categoryInput.value.trim());
  formData.append('cover_image', imageInput.files[0]);
  formData.append('publication_year', yearInput.value);

  try {
    await onSubmitBookForm(formData);
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
  const description = descriptionInput.value;
  const category = categoryInput.value.trim();
  const image = imageInput.files[0];

  if (image === undefined) {
    imageElement.removeAttribute('src');
    coverContainer.classList.add('hidden');
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

  if (description === '') {
    setError(descriptionInput, 'Description is required');
  } else {
    setSuccess(descriptionInput);
  }

  if (category === '') {
    setError(categoryInput, 'Category is required');
  } else {
    setSuccess(categoryInput);
  }

  return true;
}

imageInput.addEventListener('change', (event) => {
  const file = event?.target?.files[0];
  const fileSize = file?.size; // Size in bytes
  const fileType = file?.type; // Mime type

  if (!imageInput.files.length) {
    imageElement.removeAttribute('src');
    coverContainer.classList.add('hidden');
  } else {
    setSuccess(imageInput);
  }
  // Check if file size exceeds 5MB
  if (fileSize > maxImageSizeInMB * 1024 * 1024) {
    setError(imageInput, $`File size exceeds ${maxImageSizeInMB}MB limit.`);
    event.target.value = '';
    imageElement.removeAttribute('src');
    coverContainer.classList.add('hidden');
    return;
  }

  // Check if file type is not jpg, jpeg, or png
  if (!allowedImageFormat.includes(fileType)) {
    setError(
      imageInput,
      `Only ${allowedImageFormat
        .map((e) => e.split('/')[1])
        .join(', ')} formats are allowed.`
    );
    event.target.value = '';
    imageElement.removeAttribute('src');
    coverContainer.classList.add('hidden');
    return;
  }

  // If validation passes, display the selected image
  if (event?.target?.files && event?.target?.files.length) {
    imageElement.setAttribute(
      'src',
      URL.createObjectURL(event.target.files[0])
    );
    coverContainer.classList.remove('hidden');
  } else {
    imageElement.removeAttribute('src');
    coverContainer.classList.add('hidden');
  }
});
