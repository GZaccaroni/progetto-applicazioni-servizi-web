export const isUserLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(401).send("User not authenticated");
    return;
  }
  next();
}