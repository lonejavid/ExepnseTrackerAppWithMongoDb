
    
    
    const submitBtn=document.querySelector('.signup-btn');
    const nameInput=document.querySelector('.input-box[type="name"]');
    const emailInput=document.querySelector('.input-box[type="email"]');
    const phoneInput=document.querySelector('.input-box[type="number"]');
    const passwordInput=document.querySelector('.input-box[type="password"]');
    submitBtn.addEventListener('click',async (e)=>{
            e.preventDefault();
            const name=nameInput.value;
            console.log("the ame",name)
            const email=emailInput.value;
            const phone=phoneInput.value;
            const passwd=passwordInput.value;
            const userInfo={
                name:name,
                email:email,
                phone:phone,
                passwd:passwd
            }
            try {
                const response = await axios.post('http://localhost:3000/signup', userInfo);
        
                if (response.status === 200) {
                    window.alert("User added successfully.");
                    window.location.href = "login.html";
                }
            } catch (error) {
                if (error.response && error.response.status === 409) {
                    window.alert("User already exists.");
                } else {
                    console.error("Error signing up:", error);
                    window.alert("An error occurred while signing up. Please try again later.");
                }
            }
            

        })

    








function validateEmail(email)
{
    //const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const checker=   /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return checker.test(email);
}