const express = require('express');

const emailConfirmationRouter = express.Router();

const {emailConfirm, emailUpdateConfirm, emailCancelConfirm} = require("../Controller/emailConfirm");

emailConfirmationRouter.post("/emailConfirm", emailConfirm);
emailConfirmationRouter.post("/emailUpdate", emailUpdateConfirm);
emailConfirmationRouter.post("/emailCancel", emailCancelConfirm);

module.exports = emailConfirmationRouter;