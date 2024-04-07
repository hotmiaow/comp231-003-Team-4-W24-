const express = require('express');

const emailConfirmationRouter = express.Router();

const {emailConfirm, emailUpdateConfirm, emailCancelConfirm} = require("../Controller/emailConfirm");

emailConfirmationRouter.post("/api/emailConfirm", emailConfirm);
emailConfirmationRouter.post("/api/emailUpdate", emailUpdateConfirm);
emailConfirmationRouter.post("/api/emailCancel", emailCancelConfirm);

module.exports = emailConfirmationRouter;