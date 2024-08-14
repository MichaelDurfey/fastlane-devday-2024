function getRandomAmount() {
  const randomNumber = (Math.random() * (200 - 10)) + 10;
  
  return randomNumber.toFixed(2);
}

module.exports = {
  getRandomAmount
};