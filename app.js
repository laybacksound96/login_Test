const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const User = require("./models/user");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => done(null, user));
});

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      scope: ["identify", "guilds"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOneAndUpdate(
          { discordId: profile.id },
          {
            discordTag: `${profile.username}#${profile.discriminator}`,
            guilds: profile.guilds,
          },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        return done(null, user);
      } catch (err) {
        console.log(err);
        return done(err, null);
      }
    }
  )
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 60000 * 60 * 24 },
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

// 라우팅 추가
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
