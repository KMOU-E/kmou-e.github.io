import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDWaPTHlXDcgb0cKbfEvyl5om5MZ3D8SIs",
    authDomain: "bimahoe-mt.firebaseapp.com",
    projectId: "bimahoe-mt",
    storageBucket: "bimahoe-mt.firebasestorage.app",
    messagingSenderId: "101358879042",
    appId: "1:101358879042:web:6d1fc98b963b045dd8c8db"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
let uids = ["8HRRxvXS3ph55hPVBaX4DRkDwoi2"];
fetch("./src/uid.json").then((response) => {
  return response.json();
}).then((data) => {
  uids = uids.concat(data);
})

// const uids = data;
// console.log(uids);

window.onload = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if(uids.includes(user.uid)) {
        login();
      }
    } else {
      console.log("로그인되지 않음");
    }
  })
}

document.getElementById("submit").addEventListener("click", async () => {
    const password = document.getElementById("password").value;

    if (password.trim() !== "") {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, "test@example.com", sha256(password));
            const user = userCredential.user;

            // console.log("로그인 성공:", user.uid);
            login();
        } catch (error) {
            console.error("로그인 실패:", error.message);
            alert("로그인에 실패하였습니다.");
        }
    } else {
        alert("비밀번호를 입력해주세요.");
    }
})

function login(){
  document.getElementById("login").style.display = "none";
  document.querySelector("body").classList.remove("login");
  onSnapshot(collection(db, "User"), (users) => {
    let arr = [];
    users.forEach((doc) => {
      arr.push(doc.data());
    })
    arr.sort((a, b) => a.type - b.type);
    arr.forEach((doc, i) => {
        document.querySelectorAll(".score span")[i].innerText = doc.score;
    })
    // console.log(arr);
  })
}

document.getElementById("manager").addEventListener("click", function(){
  window.location.href = "/manager";
})