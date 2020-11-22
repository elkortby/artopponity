const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");

const User = require("../../models/User");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kortbyoussama',
    pass: 'Sonicx204@'
  }
});

router.post('/send', (req, res) => {

    let user = {
        _id: req.body._id,
        email: req.body.email
    }
    
    host = req.get('host');
    link = "http://" + req.get('host') + "/verify?id=" + user._id;
    
    mailOptions = {
        from: 'kortbyoussama@gmail.com',
        to : user.email,
        subject : "Vérifier votre adresse émail",
        html : "Bonjour,<br> Veuillez cliquer sur le lien pour vérifier votre email.<br><a href="+link+">Cliquez ici pour vérifier</a><br>Cordialement",
    }
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) res.status(400).json(error);
        else res.json('Email sent: ' + info.response)
    });
});

router.get('/', (req,res) => {
    if ((req.protocol + "://" + req.get('host') ) == ("http://" + req.get('host'))) {
        User.findOne({ _id: req.query.id }).then(user => {
            if (user) {
                user.isConfirmed = true;
                user.save().then( () => {
                    res.status(200).redirect('http://localhost:3000/login');
                })
            }
            else {
                res.status(400).end("<h1>Bad Request</h1>");
            }
        })    
    }
});

router.post('/ForgotPassword', (req, res) => {
    
    //validate email
    const errors = {}
    
    User.findOne({ email: req.body.email })
    .then((user) => {
        if (!user) {
            errors.email = "Email is invalid";
            res.status(400).json(errors);
        }    
        else {
                const random = (length = 8) => {
                    // Declare all characters
                    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    // Pick characers randomly
                    let str = '';
                    for (let i = 0; i < length; i++) {
                        str += chars.charAt(Math.floor(Math.random() * chars.length));
                    }
                    return str;
                };

                const tmp = random(14);
                
                // Hash password before saving in database
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(tmp, salt, (err, hash) => {
                    if (err) throw err;
                    user.password = hash;
                    user
                        .save()
                        .then(() => {
                            link = "https://branchiny.com/"
                            mailOptions = {
                                from: 'kortbyoussama@gmail.com',
                                to : req.body.email,
                                subject : "Mot de pass oublié",
                                html : "Bonjour,<br> Votre mot de passe temporaire est <b>"+tmp+"</b>.<br>Veuillez changer votre mot de passe en moins de 24H. <br><a href="+link+"></a><br>Cordialement"
                            }
                        
                            transporter.sendMail(mailOptions, function(error, info){
                                if (error) res.status(400).json(error);
                                else {
                                    errors.email = "Un mot de passe temporaire a été envoyé à votre email, Veuillez changer votre mot de passe en moins de 24H.";
                                    res.status(400).json(errors);
                                }    
                            });
                        })
                        .catch(err => console.log(err));
                    });
                });
            }
        })
    .catch((err) => console.log(err))  
});

module.exports = router;