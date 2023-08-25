// create token and saving that in cookies
const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  // Options for cookies
  // const options = {
  //   expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  //   // httpOnly: true,
  //   sameSite: "None",
  //   secure: true,
  //   path: "/",
  // };
  // res.cookie("token123", token, options);
  res.status(statusCode).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;
