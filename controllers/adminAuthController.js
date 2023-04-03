const User = require('../models/Admin');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const auth=require('../middleware/auth')
// Authentication middleware


module.exports.signup = (req,res) => {
    const { name, email, password } = req.body;

    if(!name || !email || !password){
        res.status(400).json({msg: 'Please enter all fields'});
    }

    User.findOne({email})
    .then(user => {
        if(user) return res.status(400).json({msg: 'User already exists'});

        const newUser = new User({ name, email, password });

        // Create salt and hash
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                newUser.save()
                    .then(user => {
                        jwt.sign(
                            { id: user._id },
                            config.get('jwtsecret'),
                            { expiresIn: 3600 },
                            (err, token) => {
                                if(err) throw err;
                                res.json({
                                    token,
                                    user: {
                                        id: user._id,
                                        name: user.name,
                                        email: user.email
                                    }
                                });
                            }
                        )

                    });
            })
        })
    })
    .catch(err =>{
        console.log(err);
    });
}

// Login controller
module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Sign JWT token and set cookie
    const token = jwt.sign({ id: user._id }, config.get('jwtsecret'), { expiresIn: '1h' });
    res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });
    res.redirect('/admin/dashboard');
    
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
}

// Logout controller
module.exports.logout = (req, res) => {
  res.clearCookie('jwt');
//   res.json({ msg: 'Logged out' });
    // req.flash('Logged Out', 'You are successfully logged out')
  res.redirect('/');
}

// Get user controller
module.exports.get_user = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
}
