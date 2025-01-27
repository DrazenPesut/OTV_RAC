const requiresAuthError = (req, res, next) => {
    if (!req.oidc.isAuthenticated()) {
      return res.status(401).json({
        status: 'Unauthorized',
        message: 'You must be logged in to access this resource.',
      });
    }
    next();
  };
  
  module.exports = { requiresAuthError };
  