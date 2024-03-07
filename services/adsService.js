// adsService.js
const User = require('../models/user');
const Ad = require('../models/ad');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = require('../config');
const path = require('path');
const ejs = require('ejs');

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


exports.getAds = async (req, res) => {
  try {
    const ads = await Ad.find({ isActive: true });
    res.json(ads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createAd = async (req, res) => {
  try {
    const { title, description, imageUrl, linkUrl, type, tags } = req.body;
    const ad = new Ad({ title, description, imageUrl, linkUrl, type, tags });
    await ad.save();
    res.json(ad);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.serveAds = async (req, res) => {
  try {
    const ads = await Ad.find({ isActive: true });
    res.json(ads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.serveAd = async (req, res) => {
  try {
    const adId = req.params.adId;
    const ad = await Ad.findById(adId);

    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' });
    }

    if (!ad.isActive) {
      return res.status(400).json({ error: 'Ad is not active' });
    }

    res.json(ad);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateImpressions = async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(req.params.adId, { $inc: { impressions: 1 } }, { new: true });
    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' });
    }
    res.json(ad);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateBudget = async (req, res) => {
  try {
    const { budget } = req.body;
    const ad = await Ad.findByIdAndUpdate(req.params.adId, { $inc: { budget, moneySpent: budget } }, { new: true });
    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' });
    }
    res.json(ad);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
