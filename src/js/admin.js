import { auth, db } from ".//firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

export async function getUserName() {
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
      } else {
        resolve(null);
      }
    });
  });
}

async function getData(email) {
  const docRef = doc(db, "Users", email);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const userName = docSnap.data().userName;
    return userName;

  } else {
    return null;

  }

}


export async function getUserCollection() {
  const users = collection(db, "Users");

  const docSnap = await getDocs(users);
  return docSnap;

}


export async function createUserList(divId) {
  const docSnap = await getUserCollection();
  docSnap.forEach((doc) => {
    const data = doc.data();
    const newDiv = document.createElement('div');
    newDiv.className = 'user-panel';
    newDiv.innerHTML = `
           <div class="user-title" onclick="togglePanel(this)">
             <span>${data.firstName} ${data.lastName}</span>
             <span class="arrow">&#9660;</span>
           </div>
           <div class="user-info">
             <div style="display: inline-block; margin-right: 50px;">
               <p><strong>User ID: </strong>${data.userId}</p>
               <p><strong>User Name: </strong>${data.userName}</p>
               <p><strong>Email: </strong><span class='user-email'>${data.Email}</span></p>
               <p><strong>Password: </strong>${data.Password}</p>
             </div>
             <div style="display: inline-block;">
               <p><strong>Address: </strong>${data.Address}</p>
               <p><strong>Date of Birth: </strong>${data.DateOfBirth}</p>
               <p><strong>Account Type: </strong>${data.accountType}</p>
               <p><strong>Active: </strong>${data.active}</p>
             </div>
             <br>
             <div id='suspended'style="display: none; width: 100%; background-color: red; padding: 10px; box-sizing: border-box;">
             </div>
           </div>

    `;
    document.getElementById(`${divId}`).append(newDiv);

    if (data.suspendedStart && data.suspendedEnd) {
      const suspendedDiv = document.createElement('span');
      suspendedDiv.style.color = 'white';
      suspendedDiv.innerHTML = `SUSPENDED FROM : ${data.suspendedStart} - ${data.suspendedEnd}`;

      document.getElementById('suspended').append(suspendedDiv);
      document.getElementById('suspended').style.display = 'initial';


    }

  });



}


export async function getExpiredPassCollection() {
  const users = collection(db, "expired-passwords");

  const docSnap = await getDocs(users);
  return docSnap;

}

export async function createExpiredPasswordList(divId) {
  const docSnap = await getExpiredPassCollection();
  docSnap.forEach((doc) => {
    const data = doc.data();
    const newDiv = document.createElement('div');
    newDiv.className = 'user-panel';
    newDiv.innerHTML = `
           <div class="user-title" onclick="togglePanel(this)">
             <span>${data.email}</span>
             <span class="arrow">&#9660;</span>
           </div>
           <div class="user-info">
             <div style="display: inline-block; margin-right: 50px;">
               <p><strong>Password: </strong>${data.password}</p>
             </div>
             <div style="display: inline-block;">
               <p><strong>Expired On: </strong>${data.expiredOn}</p>
             </div>

             <br>
             <div id='suspended'style="display: none; width: 100%; background-color: red; padding: 10px; box-sizing: border-box;">
             </div>
           </div>

    `;
    document.getElementById(`${divId}`).append(newDiv);

  });
}


