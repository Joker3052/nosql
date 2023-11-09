const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get(`/`, async (req, res) => {
    try {
      const userList = await User.find().select('-passwordHash');
  
      if (!userList) {
        return res.status(500).json({ success: false, error: 'Error fetching user list.' });
      }
      
      res.send(userList);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  router.get('/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-passwordHash');
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'The user with the given ID was not found.' });
      }
  
      res.status(200).send(user);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  router.post('/', async (req, res) => {
    try {
      let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
      });
  
      user = await user.save();
  
      if (!user) {
        return res.status(400).send('The user cannot be created!');
      }
  
      res.send(user);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  router.put('/:id', async (req, res) => {
    try {
      const userExist = await User.findById(req.params.id);
      let newPassword;
      
      if (req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10);
      } else {
        newPassword = userExist.passwordHash;
      }
  
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          email: req.body.email,
          passwordHash: newPassword,
          phone: req.body.phone,
          isAdmin: req.body.isAdmin,
          street: req.body.street,
          apartment: req.body.apartment,
          zip: req.body.zip,
          city: req.body.city,
          country: req.body.country,
        },
        { new: true }
      );
  
      if (!user) {
        return res.status(400).send('The user cannot be created!');
      }
  
      res.send(user);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  router.post('/login', async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      const secret = process.env.secret;
  
      if (!user) {
        return res.status(400).send('The user not found');
      }
  
      if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
          {
            userId: user.id,
            isAdmin: user.isAdmin
          },
          secret,
          { expiresIn: '1d' }
        );
       
        res.status(200).send({ user: user.email, token: token });
      } else {
        res.status(400).send('Password is wrong!');
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  router.post('/register', async (req, res) => {
    try {
      let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
      });
  
      user = await user.save();
  
      if (!user) {
        return res.status(400).send('The user cannot be created!');
      }
  
      res.send(user);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  router.delete('/:id', async (req, res) => {
    try {
      const user = await User.findByIdAndRemove(req.params.id);
      
      if (user) {
        return res.status(200).json({ success: true, message: 'The user is deleted!' });
      } else {
        return res.status(404).json({ success: false, message: 'User not found!' });
      }
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  });

router.get(`/get/count`, async (req, res) => {
    try {
      const userCount = await User.countDocuments();
      
      if (userCount === null) {
        res.status(500).json({ success: false });
      } else {
        res.status(200).json({ success: true, userCount: userCount });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });


module.exports =router;