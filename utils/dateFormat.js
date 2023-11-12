export default date => {
  // Input date string
  const inputDateString = date;

  // Create a Date object from the input string
  const inputDate = new Date(inputDateString);

  // Get month, day, and year components
  const month = String(inputDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(inputDate.getDate()).padStart(2, "0");
  const year = String(inputDate.getFullYear()).slice(-2); // Get the last two digits of the year

  // Format the date
  return `${month}/${day}/${year}`;
};
