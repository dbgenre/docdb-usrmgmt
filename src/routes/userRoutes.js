const express = require('express');
const { body, param } = require('express-validator');
const userController = require('../controllers/userController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// Validation middleware
const createUserValidation = [
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers and underscores'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/)    
    .withMessage('Password must contain at least one letter and one number'),
  body('roles')
    .isArray()
    .withMessage('Roles must be an array')
    .notEmpty()
    .withMessage('At least one role must be specified')
];

const roleValidation = [
  body('roles')
    .isArray()
    .withMessage('Roles must be an array')
    .notEmpty()
    .withMessage('At least one role must be specified')
];

// Routes
router.post('/', createUserValidation, validateRequest, userController.createUser);

router.get('/', userController.listUsers);

router.post('/:username/roles', 
  param('username').trim().notEmpty(),
  roleValidation,
  validateRequest,
  userController.allocateRoles
);

router.delete('/:username/roles',
  param('username').trim().notEmpty(),
  roleValidation,
  validateRequest,
  userController.revokeRoles
);

router.delete('/:username',
  param('username').trim().notEmpty(),
  validateRequest,
  userController.deleteUser
);

module.exports = router;