
console.log("admin");
window.addEventListener('DOMContentLoaded', async ()=>{

    
    console.log("fetching data");
    const res = await axios.get('http://localhost:4000/admin/company-info');

    if(res.data.message === 'got'){

    // members
        document.getElementById("green_member_in_lifetime").innerText = res.data.info.greenMemberInLifetime + " ";
        document.getElementById("green_member_in_this_month").innerText = res.data.info.greenMemberInThisMonth + " ";
        document.getElementById("red_member_in_lifetime").innerText = res.data.info.redMemberInLifetime + " ";
        document.getElementById("red_member_in_this_month").innerText = res.data.info.redMemberInThisMonth + " ";

    // earning
        document.getElementById("earning_in_lifetime").innerText = res.data.info.earningInLifetime + '.00₹';
        document.getElementById("earning_in_this_month").innerText = res.data.info.earningInThisMonth + '.00₹';

    }
    else{
        alert('Something Went Wrong ! Please Refresh')
    }
    console.log(res.data);

    const result = await axios.get('http://localhost:4000/admin/members-info');

    const message = result.data.message;
    const newMembers = result.data.newMembers

    if(message === 'got'){

        for(let i = 0;i<newMembers.length;i++){
            showMember(newMembers[i], i+1);
        }
    }

});

function showMember(member, index){

    let newMembers = document.getElementById('newMembers');

    let tr = document.createElement('tr');

    let no = document.createElement('td');
    no.appendChild(document.createTextNode(index));

    let name = document.createElement('td');
    name.appendChild(document.createTextNode(member.name));

    let email = document.createElement('td');
    email.appendChild(document.createTextNode(member.email));

    let joiningDate = document.createElement('td');

    let date = new Date(member.createdAt);
    joiningDate.appendChild(document.createTextNode(`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`));

    let plan = document.createElement('td');
    plan.appendChild(document.createTextNode(member.planType));

    tr.appendChild(no);
    tr.appendChild(name);
    tr.appendChild(email);
    tr.appendChild(joiningDate);
    tr.appendChild(plan);

    newMembers.appendChild(tr);
}