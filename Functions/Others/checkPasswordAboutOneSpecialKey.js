function checkPasswordAboutOneSpecialKey(enteredPassword) {
  const checkEnteredPassword = /[!@#$%^&*]/.test(enteredPassword);
  return checkEnteredPassword;
}

module.exports = checkPasswordAboutOneSpecialKey;
