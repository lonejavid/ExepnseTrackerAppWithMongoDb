  const loginBtn=document.getElementById('login');
  loginBtn.addEventListener('click', async (e) => {
   const emailInput=document.getElementById('input-box1').value;
   const passedInput=document.getElementById('input-box2').value;
   const loginDetails={email:emailInput,password:passedInput}
   axios.post('http://localhost:3000/login',loginDetails).then(responce=>{
    if(responce.status===200)
    {
        alert(responce.data.message);
        localStorage.setItem('token',responce.data.token);
        window.location.href='dashboard.html';
   }
  })  
})
