import { auth, db } from ".//firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";


export function JournalFormHandler(formId){
  const form = document.getElementById(formId);

  form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const input = new FormData(event.target);
    const queryParams = new URLSearchParams(input).toString();
    const url = `${event.target.action}?${queryParams}`;

    try {
      const API_response = await fetch(url, {
        method: "GET"
      });

      if (API_response.status === 200) {
        showEmailPopup();
      }
    } catch (e) {
      console.log(e);
    }

  });

}
