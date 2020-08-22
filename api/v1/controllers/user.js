const User = require("../models/user");
const {
  FAILED,
  USER_NOT_EXISTS,
  USER_DATA_UPDATE_FAILED,
} = require("../utils/constants").errors;

const {
  SUCCESS,
  FETCHED_USER_DATA,
  UPDATED_USER_DATA,
} = require("../utils/constants").successMessages;

module.exports.createUser = async (userData) => {
  var user = new User({
    userId: userData._id,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    photoUrl: userData.photoUrl,
  });
  await user.save();
};

module.exports.getUser = async (req, res) => {
  await User.findOne(
    { email: req.tokenData.email },
    { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 }
  )
    .then((document) => {
      if (!document) {
        return res.status(403).json({
          status: FAILED,
          message: USER_NOT_EXISTS,
        });
      }
      return res.status(200).json({
        status: SUCCESS,
        message: FETCHED_USER_DATA,
        user: document,
      });
    })
    .catch((err) => console.log(err));
};

module.exports.updateUser = async (req, res) => {
  var user = await User.findOne(
    { email: req.tokenData.email },
    { createdAt: 0, updatedAt: 0, __v: 0 }
  );
  user = _updateUserModel(user, req.body);
  await user.save((error, updated) => {
    if (error)
      return res.status(403).json({
        status: FAILED,
        message: USER_DATA_UPDATE_FAILED,
      });
    return res.status(200).json({
      status: SUCCESS,
      message: UPDATED_USER_DATA,
      user: updated,
    });
  });
};

module.exports.deleteUser = async (email) => {
  await User.deleteOne({ email: email });
};

function _updateUserModel(userData, updated) {
  if (updated.firstName) userData.firstName = updated.firstName;

  if (updated.lastName) userData.lastName = updated.lastName;

  if (updated.website) userData.website = updated.website;

  if (updated.profession) userData.profession = updated.profession;

  if (updated.gender) userData.gender = updated.gender;

  if (updated.location) userData.location = updated.location;

  if (updated.knownLanguages) userData.knownLanguages = updated.knownLanguages;

  if (updated.age) userData.age = updated.age;

  return userData;
}
