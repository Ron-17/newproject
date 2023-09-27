const exp = require('express')
const ejs = require('ejs')
const path = require('path')
const mngs = require('mongoose')
const url = 'mongodb://localhost:27017/portfolioentries'
const app = exp()
const bcrypt= require('bcryptjs')
var nodemailer = require('nodemailer');
const jwt=require("jsonwebtoken")
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '',/*give the mail id here*/
    pass: ''/*give the password here*/
  }
});
const cust = require('./models/customerData')
mngs.connect(url,{useNewUrlParser:true,useUnifiedTopology:true})
.then(() => app.listen(3000,()=>{
    console.log("Server running 3000")
}))
.catch((err) => {
    console.log(err);
})
app.use(exp.static(path.join(__dirname,'public')))
app.set('view engine','ejs')
app.set('views', path.join(__dirname, '/public/views'))
app.use(exp.urlencoded({extended:true}))
app.get('/',(req,res,next)=>{
    return res.render('ind')
})
app.get('/login',(req,res,next)=>{
  return res.render('loginnew');
})
/*app.get('/menu',(req,res,next) => {
    return res.render('menu.ejs')
})
app.get('/booking',(req,res,next) => {
    return res.render('booking.ejs');
})*/
app.post('/fetch',async (req,res,next) => {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  phoneReg = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if(!emailRegex.test(req.body.email)){
    res.send("<h1>Invalid Email ...try again</h1>")
  }
 /* else if(!phoneReg.test(req.body.phone)){
    res.send("<h1>Invalid phone number...try again</h1>")
  }*/
  else{
    const c1 = new cust({
        name:req.body.name,
        email:req.body.email,
        message:req.body.message,
    })
    const token=await c1.generateauth()
    console.log(token)
    res.send("<h1>Booking Successfull<\h1>")
  }
   /* c1.save()
    .then((result) => {
        res.send("<h1>Booking Successfull<\h1>")
        var mailOptions = {
            from: '',/*give the mail id here
            to: req.body.email,
            subject: 'Booking Successful',
            text: `Hi ${req.body.name},
            thanks for your booking. We will surely get back to you.`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
          
    })
    .catch((err) => {
        console.log(err);
    })
  }*/
})
app.post('/login', async (req, res,next)=> {
  try{
    const name = req.body.name;
    const useremail = await cust.findOne({ name:name });
    console.log(useremail);
    const ismatch=await bcrypt.compare(req.body.email,useremail.email);
    console.log(ismatch)
   /* const token=await useremail.generateauth()
    console.log(token)*/
      if(ismatch){
        return res.render('ind');
        console.log("success");
      }
      else{
       res.send("Invalid");
      }
    }
     /* bcrypt.compareSync(emailn, useremail.email, function(err, res) {
        if(emailn!= useremail.email){
          return res.json({success: false, message: 'passwords do not match'});
        } else {
          // Send JWT
          return res.send("Successful");
        }
      });
      
  }*/
  catch(error)
  {
    res.send(error);
  }

  });
  