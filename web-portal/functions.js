import { db, collection, getDocs, getDoc, doc, updateDoc, deleteDoc, setDoc, query, where } from "./firebase-config.js";
import { auth, onUserReady } from "./auth.js";

//user is passed in by onUserReady
let postsLoaded = false;

onUserReady(() => {
  if (!postsLoaded) {
    console.log('Loading posts...');
    loadPosts();
    postsLoaded = true;
  }
});


const container = document.getElementById("posts");

export async function loadPosts() {
  container.innerHTML = ''; // Clear posts

  const querySnapshot = await getDocs(collection(db, "posts"));
  const posts = querySnapshot.docs;

  // Fetch vote data in parallel and collect post info
  const postDataList = await Promise.all(
    posts.map(async (postDoc) => {
      const postId = postDoc.id;
      const post = postDoc.data();

      const upvoteQuery = query(
        collection(db, "posts", postId, "votes"),
        where("vote", "==", "upvote")
      );
      const downvoteQuery = query(
        collection(db, "posts", postId, "votes"),
        where("vote", "==", "downvote")
      );

      const [upvoteSnap, downvoteSnap] = await Promise.all([
        getDocs(upvoteQuery),
        getDocs(downvoteQuery),
      ]);

      return {
        postId,
        post,
        upvoteCount: upvoteSnap.size,
        downvoteCount: downvoteSnap.size,
      };
    })
  );

  // Sort by upvote count descending
  postDataList.sort((a, b) => b.upvoteCount - a.upvoteCount);

  // Add posts to DOM in sorted order
  for (const { postId, post, upvoteCount, downvoteCount } of postDataList) {
    const div = document.createElement("div");
    div.id = `post-container-${postId}`;
    div.classList.add('post-div');
    div.innerHTML = `
      <button class='post-x-button hidden' id='x-${postId}'>x</button>
      <h3 class='post-title-div'>${post.title || "n/a"}</h3>
      <p class='post-content-div'>${linkify(post.content) || "n/a"}</p>
      <small class='upvote-small'>Upvotes: ${upvoteCount}</small>
      <button class='upvote-button'>UPVOTE</button>
      <small class='downvote-small'>Downvotes: ${downvoteCount}</small>
      <button class='downvote-button'>DOWNVOTE</button>
    `;
    container.appendChild(div);

    const upvoteButton = div.querySelector(".upvote-button");
    const downvoteButton = div.querySelector(".downvote-button");

    const refreshCounts = async () => {
      const [newUp, newDown] = await Promise.all([
        getDocs(query(collection(db, "posts", postId, "votes"), where("vote", "==", "upvote"))),
        getDocs(query(collection(db, "posts", postId, "votes"), where("vote", "==", "downvote"))),
      ]);
      div.querySelector(".upvote-small").textContent = `Upvotes: ${newUp.size}`;
      div.querySelector(".downvote-small").textContent = `Downvotes: ${newDown.size}`;
    };

    upvoteButton.addEventListener("click", async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return console.log("Log in to vote");

      const userID = currentUser.uid;
      const voteRef = doc(db, "posts", postId, "votes", userID);
      const voteSnap = await getDoc(voteRef);

      if (voteSnap.exists()) {
        const currentVote = voteSnap.data().vote;
        if (currentVote === "upvote") {
          await deleteDoc(voteRef);
          console.log("Upvote removed");
        } else {
          await setDoc(voteRef, { vote: "upvote" });
          console.log("Changed to upvote");
        }
      } else {
        await setDoc(voteRef, { vote: "upvote" });
        console.log("Upvote recorded");
      }

      await refreshCounts();
    });

    downvoteButton.addEventListener("click", async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return console.log("Log in to vote");

      const userID = currentUser.uid;
      const voteRef = doc(db, "posts", postId, "votes", userID);
      const voteSnap = await getDoc(voteRef);

      if (voteSnap.exists()) {
        const currentVote = voteSnap.data().vote;
        if (currentVote === "downvote") {
          await deleteDoc(voteRef);
          console.log("Downvote removed");
        } else {
          await setDoc(voteRef, { vote: "downvote" });
          console.log("Changed to downvote");
        }
      } else {
        await setDoc(voteRef, { vote: "downvote" });
        console.log("Downvote recorded");
      }

      await refreshCounts();
    });

    // DELETE button logic
    const deleteButton = div.querySelector(`#x-${postId}`);
    deleteButton.addEventListener("click", async () => {
      try {
        await deleteDoc(doc(db, "posts", postId));
        console.log(`Post ${postId} deleted.`);
        div.remove(); // Remove from DOM
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    });

  }
}

//regex given by ChatGPT
function linkify(text) {
  const urlRegex = /(\bhttps?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => {
    return `<a href="${url}">${url}</a>`;
  });
}