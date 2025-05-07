import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, getDoc, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
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

window.onload = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("로그인 상태:", user.uid);
      if(user.uid === "8HRRxvXS3ph55hPVBaX4DRkDwoi2") {
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

            console.log("로그인 성공:", user.uid);
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
  onSnapshot(collection(db, "User"), (users) => {
    users.forEach((doc) => {
      if(doc.data().a != ''){
        document.getElementById("user").innerHTML += "<div class='user' id='" + doc.id + "'><h1>" + doc.data().name + "</h1><p>" + doc.data().a + "</p></div>";
        document.getElementById(doc.id).addEventListener("click", function(){
          window.location.href = "user.html#" + doc.id;
        })
      }
    })
  })
}