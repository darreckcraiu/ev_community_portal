import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

export const auth = getAuth(); //get the auth system

const registerform = document.getElementById('authForm-register');
const loginform = document.getElementById('authForm-login');

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
    console.log('Account successfully created');
    location.reload();
  } catch (err) {
    console.log('Error: ' + err.message);
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
    console.log('Logged in');
    location.reload();
  } catch (err) {
    console.log('Error: ' + err.message);
  }
});

//this runs upon the page loading and whenever the login state is changed
function onUserReady(callback) {
  onAuthStateChanged(auth, (user) => {
    // Core login state handling
    if (user) {
      console.log("Logged in as:", user.email);
      document.querySelectorAll('.hidden-while-user').forEach(el => {
        el.style.display = 'none';
      });
    } else {
      console.log("Not logged in");
      document.querySelectorAll('.hidden-while-no-user').forEach(el => {
        el.style.display = 'none';
      });
    }

    // Trigger external logic
    callback(user); // Will be null if not logged in
  });
}

export { signOut, onUserReady };