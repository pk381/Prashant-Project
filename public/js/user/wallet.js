document.getElementById("widthdrawl-btn").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("form-widthdrawl").style.display = "flex";
  console.log("widthdrwal");
});

document.getElementById("cancel").addEventListener("click", (e) => {
  e.preventDefault();

  document.getElementById("form-widthdrawl").style.display = "none";
});

const token = localStorage.getItem("token");

async function getwallet() {
  try {
    let res = await axios.get("http://localhost:4000/main/wallet-info", {
      headers: { Authorization: token },
    });
    if (res.data.message === "got") {
      return res.data.wallet;
    } else {
      alert("Somthing Went Wrong");
    }
  } catch (err) {
    console.log(err);
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const wallet = await getwallet();

    document.getElementById("available").innerText = wallet.available + ".00 $";
    document.getElementById("widthdrawl").innerText =
      wallet.widthdrawl + ".00 $";
  } catch (err) {
    console.log(err);
  }
});

document.getElementById("widthdraw").addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    let name = document.getElementById("name").value;
    let amount = document.getElementById("amount").value;
    let cryptoId = document.getElementById("cryptoId").value;


    let obj = {
      name: name,
      amount: amount,
      cryptoId: cryptoId
    };

    const res = await axios.post(
      "http://localhost:4000/main/widthdrawl-request",
      obj,
      {
        headers: { Authorization: token },
      }
    );

    const request = res.data.request;

    if (res.data.message === "got") {
      alert(
        `${request.name} Your Request for ${request.amount} has Been Placed`
      );

      document.getElementById("form-widthdrawl").style.display = "none";

    }
  } catch (err) {
    console.log(err);
  }
});

async function getHistory() {
  try {
    const res = await axios.get(
      "http://localhost:4000/main/widthdrawl-history",
      {
        headers: { Authorization: token },
      }
    );

    if (res.data.message === "got") {
      const history = res.data.history;
      let table = document.getElementById("table");
      table.innerHTML = "";

      for (let index = 0; index < history.length; index++) {
        showHistory(history[index], table);
      }
    }
  } catch (err) {
    console.log(err);
  }
}

getHistory();

function showHistory(member, table) {
  let tr = document.createElement("tr");

  let id = document.createElement("td");
  id.appendChild(document.createTextNode(member.id));

  let amount = document.createElement("td");
  amount.appendChild(document.createTextNode(member.amount + " .00 $"));

  let joiningDate = document.createElement("td");
  let date = new Date(member.createdAt);
  joiningDate.appendChild(
    document.createTextNode(
      `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
    )
  );

  let status = document.createElement("td");
  status.appendChild(document.createTextNode(member.status));

  tr.appendChild(id);
  tr.appendChild(joiningDate);
  tr.appendChild(status);
  tr.appendChild(amount);


  table.appendChild(tr);
}
