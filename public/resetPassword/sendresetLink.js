async function forgotpassword(e){
    e.preventDefault();
    const emailInput=document.getElementById('email');
    const email=emailInput.value;
    console.log("the email received is ",email)
    axios.post('http://localhost:3000/forgotPassword',{email})
  
   .then((result)=>{
        alert(result.data.message);
        e.target.reset()
        
    console.log("received data",result)
    }).catch(Err=>{
        console.log("this is the error ",Err)
    })
}

