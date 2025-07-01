import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const auth = getAuth() //get the auth system

const registerform = document.getElementById('authForm-register');
const loginform = document.getElementById('authForm-login');
const statusText = document.getElementById('status');

//for registering
registerform.addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent page reload

  const email = document.getElementById('email-register').value;
  const password = document.getElementById('password-register').value;

  //attempt to register the user
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    await signOut(auth); //immediately log out the user
    registerform.reset();
    statusText.textContent = "Account successfully created";
  } catch (err) {
    statusText.textContent = "Error: " + err.message;
  }
});

//for logging in
loginform.addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent page reload

  const email = document.getElementById('email-login').value;
  const password = document.getElementById('password-login').value;

  //attempt to log the user in
  try {
    // Try to log in
    await signInWithEmailAndPassword(auth, email, password);
    loginform.reset();
    statusText.textContent = "Logged in!";
  } catch (err) {
    statusText.textContent = "Error: " + err.message;
  }
});

//to show who is currently logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Logged in as:", user.email);
    } else {
      console.log("Not logged in");
    }
});