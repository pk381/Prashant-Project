
async function getTree(){

    console.log("get tree");
    const result = await axios.get('http://localhost:4000/admin/tree-data/0');

    const treeDOMElement = document.querySelector('.tree');

    treeDOMElement.innerHTML = '';
    treeDOMElement.appendChild(showTree(result.data.data));


}

getTree();

function showChildren(nodeChildren){

    let children = document.createElement('div');
    children.className = 'node_children';

    for(let i = 0;i<nodeChildren.length;i++){
        children.appendChild(showTree(nodeChildren[i]));
    }
    return children;

}

function showTree(data){

    let node = document.createElement('div');
    node.className = 'node';

    let element = document.createElement('div');
    element.className = 'node_element';

    element.appendChild(document.createTextNode(data.element.name));

    node.appendChild(element);
    node.appendChild(showChildren(data.children));

    node.onclick = async (e)=>{

        e.stopPropagation();

        
        if(e.target.firstElementChild === null){

            const result = await axios.get('http://localhost:4000/admin/tree-data/'+ data.element.id);
            
            let parent = e.target.parentElement;
            parent.innerHTML = '';
            parent.appendChild(showTree(result.data.data));
        }

    }

    return node;
}