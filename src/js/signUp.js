//https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js
import { /*getAuth,*/ createUserWithEmailAndPassword, onAuthStateChanged} from "firebase/auth";
import { query, collection, addDoc, where, getDocs, doc, setDoc  } from "firebase/firestore";
import { app, db, auth } from ".//firebaseConfig.js";

//const auth = getAuth(app);

//TODO: create user in firestore with account permissions: admin, regUser,
//manager 
export function signUpUser(email, password, firstName, lastName, DateOfBirth, address) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCred) => {
      console.log("New User: " + firstName + ", " + lastName);
      console.log(userCred.user);
      onAuthStateChanged(auth, (user) => {
        if(user){
          try{

            //sets userName 
            const d = new Date();
            //d.getMonth() returns a month from 0-11 (Jan=0 - Dec=11)
            const month = d.getMonth() + 1;
            const year = d.getFullYear() % 100;

            //userName
            const userName = firstName.charAt(0) + lastName + "-" + month + "-" + year;
            console.log(userName);

            //userId
            const userId = Math.floor(Math.random() * 10000000);
            console.log(userId);

            //address, DOB, email, password, firstName, lastName from original
            //signUpUser function
            addUserToDatabase(address, DateOfBirth, email, password, firstName, lastName, userId, userName)
            //ugly but needed rn (nested promises)
              .then(() => {
                sendEmailToAdmin(email)
                  .then(() => {
                    window.location.href = 'account-created-confirmation.html';
                  });
              });


          } catch(e){
            console.log(e);
          }

        }
      })
    })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode + " : " + errorMessage);


    document.getElementById('createAccount-error').innerText = errorMessage;
    document.getElementById('createAccount-error').style.display = 'contents';
  }) 
};


//add user to database function

//create userId function
//cobbled way of creating auto-incrementing userId
//How: 
//gets # of documents in "Users" collection + 1 = userId

async function getUserId(){
  const userCollection = collection(db, "Users");
  const snapshot = await getCountFromServer(userCollection);
  const  userId = snapshot.data().count;
  return userId;
}


async function addUserToDatabase(address, dob, email, password, firstName, lastName, userId, userName){
  try{
    const docRef = await setDoc(doc(db, "Users", email), {
      Address: address,
      DateOfBirth: dob,
      Email: email,
      Password: password,
      accountType: "Regular-User",
      active: false,
      firstName: firstName,
      lastName: lastName,
      profile_pic_url:"",
      userId: userId, 
      userName: userName
    });
    console.log('User added: SUCCESS');


  }catch(e){
    console.log("Error adding document. : ", e);

  }
}


async function sendEmailToAdmin(email){
  const userCollection = collection(db, "Users");
  const queryForUser = query(userCollection, where("Email", "==", email));

  try{
    const docSnap = await getDocs(queryForUser);
    if (!docSnap.empty){
      docSnap.forEach((doc) => {
        console.log(doc.data());
        const userName = doc.data().userName; 
        const firstName = doc.data().firstName;
        const lastName = doc.data().lastName;
        const accountType = doc.data().accountType; 
        const email = doc.data().Email; 
        sendEmail(userName, email, firstName, lastName, accountType);

      });
    }
  }catch(e){
    console.log(e);
  }
}


async function sendEmail(userName, email, firstName, lastName, accountType){
  try{

    const emailSplit = email.split('@');
    const emailName = emailSplit[0];
    const emailEnd = emailSplit[1];

    const sendEmail = await addDoc(collection(db, "mail"), {
      to: ['j.erik.tonnesen@gmail.com'],
      message: {
        subject: `Account Created for: ${firstName} ${lastName}, and Pending Approval`,
        text: 'Account creation email',
        html: 
        `
        <div id="text"> 
        <p style="font-size: 20px;">Account information: </p><hr><br>
        <p><strong>User Name: </strong> ${userName} </p><br>
        <p><strong>Email: </strong> ${email} </p><br>
        <p><strong>First Name: </strong> ${firstName} </p><br>
        <p><strong>Last Name: </strong> ${lastName} </p><br>
        <p><strong>Account Type: </strong> ${accountType} </p><br><hr>
        </div>
        <div id="buttons" style="display: inline;">
        <p style="text-align: center; font-size: 20px;">Would you like to approve or deny this Account? </p><br>

        <div style="text-align: center;">
        <a href="https://accountapproval-hbs3oxnkoa-uc.a.run.app/accountApproval?email=${emailName}%40${emailEnd}&approval=approved" 
        style="display: inline-block; background-color: #28a745; color: #ffffff; text-decoration: none; 
        padding: 10px 20px; font-size: 16px; border-radius: 5px; margin-right: 10px;">
        Approve
        </a>

        <a href="https://accountapproval-hbs3oxnkoa-uc.a.run.app/accountApproval?email=${emailName}%40${emailEnd}&approval=denied" 
        style="display: inline-block; background-color: #dc3545; color: #ffffff; text-decoration: none; 
        padding: 10px 20px; font-size: 16px; border-radius: 5px; margin-left: 10px;">
        Deny
        </a>
        </div>

        </div>`,
      },
    });
  }catch(e){
    console.log(e);
  }

}

