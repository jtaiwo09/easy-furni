const commission = 0.1;

const filter = async (req, Model, filterObj = {}) => {
  const queryObj = { ...req.query, ...filterObj };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);

  let query = Model.find(queryObj);

  // SORT
  if (req.query.sort) {
    query.sort(req.query.sort);
  } else {
    query = query.sort("-createdAt");
  }

  // PAGINATION
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  const count = await Model.countDocuments();

  if (skip > count) {
    next(new ErrorHandler("This page does not exist"));
  }

  const totalPages = Math.ceil(count / limit);

  return { query, count, totalPages };
};

module.exports = { commission, filter };
