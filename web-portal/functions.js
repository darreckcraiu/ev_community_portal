import { db, collection, getDocs } from "./firebase-config.js";
        
const container = document.getElementById('posts');
container.innerHTML = '';
export async function loadPosts() {
  const querySnapshot = await getDocs(collection(db, 'posts')); //fetch the posts and wait until they are downloaded
  querySnapshot.forEach(doc => {
    const post = doc.data(); //get post data
    const div = document.createElement('div');
    div.innerHTML = 
    `
      <h3>${post.title || 'n/a'}</h3>
      <p>${post.content || 'n/a'}</p>
      <small>Upvotes: ${post.upVotes || 'n/a'}</small>
      <small>downvotes: ${post.downVotes || 'n/a'}</small>
    `;

    container.appendChild(div); //add the post div to the posts container div
  });            
}