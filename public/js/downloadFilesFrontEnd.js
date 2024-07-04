const btn=document.getElementById('list-of-downloaded-files');
btn.addEventListener('click',async(e)=>{
    e.preventDefault();
    const token=localStorage.getItem('token');
    const allFiles =await axios.get('http://localhost:3000/allFiles',{headers: {"Authentication": token }});
    
    const filesare = allFiles.data.fileLocs;
    console.log(filesare);
    
    const ulElement = document.getElementById('downloadedFiles');
    
    filesare.forEach(file => {
        // Create an anchor tag
        const aElement = document.createElement('a');
        aElement.href = file.filelocation;
        aElement.textContent = 'Download File';  // You can customize the text as needed
    
        // Create a list item and append the anchor tag to it
        const liElement = document.createElement('li');
        liElement.appendChild(aElement);
    
        // Append the list item to the ul element
        ulElement.appendChild(liElement);
    });

});