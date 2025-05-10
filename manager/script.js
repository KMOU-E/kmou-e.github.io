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
  let fee, length, view, all, array;
  onSnapshot(collection(db, "System"), (users) => {
    users.forEach((doc) => {
      fee = doc.data().fee;
      length = doc.data().length;
      view = doc.data().view;
    })
    document.querySelector("#title h2").innerText = `(1등 시 ${Math.round(all * fee / 100)} 포인트)`;
    document.getElementById("fee").value = fee;
    document.querySelectorAll(".race-track").forEach((doc1, i) => {
      doc1.innerHTML = "";
      for(let j = 0; j < length; j++){
        doc1.innerHTML += `<div class="slot"></div>`;
      }
      doc1.querySelectorAll(".slot").forEach((doc2, j) => {
        let t = false;
        doc2.addEventListener("touchstart", function(e){
          e.preventDefault();
          t = true;
          updateDoc(doc(db, "Race", "Horse" + (i + 1)), {
            location: j + 1
          })
        }, { passive: false })
        doc2.addEventListener("click", function(){
          if(t){
            t = false;
            return;
          }
          updateDoc(doc(db, "Race", "Horse" + (i + 1)), {
            location: j + 1
          })
        })
      });
    })
  })
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
  onSnapshot(collection(db, "Race"), (users) => {
    let arr = [], sum = [];
    users.forEach((doc) => {
      arr.push(doc.data());
    })
    arr.sort((a, b) => a.type - b.type);
    array = arr;
    arr.forEach((doc, i) => {
      if(doc.location != 0){
        document.querySelectorAll(".race-track")[i].querySelectorAll(".slot").forEach((doc2, j) => {
          if(j == doc.location - 1){
            doc2.classList.add("active");
          }else{
            doc2.classList.remove("active");
          }
        })
      }
      let a = 0;
      doc.point.forEach((doc2, j) => {
        a += doc2;
        document.querySelectorAll(".bet-odds")[j].querySelectorAll(".betting-odds")[i].innerText = doc2;
      })
      sum.push(a);
      document.querySelectorAll(".odds .point")[i].innerText = a;
    })
    all = 0;
    sum.forEach((doc) => {
      all += doc;
    })
    sum.forEach((doc, i) => {
      document.querySelectorAll(".odds .fee")[i].innerText = (doc == 0 ? '0' : Math.round(all / doc * 100) / 100) + "배";
    })
    document.querySelector("#title h2").innerText = `(1등 시 ${Math.round(all * fee / 100)} 포인트)`;
  })
  document.querySelectorAll(".pm-btn").forEach((d, i) => {
    d.addEventListener("touchstart", function(e){
      e.preventDefault();
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
    }, { passive: false });
  })
  document.querySelectorAll(".race-view").forEach((doc1, i) => {
    doc1.addEventListener("touchstart", function(e){
      e.preventDefault();
      updateDoc(doc(db, "System", "Race"), {
        view: i == 0 ? true : false
      })
    }, { passive: false })
  })
  document.getElementById("fee-submit").addEventListener("touchstart", function(e){
    e.preventDefault();
    let fee = parseInt(document.getElementById("fee").value);
    updateDoc(doc(db, "System", "Race"), {
      fee: fee
    })
  }, { passive: false })
  document.querySelectorAll(".bet-odds").forEach((doc1, i) => {
    doc1.querySelectorAll(".betting-odds").forEach((doc2, j) => {
      doc2.addEventListener("touchstart", function(e){
        e.preventDefault();
        let s = prompt("배팅할 포인트를 입력하세요", 0);
        if(s == null || s == "") return;
        s = parseInt(s);
        if(isNaN(s)) return;
        if(s < 0) return;
        let p = array[j].point;
        p[i] += s;
        updateDoc(doc(db, "Race", "Horse" + (j + 1)), {
          point: p
        })
        updateDoc(doc(db, "User", "Group" + (i + 1)), {
          score: parseInt(document.querySelectorAll(".score span")[j].innerText) - s
        })
      }, { passive: false })
    })
  })
  document.querySelectorAll(".race-vic").forEach((doc1, i) => {
    doc1.addEventListener("touchstart", function(e){
      e.preventDefault();
      updateDoc(doc(db, "User", "Group" + (i + 1)), {
        score: parseInt(document.querySelectorAll(".score span")[i].innerText) + Math.round(all * fee / 100)
      })
      let pp = 0;
      array.map(x => x.point)[i].forEach((doc2, j) => {
        pp += doc2;
      })
      array.map(x => x.point)[i].forEach((doc2, j) => {
        if(doc2 == 0) return;
        updateDoc(doc(db, "User", "Group" + (j + 1)), {
          score: parseInt(document.querySelectorAll(".score span")[j].innerText) + Math.round(all * fee / 100 * doc2 / pp)
        })
        console.log(doc2/ pp)
      })
      for(let j = 1; j <= 6; j++){
        updateDoc(doc(db, "Race", "Horse" + j), {
          location: 1,
          point: [0, 0, 0, 0, 0, 0]
        })
      }
      // 
    }, { passive: false })
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