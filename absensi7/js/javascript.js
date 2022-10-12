fetch("http:192.168.0.119:3000/siswa",{
    method:'get',
    headers:{
        'Content-Type':'application/json'
    },0
    body:JSON.stringify({
        ",
        /*"nama": null,
        "kelas": null,
        "jenis kelamin": null,
        "no_ortu": null*/
    })
.then((Response)=>Response.json())
.then((json)=>console.log(json))
})