function getPriceResultStyles(message, success = true) {
  if (!message) return null;

  return {
    textContent: message,
    display: 'block',
    color: success ? '#047857' : '#b91c1c',
    borderColor: success ? '#a7f3d0' : '#fecaca',
    background: success ? '#ecfdf5' : '#fef2f2'
  };
}

module.exports = getPriceResultStyles;
