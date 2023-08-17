// create token and saving that in cookies
const sendShopToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  // Options for cookies
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
  };
  delete user._doc.password;
  res.cookie("seller_id", user._id.toString(), options);
  res.cookie("seller_token", token, options);
  res.status(statusCode).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendShopToken;
