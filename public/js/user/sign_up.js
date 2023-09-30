
console.log("hi");
let message = document.getElementById('message');

const userName = document.getElementById('name');
const email = document.getElementById('email');
const referralId = document.getElementById('referralId');
const phone =  document.getElementById('phone');
const password = document.getElementById('password');

document.getElementById('sign_up').addEventListener('click', async (e)=>{

    e.preventDefault();

    let obj = {
        name: userName.value,
        email: email.value,
        referralId: referralId.value,
        phone: phone.value,
        password: password.value
    }

    console.log(obj);
    try{
        const res = await axios.post("http://localhost:4000/user/sign_up", obj);

        if(res.data.message === 'userExist'){
            alert('email already exist please login');
        }
        else{

            alert('account created successfully');

            window.location.href = "/user/login";
        }      
    }
    catch(err){

        alert("somthingwent wrong");
        console.log(err);
    }
   
});