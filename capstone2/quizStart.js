function validateQuizInput(inputValue) {
  const trimmedValue = (inputValue || "").trim();

  if (trimmedValue === "") {
    return {
      isValid: false,
      borderColor: "red",
      placeholder: "من فضلك اكتب اسم المنتج"
    };
  }

  return {
    isValid: true,
    borderColor: "", // فارغ يعني طبيعي
    placeholder: ""
  };
}

module.exports = validateQuizInput;
