module.exports = (requiredRole) => {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role) {
      return res.status(401).json({ message: "No autorizado" });
    }
    if (role !== requiredRole) {
      return res.status(403).json({ message: "Acceso denegado" });
    }
    next();
  };
};
