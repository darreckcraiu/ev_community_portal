import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { loadPosts } from "./posts.js";

const db = getFirestore();
const auth = getAuth();

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