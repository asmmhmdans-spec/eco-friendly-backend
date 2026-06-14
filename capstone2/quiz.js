// جعلنا الدالة تستقبل الإجابات كمعامل (answers) لسهولة فحصها
function calculateQuizResult(answers) {
  // لو لم يتم إرسال أي إجابات، نضع كائن فارغ كحماية من الـ Error
  const currentAnswers = answers || {};
  
  const score = (currentAnswers.q1 || 0) + (currentAnswers.q2 || 0) + (currentAnswers.q3 || 0);
  
  if (score >= 3) return 'green';
  if (score === 2) return 'orange';
  return 'red';
}

module.exports = calculateQuizResult;
