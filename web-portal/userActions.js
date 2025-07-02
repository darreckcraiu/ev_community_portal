import { db, collection, addDoc, auth, signOut } from "./firebase-config.js";

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

const postCreationForm = document.getElementById('post-creation-form');
postCreationForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent page reload
  
  const title = document.getElementById('post-title').value;
  const content = document.getElementById('post-body').value;
  async function submitPost() {
    await addDoc(collection(db, 'posts'), {
      title: title,
      content: content,
      upVotes: 0,
      downVotes: 0
    });
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