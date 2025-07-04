const { getAdminDb } = require('../config/database');
const logger = require('../utils/logger');
const { ApiError } = require('../middleware/errorHandler');

const createUser = async (req, res, next) => {
  try {
    const { username, password, roles } = req.body;
    const adminDb = getAdminDb();

    // Check if user already exists
    const existingUser = await adminDb.command({ usersInfo: { user: username } });
    if (existingUser.users.length > 0) {
      throw new ApiError(400, 'User already exists');
    }

    // Create user command
    await adminDb.command({
      createUser: username,
      pwd: password,
      roles: roles.map(role => ({ role, db: 'admin' }))
    });

    logger.info(`User ${username} created successfully`);
    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      data: { username, roles }
    });
  } catch (error) {
    next(error);
  }
};

const listUsers = async (req, res, next) => {
  try {
    const adminDb = getAdminDb();
    const result = await adminDb.command({ usersInfo: 1 });

    const users = result.users.map(user => ({
      username: user.user,
      roles: user.roles.map(role => role.role)
    }));

    res.status(200).json({
      status: 'success',
      data: { users }
    });
  } catch (error) {
    next(error);
  }
};

const allocateRoles = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { roles } = req.body;
    const adminDb = getAdminDb();

    // Check if user exists
    const existingUser = await adminDb.command({ usersInfo: { user: username } });
    if (existingUser.users.length === 0) {
      throw new ApiError(404, 'User not found');
    }

    // Grant roles
    await adminDb.command({
      grantRolesToUser: username,
      roles: roles.map(role => ({ role, db: 'admin' }))
    });

    logger.info(`Roles ${roles.join(', ')} granted to user ${username}`);
    res.status(200).json({
      status: 'success',
      message: 'Roles allocated successfully',
      data: { username, roles }
    });
  } catch (error) {
    next(error);
  }
};

const revokeRoles = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { roles } = req.body;
    const adminDb = getAdminDb();

    // Check if user exists
    const existingUser = await adminDb.command({ usersInfo: { user: username } });
    if (existingUser.users.length === 0) {
      throw new ApiError(404, 'User not found');
    }

    // Revoke roles
    await adminDb.command({
      revokeRolesFromUser: username,
      roles: roles.map(role => ({ role, db: 'admin' }))
    });

    logger.info(`Roles ${roles.join(', ')} revoked from user ${username}`);
    res.status(200).json({
      status: 'success',
      message: 'Roles revoked successfully',
      data: { username, roles }
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { username } = req.params;
    const adminDb = getAdminDb();

    // Check if user exists
    const existingUser = await adminDb.command({ usersInfo: { user: username } });
    if (existingUser.users.length === 0) {
      throw new ApiError(404, 'User not found');
    }

    // Delete user
    await adminDb.command({ dropUser: username });

    logger.info(`User ${username} deleted successfully`);
    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  listUsers,
  allocateRoles,
  revokeRoles,
  deleteUser
};