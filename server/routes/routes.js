const express = require("express");
const path = require('path');
const session = require('express-session');
const nodemailer=require('nodemailer');
const sha256 = require('sha256');
const crypto = require('crypto');
const { ObjectId } = require('mongodb');
// Define your token expiration duration (in milliseconds)
const TOKEN_EXPIRATION_DURATION = 3600000; // e.g. 1 hour





// The router will be added as a middleware and will take control of requests starting with path /record.
const appRouter = express.Router();
const resetTokens = new Map();
appRouter.use(express.json());
appRouter.use(session({secret: "Your secret key", resave: false, saveUninitialized: false}));

//var session;

const dbo = require("../database/conn");

//Serve static files from the "public" directory
appRouter.route('/').get(function (req, res) {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'public', 'index_home.html'));
});

// Serve static files from the "public" directory
// MAKE SURE THIS GOES UNDER THE '/' ROUTE
appRouter.use(express.static(path.join(__dirname, '..', '..', 'client', 'public')));


// POST route to handle search query from Form.js
appRouter.post('/api/query', async (req, res) => {
   console.log("Received request on /api/query");
   let db_connect = dbo.getDb();
   const { event, weapon, number } = req.body;
 
   // Construct a query object based on the supplied form data
   let query = {};
   if (event) query.event = event;
   if (weapon) query.weapon = weapon;
   if (number) query.numberToTrain = parseInt(number);

   console.log('Constructed query:', query); // Log the constructed query
 
   try {
     // Perform the search in the appropriate collection
     const results = await db_connect.collection("individualQualifications").find(query).toArray();
     console.log('Query results:', results); // Log the results

     // If the results are needed on the client side, send them back
     res.status(200).json(results);
   } catch (error) {
     // Handle errors that may occur during the search
     console.error('Error during database query:', error); // Log any errors
     res.status(500).json({ message: "Error retrieving training records", error: error.message });
   }
 });
 

appRouter.use('/app', express.static(path.join(__dirname, '..', '..', 'client', 'build')));


appRouter.get('/app/*', function (req, res) {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'));
});

appRouter.get("/api/tableData", async function (req, res) {
  let db_connect = dbo.getDb("ammoForecastTool");

  // ... your logic to construct the query from req.query
  // Initialize query object
  let query = {};

    // Check if eventType parameter is provided and use a regex to match the pattern
  if (req.query.eventType) {
    query.eventType = new RegExp(req.query.eventType, 'i'); // 'i' for case-insensitive
  }
  
    // Clean the query object to remove undefined or empty keys
  Object.keys(query).forEach(key => {
    if (query[key] === undefined || query[key] === '') {
      delete query[key];
    }
    });

  try {
    const results = await db_connect.collection("individualQualifications").find(query).toArray();
    res.json(results);
  } catch (error) {
    res.status(500).send({ message: "Error fetching data", error: error });
  }
});

appRouter.get("/table", function (req, res) {
  res.sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'));
});


// Route for user registration.
appRouter.get("/register", function (req, res) {
  res.sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'));
});

// Post for user registration function
appRouter.route("/register").post(async function (req, response) {
  try {
    // Validation for required fields
    const requiredFields = ['email', 'password', 'firstName', 'lastName', 'confirmPassword'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return response.status(400).send(`Missing or empty ${field} field!`);
      }
    }

    let db_connect = dbo.getDb();
    
    // Hash both the password and confirmPassword before comparing
    const hashedPassword = sha256(req.body.password);
    const hashedConfirmPassword = sha256(req.body.confirmPassword);
    
    
    let registrationDetails = {
      email: req.body.email,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    };

    // Check if the email is already registered
    const existingUser = await db_connect.collection("customers").findOne({ email: registrationDetails.email });

    if (existingUser) {
      response.status(409).send("Email is already registered!"); // Conflict
    } else {
      // Check if passwords match
    if (hashedPassword !== hashedConfirmPassword) {
      response.status(400).send("Passwords do not match!"); // Bad Request
    } else {
      // If the email is not registered and passwords match, proceed with registration
      await db_connect.collection("customers").insertOne(registrationDetails);
      response.send("Registration successful!");
    }
    }
  } catch (error) {
    console.error('Registration error:', error);
    response.status(500).send("Internal server error occurred while trying to register."); // Internal Server Error
  }
});



// Route for user to login.
appRouter.get("/login", function (req, res) {
  res.sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'));
});


// Post for login function
appRouter.route("/login").post(async function (req, response) {
  try {
    let db_connect = dbo.getDb();
    let loginCredentials = {
      email: req.body.email,
      password: sha256(req.body.password), // Hash the password
    };

    const user = await db_connect.collection("customers").findOne({ email: loginCredentials.email });

    if (user) {
      // Compare hashed passwords
      if (user.password === loginCredentials.password) {
        req.session.user = loginCredentials.email;

        // Send back a response including the user's ID
        response.json({ message: "logged in!", userId: user._id }); // Assuming _id is the MongoDB user ID field
      } else {
        response.status(401).send("Email or/and password is incorrect!"); // Unauthorized
      }
    } else {
      response.status(401).send("Email or/and password is incorrect!"); // Unauthorized
    }
  } catch (error) {
    console.error('Login error:', error);
    response.status(500).send("Internal server error occurred while trying to log in."); // Internal Server Error
  }
});



//rouute for reset password
// Serve React application for reset-password route
appRouter.get("/reset-password/:resetToken", (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'));
});

// Function to send the reset password email
async function sendResetPasswordEmail(email, resetToken) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ziyiwang919@gmail.com',
        pass: 'bxakuahuugsorjxg'
      }
    });

    resetTokens.set(email, { token: resetToken, expirationTime: Date.now() + TOKEN_EXPIRATION_DURATION });

    const mailOptions = {
      from: 'ziyiwang919@gmail.com',
      to: email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: http://localhost:5050/reset-password/${resetToken}`
    };
    
    const info = await transporter.sendMail(mailOptions);

    console.log(`Reset password email sent to ${email}. Message ID: ${info.messageId}`);
  } catch (error) {
    console.error('Error sending reset password email:', error.message);
    throw error;
  }
}

// Route for initiating password reset
appRouter.post("/reset-password", async (req, res) => {
  try {
    const db_connect = await dbo.getDb();
    const { email } = req.body;

    const user = await db_connect.collection("customers").findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpirationTime = Date.now() + TOKEN_EXPIRATION_DURATION;
    await sendResetPasswordEmail(email, resetToken);

    res.json({ message: "Reset password email sent successfully!" });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: "Error sending reset password email", error: error.message });
  }
});

// Route for handling password reset
appRouter.post("/reset-password/:resetToken", async (req, res) => {
  try {
    const db_connect = await dbo.getDb();
    const providedResetToken = req.params.resetToken;
    const newPassword = req.body.newPassword;
    const userEmail = req.body.email;

    const tokenInfo = resetTokens.get(userEmail);

    if (!tokenInfo || tokenInfo.token !== providedResetToken || tokenInfo.expirationTime < Date.now()) {
      return res.status(401).json({ message: "Invalid or expired reset token" });
    }

    const hashedNewPassword = sha256(newPassword);
    await db_connect.collection("customers").updateOne(
      { email: userEmail },
      { $set: { password: hashedNewPassword } }
    );

    resetTokens.delete(userEmail);

    res.json({ message: "Password reset successfully!" });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: "Error resetting password", error: error.message });
  }
});



// Route to save event data
appRouter.post('/saveEvent', async function (req, res) {
  try {
    let db_connect = await dbo.getDb(); // Ensure db_connect is properly initialized
    
    // Ensure that userId is included in the request body
    if (!req.body.userId) {
      return res.status(400).send("User ID is required");
    }

    let eventData = {
      eventName: req.body.eventName,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      location: req.body.location,
      additionalInfo: req.body.additionalInfo,
      tableData: req.body.tableData,
      numberToTrain: req.body.numberToTrain, // Add this line for numberToTrain
      eventType: req.body.eventType,      // Add this line for eventType
      weaponType: req.body.weaponType,    // Add this line for weaponType
      userId: req.body.userId // Include the userId in the eventData
    };

    // Save to MongoDB
    await db_connect.collection("eventsCollection").insertOne(eventData);
    res.send("Event saved successfully!");

  } catch (error) {
    console.error('Error saving event:', error);
    res.status(500).send("Internal server error occurred while trying to save the event.");
  }
});


appRouter.get("/saveEvent", function (req, res) {
  res.sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'));
});

//sending email from contact form
appRouter.post('/send-email', (req, res) => {
   let transporter = nodemailer.createTransport({
     service:'gmail',
     auth:{
      user:'jessica.ts.weng@gmail.com',
      pass:'uenrocernzqhyveg'
     } 
   });


   let mailOptions = {
     from: req.body.email,
     to: 'jessica.ts.weng@gmail.com',
     subject: `New Contact Message from ${req.body.name} | Ammo Forecast Tool`,
     text: `Name: ${req.body.name}\n\nEmail: ${req.body.email}\n\nMessage: ${req.body.message}`
   };

   transporter.sendMail(mailOptions, (error, info) => {
     if (error) {
       res.status(500).send({ error: "Error occurred while trying to send email" });
     } else {
       res.send({ success: "Email sent successfully" });
     }
   });
});
  

// Route for user to faq.
appRouter.get("/faq", function (req, res) {
  res.sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'));
});

// Route for user to myevents.
appRouter.get("/myevents", async function (req, res) {
  let db_connect = dbo.getDb();
  
  const userId = req.query.userId; // Use req.query to get the userId from URL parameters

  if (!userId) {
    return res.status(400).send("User ID is required");
  }

  // Construct a query object based on the supplied form data
  let query = { userId };

  // Fetch the events from the database using the constructed query
  try {
    const results = await db_connect.collection("eventsCollection")
      .find(query)
      .toArray();
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error: error });
    console.log(error);
  }
});

// Route to delete an event by ID.
appRouter.delete("/myevents/:eventId", async function (req, res) {
  let db_connect = dbo.getDb();
  const eventId = req.params.eventId;

  if (!eventId) {
    return res.status(400).send("Event ID is required");
  }

  try {
    const result = await db_connect
      .collection("eventsCollection")
      .deleteOne({ _id: new ObjectId(eventId) });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Event deleted successfully" });
    } else {
      console.log(result);
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting event", error: error });
  }
});

// Logout route
appRouter.get('/logout', (req, res) => {
  if (req.session) {
    // Optionally clear the cookie if your app uses it
    // Do this before destroying the session
    if (req.session.cookie) {
      res.clearCookie('connect.sid'); // Adjust 'connect.sid' based on your cookie name
    }

    // Destroy the session
    req.session.destroy(err => {
      if (err) {
        // Handle the error case
        console.error('Session destruction error:', err);
        res.status(500).json({ message: "Error logging out", error: err });
      } else {
        res.json({ message: 'Logged out successfully.' });
      }
    });
  } else {
    // No session to destroy
    res.status(200).json({ message: 'No active session.' });
  }
});


module.exports = appRouter;


