const token = localStorage.getItem('token');

document.getElementById('hide').addEventListener('click', async(e) =>{
    document.getElementById('request-info').style.display = 'none';
});

async function getRequests(){
    try{

        let res = await axios.get("http://localhost:4000/admin/requests",{
            headers: { Authorization: token}
        });
        
        if(res.data.message === 'got'){
            return res.data.requests;
        }
    } 
    catch(err){
        console.log(err);
    }
}


window.addEventListener('DOMContentLoaded', async ()=>{

    try{

        const requests = await getRequests();

        document.getElementById('table').innerHTML = '';

        for(let  i = 0;i<requests.length;i++){
            showRequest(requests[i]);
        }
    }
    catch(err){
        console.log(err);
    }
})


function showRequest(request){

    let newMembers = document.getElementById('table');

    let tr = document.createElement('tr');

    let no = document.createElement('td');
    no.appendChild(document.createTextNode(request.userId));

    let name = document.createElement('td');
    name.appendChild(document.createTextNode(request.amount));

    let transactionId = document.createElement('td');
    transactionId.appendChild(document.createTextNode(request.transactionId));

    let requestDate = document.createElement('td');

    let date = new Date(request.createdAt);
    requestDate.appendChild(document.createTextNode(`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`));

    let button = document.createElement('td');
    let btn = document.createElement('button');
    btn.appendChild(document.createTextNode('Check'));
    button.appendChild(btn);

    btn.onclick = async()=>{

        document.getElementById("userName").innerText = "Name: " + request.userId;
        document.getElementById("amount").innerText = "Email: " + request.amount;
        document.getElementById("transactionId").innerText = "Transaction Id: " + request.transactionId;
        document.getElementById("Date").innerText = "Date: " + date;

        document.getElementById('request-info').style.display = 'flex';

        document.getElementById('approve').addEventListener('click', async()=>{
            await updateRequest(request, 'APPROVED');
        });

        document.getElementById('cancel').addEventListener('click', async ()=>{
            await updateRequest(request, 'CANCELED');

        });
    }

    tr.appendChild(no);
    tr.appendChild(name);
    tr.appendChild(requestDate);
    tr.appendChild(transactionId);
    tr.appendChild(button);

    newMembers.appendChild(tr);
}

async function updateRequest(request, status){

    try{

        let obj = {

            id: request.id,
            status: status
        }

        let res = await axios.put("http://localhost:4000/admin/request", obj, {
            headers: { Authorization: token}
        });

        if(res.data.message === 'approved'){

            alert(`Request is Approved For Id ${request.userId}`);
        }
        else{     
            alert(`Request is Canceled For Id ${request.userId}`);
        }
    }
    catch(err){
        console.log(err);
    }

}