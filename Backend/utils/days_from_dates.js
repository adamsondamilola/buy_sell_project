function daysBetweenDates(date1, date2) {
    // Parse the dates for proper comparison
    const startDate = new Date(date1);
    const endDate = new Date(date2);
    
    // Calculate the difference in milliseconds
    const diffTime = Math.abs(endDate - startDate);
    
    // Convert milliseconds to days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let days = 1;
    if(diffDays < 1) days = 1;
    return days;
  }
  
  module.exports = daysBetweenDates  