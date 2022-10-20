let menu = document.querySelector('.menu')
let sidebar = document.querySelector('.sidebar')
let mainContent = document.querySelector('.main--content')

menu.onclick = function() {
    sidebar.classList.toggle('active')
    mainContent.classList.toggle('active')
}


const editlist = document.querySelector('.table')
const url = "http://localhost:4000"

editlist.addEventListener('click',(e)=>{
    e.preventDefault();
    let delbutton = e.target.id == "delete-post-sd"
    let editbutton = e.target.id == "edit-post.sd"

    let id = e.target.parentElement.dataset.id

    if(delbutton){
        fetch(`${url}/siswa/edit/${id}`)
    }
    

})