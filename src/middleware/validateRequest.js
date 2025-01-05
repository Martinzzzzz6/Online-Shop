const validateRequest = (requiredFields) => (req, res, next) => {
    const missingFields = requiredFields.filter(field => !(field in req.body));
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing fields: ${missingFields.join(', ')}` });
    }
    next();
  };
  
  module.exports = validateRequest;
  