import { db, collection, getDocs, doc, updateDoc, auth } from "./firebase-config.js";

const container = document.getElementById('posts');
container.innerHTML = '';
export async function loadPosts() {
  const querySnapshot = await getDocs(collection(db, 'posts')); //fetch the posts and wait until they are downloaded
  querySnapshot.forEach(postDoc => {
    const postId = postDoc.id; //unique id for the post
    const post = postDoc.data(); //get post data
    const div = document.createElement('div');
    div.id = `post-container-${postId}`; //assign a unique id to the post div
    div.innerHTML = 
    `
      <h3>${post.title || 'n/a'}</h3>
      <p>${post.content || 'n/a'}</p>
      <small class='upvote-small'>Upvotes: ${post.upVotes || 0}</small>
      <small class='downvote-small'>Downvotes: ${post.downVotes || 0}</small>
      <button class='upvote-button'>UPVOTE</button>
      <button class='downvote-button'>DOWNVOTE</button>
    `;

    container.appendChild(div); //add the post div to the posts container div

    //event listeners for the vote buttons
    const upvoteButton = div.querySelector('.upvote-button');
    upvoteButton.addEventListener('click', async () => {
      if (auth.currentUser) {
        const upvoteSmall = div.querySelector('.upvote-small');
        //use regex to extract the number
        const match = upvoteSmall.textContent.match(/\d+$/);
        let num = Number(match[0]);
        num++;
        upvoteSmall.textContent = `Upvotes: ${num}`;

        //save change in database
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
          upVotes: num
        });        
      }
      else {
        console.log('Not logged in');
      }    
    });
    const downvoteButton = div.querySelector('.downvote-button');
    downvoteButton.addEventListener('click', async () => {
      if (auth.currentUser) {
        const downvoteSmall = div.querySelector('.downvote-small');
        //use regex to extract the number
        const match = downvoteSmall.textContent.match(/\d+$/);
        let num = Number(match[0]);
        num++;
        downvoteSmall.textContent = `Downvotes: ${num}`;

        //save change in database
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
          downVotes: num
        });
      }
      else {
        console.log('Not logged in');
      }
      
    });    
  });        

}

