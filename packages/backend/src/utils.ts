export const isUserLoggedIn = (req, res, next) => {
  console.log(req.user);
  console.log(req.isAuthenticated());
  if (!req.isAuthenticated()) {
    res.status(401).send("User not authenticated");
    return;
  }
  next();
}