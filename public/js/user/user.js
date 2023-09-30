const user = JSON.parse(localStorage.getItem("user"));

document.getElementById("linkLeft").innerText = `/sign_up/${user.id}/Left`;
document.getElementById("linkRight").innerText = `/sign_up/${user.id}/Right`;

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await axios.get("http://localhost:4000/user/get-info", {
      headers: { Authorization: localStorage.getItem("token") },
    });

    if (res.data.message === "got") {
      let user = res.data.info;

      document.getElementById("userName").innerText = "Name: " + user.name;
      document.getElementById("email").innerText = "Email: " + user.email;
      document.getElementById("phoneNo").innerText = "Mob. No.: " + user.phone;
      document.getElementById("joiningDate").innerText =
        "Joining Date: " + user.joiningDate;
    }
  } catch (err) {
    console.log(err);
  }
});

// changing password

let getFormBtn = document.getElementById("changePassword");

getFormBtn.addEventListener("click", (e) => {
  e.preventDefault();

  let form = document.getElementById("change-form");

  if (form.style.display === "none") {
    form.style.display = "flex";
  } else {
    form.style.display = "none";
  }
});

getFormBtn.click();

document.getElementById("cancel").addEventListener("click", (e) => {
  e.preventDefault();

  document.getElementById("change-form").style.display = "none";
});

document.getElementById("change").addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    let oldPassword = document.getElementById("oldPassword").value;
    let newPassword = document.getElementById("newPassword").value;

    let obj = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    const res = await axios.post(
      "http://localhost:4000/user/change-password", obj,
      { headers: { Authorization: localStorage.getItem("token")}}
    );

    const message = res.data.message;

    if (message === "got") {
      alert("Password Changed Successfully!");
      getFormBtn.click();
      localStorage.setItem("token", res.data.token);
    } else if (message === "wrong") {
      alert("Your Old Password is Wrong! Please Enter a Valid Password");
    } else {
      alert("Something Went Wrong! Please Try Again");
    }
  } catch (err) {
    console.log(err);
  }
});


async function getImage(){

  
  try{
    
    const res = await axios.get("http://localhost:4000/main/get-image",
    { headers: { Authorization: localStorage.getItem("token")}}
    );
    
    let images = res.data.images;

    
    const blob = new Blob([images.data], {type: 'image/jpg'}); // Adjust the type as needed
    
    console.log(blob);

    const photo = new File([images], {type: blob.type});

    console.log(photo);

    const objectURL = URL.createObjectURL(photo);

    console.log(images, objectURL);

    document.getElementById('image').src = objectURL;

  }
  catch(err){
    console.log(err);
  }
}


getImage();