import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { app, db } from ".//firebaseConfig.js";

const auth = getAuth(app);

export function signInUser (email, password){
  signInWithEmailAndPassword(auth, email, password)
    .then((userCred) => {
      console.log("Welcome " + userCred.user);
      onAuthStateChanged(auth, (user) => {
        if (user) {
          userTypeRedirect(email);
        }
      })
    })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    document.getElementById('wrong-password').innerText = 'Wrong email/password';
    document.getElementById('wrong-password').style.display = 'contents';
    console.log(errorCode + " : " + errorMessage);
  });
}



async function userTypeRedirect(email){

  const usersCollection = collection(db, "Users");
  const queryForUser = query(usersCollection, where("Email", "==", email));

  try{

    const docSnap = await getDocs(queryForUser);
    if (!docSnap.empty){
      docSnap.forEach((doc) => {
        const active = doc.data().active;

        if (active){
          const accountType = doc.data().accountType;
          switch(accountType){
            case "Admin":{
              window.location.href = 'adminPage.html';
              console.log(accountType);
              break;
            }
            case "Manager":{
              window.location.href = 'regUser.html';
              console.log(accountType);
              break;
            }
            case "Regular-User":{
              window.location.href = 'regUser.html';
              console.log(accountType);
              break;
            }
            default: {
              console.log(accountType);
              break;
            }
          }

        }else{
          document.getElementById('wrong-password').innerText = 'Your account is still awaiting activation';
          document.getElementById('wrong-password').style.display = 'contents';

        }
      });
    }else{
      console.log("No account with that email");
    }
  } catch(e){
    console.log("Error: " + e);
  }
}
