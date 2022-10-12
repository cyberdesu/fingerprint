async function getUsers() {
    let url = 'http://192.168.0.119:3000/siswa';
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

