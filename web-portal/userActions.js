import { db, collection, addDoc, doc } from "./firebase-config.js";
import { auth, signOut } from "./auth.js";
import { loadPosts } from "./functions.js";

const adminPassword = 'password123';
export let adminPermissions = false;

const createNewButton = document.getElementById('create-new-button');

createNewButton.addEventListener('click', () => {
  if (auth.currentUser) {
    const postCreationElement = document.getElementById('post-creation-div');
    postCreationElement.classList.toggle('hidden');
  }
  else {
    console.log('Not logged in');
  }
});

const adminButton = document.getElementById('admin-button');
adminButton.addEventListener('click', () => {
  console.log(adminPermissions)
  const adminLoginForm = document.getElementById('admin-login-form');
  adminLoginForm.classList.toggle('hidden');
});

const adminLoginForm = document.getElementById('admin-login-form');
adminLoginForm.addEventListener('submit', async (e) => {
  e.preventDefault(); //prevent page reload

  const password = document.getElementById('admin-password-input').value;
  if (password === adminPassword) {
    adminPermissions = true;
    adminLoginForm.reset();
    adminLoginForm.classList.toggle('hidden');
    adminButton.style.backgroundColor = 'green';
    const xButtons = document.querySelectorAll('.post-x-button');
    xButtons.forEach(xButton => {
      xButton.classList.toggle('hidden');
    });
  }
  else {
    console.log('Incorrect admin password');
  }
});

const postCreationForm = document.getElementById('post-creation-form');
postCreationForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent page reload
  
  const title = document.getElementById('post-title').value;
  const content = document.getElementById('post-body').value;
  async function submitPost() {
    await addDoc(collection(db, 'posts'), {
      title: title,
      content: content
    });
    await loadPosts();
  }

  if (title && content) {
    try {
      submitPost();
      console.log('post submitted');
    } catch (err) {
      console.log('Error: ' + err.message);
    }
  }
  else {
    console.log('post NOT submitted');
  }
});

const logoutButton = document.getElementById('logout-button');
logoutButton.addEventListener('click', async () => {
  try {
    await signOut(auth);
    location.reload();
  } catch (err) {
    console.log("Logout error:", err.message);
  }
});