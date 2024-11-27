const authorize = (roles = []) => {
    if (typeof roles === 'string') {
      roles = [roles];
    }
  
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).send({ message: 'Forbidden. You do not have the required permissions.' });
      }
      next();
    };
  };
  
  export default authorize;
  