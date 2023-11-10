const checkTimeLeft = () => {
  const timeLeft = localStorage.getItem('timeLeft');
  if (timeLeft) {
    window.location.href = '/seleksi-beasiswa';
  }
};

export default checkTimeLeft;