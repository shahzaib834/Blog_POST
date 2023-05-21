//const User = require('../models/User');
//const Follow = require('../models/Follow');

const showAllUsers = async (req, res) => {
  const users = await User.findAll();

  res.send(users);
};

const showUserWithId = async (req, res) => {
  const { email } = req.params;
  const user = await User.findByPk(email);

  if (!user) {
    return res.status(404).send('User Not Found');
  }
  res.send(user);
};

const updateUser = async (req, res) => {
  const { name } = req.body;
  const user = await User.findByPk(req.user.email);

  if (!name) {
    res.status(400).send('Please send all fields');
  }

  const updatedUser = await User.update(
    { name },
    {
      where: {
        email: user.email,
      },
    }
  );

  res.status(200).send(updatedUser);
};

const followUser = async (req, res) => {
  try {
    // Getting User who will follow
    const loggedInUser = await User.findByPk(req.user.email);

    // Getting User who to follow.
    const toFollow = await User.findByPk(req.params.email);

    //Validating user input
    if (!toFollow) {
      res.status(400).send(`Please select a valid User`);
    }

    const alreadyFollowed = await Follow.findAll({
      where: {
        followedEmail: loggedInUser.email,
      },
    });

    if (alreadyFollowed.length) {
      return res.status(400).send(`Already Followed`);
    }

    // Incrementing followers Count
    await User.update(
      { followersCount: toFollow.followersCount + 1 },
      {
        where: {
          email: toFollow.email,
        },
      }
    );

    // Increment Following Count
    await User.update(
      { followingCount: loggedInUser.followingCount + 1 },
      {
        where: {
          email: loggedInUser.email,
        },
      }
    );

    // Adding followingData to Following Table
    await Follow.create({
      userEmail: loggedInUser.email,
      userName: loggedInUser.name,
      followedEmail: toFollow.email,
      followedName: toFollow.name,
    });

    res.status(200).send(`Followed ${toFollow.name} by ${loggedInUser.name}`);
  } catch (err) {
    res.status(400).send(`Error : ${err}`);
  }
};

module.exports = {
  showAllUsers,
  showUserWithId,
  updateUser,
  followUser,
};
