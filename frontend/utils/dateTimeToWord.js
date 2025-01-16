const dateTimeToWord = (str) =>{
    try{
        const dateToWord = (date) => {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(date).toLocaleDateString('en-US', options);
          };
          
          // Usage
          //const myDate = new Date(); // Current date and time
          //console.log(dateToWord(myDate)); // Example output: "December 26, 2024"
           // e.g., "9/29/2021, 3:00:00 PM"
return dateToWord(str);
    }
    catch(e){
        return str
    }
}

export default dateTimeToWord