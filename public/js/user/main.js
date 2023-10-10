const token = localStorage.getItem("token");

const user = JSON.parse(localStorage.getItem("user"));

let before = document.getElementById("before");
let after = document.getElementById("after");

document.getElementById("upload-recipt").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("upload-recipt-form").style.display = "block";
});

document
  .getElementById("cancel-upload")
  .addEventListener("click", async (e) => {
    document.getElementById("upload-recipt-form").style.display = "none";
  });

if (user.planType === null) {
  after.style.display = "none";
  before.style.display = "flex";
} else {
  after.style.display = "block";
  before.style.display = "none";
  showUserData();
}

async function getEarning() {
  try {
    let res = await axios.get("http://localhost:4000/main/earning", {
      headers: { Authorization: token },
    });

    if (res.data.message === "got") {
      return res.data.earning;
    } else {
      alert("Somthing Went Wrong");
    }
  } catch (err) {
    console.log(err);
  }
}

async function getMembers() {
  try {
    let res = await axios.get("http://localhost:4000/main/members", {
      headers: { Authorization: token },
    });

    if (res.data.message === "got") {
      return res.data.members;
    } else {
      alert("Somthing Went Wrong");
    }
  } catch (err) {
    console.log(err);
  }
}

async function showUserData() {
  // earnings
  let total = document.getElementById("total");
  let today = document.getElementById("today");
  let direct = document.getElementById("direct");
  let level = document.getElementById("level");

  const earning = await getEarning();

  total.innerText = earning.total.toFixed(2);
  today.innerText = earning.today.toFixed(2);;
  direct.innerText = earning.direct.toFixed(2);;
  level.innerText = earning.level.toFixed(2);;

  // members

  let totalMembes = document.getElementById("totalTeam");
  let directReffral = document.getElementById("directReffral");
  let activeMembers = document.getElementById("activeMembers");
  let notActive = document.getElementById("notActive");

  const members = await getMembers();

  console.log(members);

  const activeTeam = members.team.filter((member) => member.planType != null);

  const notActiveTeam = members.team.filter(
    (member) => member.planType === null
  );

  totalMembes.innerText = members.team.length;
  directReffral.innerText = members.directTeam.length;
  activeMembers.innerText = activeTeam.length;
  notActive.innerText = notActiveTeam.length;

  showTeam(members.team, activeTeam, members.directTeam);
}

window.addEventListener('DOMContentLoaded', async()=>{

  await showUserData();
});


function showTeam(total, active, direct) {
  let totalTeamBtn = document.getElementById("totalTeamBtn");
  let activeTeamBtn = document.getElementById("activeTeamBtn");
  let directTeamBtn = document.getElementById("directTeamBtn");

  totalTeamBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.target.style = "background-color: #719efd";

    activeTeamBtn.style = "background-color: #104dd1";
    directTeamBtn.style = "background-color: #104dd1";

    show(total);
  });

  activeTeamBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.target.style = "background-color: #719efd";

    directTeamBtn.style = "background-color: #104dd1";
    totalTeamBtn.style = "background-color: #104dd1";

    show(active);
  });

  directTeamBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.target.style = "background-color: #719efd";

    activeTeamBtn.style = "background-color: #104dd1";
    totalTeamBtn.style = "background-color: #104dd1";

    show(direct);
  });


  function show(team) {
    let table = document.getElementById("table");
    table.innerHTML = "";
    for (let index = 0; index < team.length; index++) {

      showMember(team[index]);
    }
  }

  totalTeamBtn.click();
}

function showMember(member) {

  let table = document.getElementById("table");

  let tr = document.createElement("tr");

  let no = document.createElement("td");
  no.appendChild(document.createTextNode(member.id));

  let name = document.createElement("td");
  name.appendChild(document.createTextNode(member.name));

  let joiningDate = document.createElement("td");

  let date = new Date(member.createdAt);
  joiningDate.appendChild(
    document.createTextNode(
      `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
    )
  );

  let plan = document.createElement("td");
  plan.appendChild(document.createTextNode(member.planType));

  tr.appendChild(no);
  tr.appendChild(name);
  tr.appendChild(joiningDate);
  tr.appendChild(plan);

  table.appendChild(tr);
}

// uploading recipt

let reciptPhoto;
document.getElementById("recipt-photo").addEventListener("change", (e) => {
  reciptPhoto = e.target.files[0];

  console.log(reciptPhoto);
});

document.getElementById("upload").addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    let name = document.getElementById("name").value;
    let amount = document.getElementById("amount").value;
    let transactionId = document.getElementById("transactionId").value;

    let obj = {
      name: name,
      amount: amount,
      transactionId: transactionId,
    };

    const formData = new FormData();

    formData.append("file", reciptPhoto);
    formData.append("info", JSON.stringify(obj));

    const res = await axios.post(
      "http://localhost:4000/main/joining-request",
      formData,
      {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if(res.data.message === 'got'){

      alert('Recipt is Uploaded successfully');
      document.getElementById("upload-recipt-form").style.display = "none";
    }
    
  } catch (err) {
    console.log(err);
  }
});


// boost board 


document.getElementById('boost-income').addEventListener('click', async(e)=>{

  e.preventDefault();
  try{

    const res = await axios.get(
      "http://localhost:4000/main/join-boost-board",{
        headers: { Authorization: token}
      }
    );

    console.log(res.data.message);

  }
  catch(err){
    console.log(err);
  }
});