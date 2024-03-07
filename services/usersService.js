// usersService.js
const User = require('../models/user');
const Ad = require('../models/ad');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = require('../config');
const path = require('path');
const ejs = require('ejs');

exports.login = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  const token = user.generateAuthToken();
  res.json({ token });
};

exports.requestAd = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role !== 'publisher') {
      return res.status(403).json({ error: 'Only publishers can request to publish ads on their website' });
    }

    const token = jwt.sign({ _id: user._id }, config.jwtSecret, { expiresIn: '1h' });

    const transporter = nodemailer.createTransport({
      service: config.email.service,
      auth: config.email.auth,
    });

    const emailTemplate = await ejs.renderFile(path.join(__dirname, '../views/emails/ad_request.ejs'), { token });

    const mailOptions = {
      from: config.email.auth.user,
      to: email,
      subject: 'Ad Request',
      html: emailTemplate,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      console.log('Email sent: ' + info.response);
      res.json({ message: 'Email sent with ad request link' });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.sendAdEmail = async (adId) => {
  try {
    const ad = await Ad.findById(adId);
    if (!ad) {
      console.error('Ad not found');
      return;
    }

    const user = await User.findById(ad.creatorId);
    if (!user) {
      console.error('User not found');
      return;
    }

    const transporter = nodemailer.createTransport({
      service: config.email.service,
      auth: config.email.auth,
    });

    const emailTemplate = await ejs.renderFile(path.join(__dirname, '../views/emails/ad_created.ejs'), { ad });

    const mailOptions = {
      from: config.email.auth.user,
      to: user.email,
      subject: 'Ad Created',
      html: emailTemplate,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log('Email sent: ' + info.response);
    });
  } catch (err) {
    console.error(err);
  }
};
