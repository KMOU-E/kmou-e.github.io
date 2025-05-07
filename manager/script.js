import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, updateDoc, getDoc, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
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
let uids = [];
fetch("../src/uid.json").then((response) => {
  return response.json();
}).then((data) => {
  uids = uids.concat(data);
})

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
    const id = document.getElementById("id").value;
    const password = document.getElementById("password").value;

    if (id.trim() !== "") {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, "test@example." + id, sha256(password));
            const user = userCredential.user;
            if(uids.includes(user.uid)) {
                login();
            }
        } catch (error) {
            console.error("로그인 실패:", error.message);
            alert("로그인에 실패하였습니다.");
        }
    } else {
        alert("아이디를 입력해주세요.");
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
  })
  document.querySelectorAll(".pm-btn").forEach((d, i) => {
    d.addEventListener("click", function(){
        let s = prompt("점수를 입력하세요", 0);
        if(s == null || s == "") return;
        s = parseInt(s);
        if(isNaN(s)) return;
        if(s < 0) return;
        if(i % 2 == 0){
            s = -s;
        }
        let sc = parseInt(document.querySelectorAll(".score span")[Math.floor(i / 2)].innerText);
        updateDoc(doc(db, "User", "Group" + Math.floor(i / 2 + 1)), {
            score: sc + s
        })
    })
  })
}

function addminus(i){
    let arr = [];
    onSnapshot(collection(db, "User"), (users) => {
        users.forEach((doc) => {
            arr.push(doc.data());
        })
        arr.sort((a, b) => a.type - b.type);
        arr.forEach((doc, i) => {
            document.querySelectorAll(".score span")[i].innerText = doc.score;
        })
    })
}






document.getElementById("manager").addEventListener("click", function(){
    window.location.href = "../";
})