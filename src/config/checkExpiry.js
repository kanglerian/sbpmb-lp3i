const checkExpiry = () => {
  const token = localStorage.getItem('token');
  const expiry = localStorage.getItem('expiry');
  if (token && expiry) {
    const expiryTime = new Date(expiry).getTime();
    const currentTime = new Date().getTime();
    if (currentTime > expiryTime) {
      localStorage.removeItem('token');
      localStorage.removeItem('expiry');
      localStorage.removeItem('identity');
      window.location.href = '/login';
    }
  }
};

export default checkExpiry;