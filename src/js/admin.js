import { auth, db } from ".//firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export async function getUserName(){
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const email = user.email;
        getData(email)
          .then((userName) => {
            resolve(userName);
          })
          .catch((e) => {
            reject(e);
          })
      }else {
        resolve(null);
      }
    });
  });
}

async function getData(email){
      const docRef = doc(db, "Users", email);
      const docSnap = await getDoc(docRef);

      if(docSnap.exists()){
        const userName =  docSnap.data().userName;
        return userName;

      }else {
       return null; 

      }

}
