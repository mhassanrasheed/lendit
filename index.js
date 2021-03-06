const express = require("express");
const session = require("express-session");
// const multer = require("multer");
// const path = require("path");
const bcrypt = require("bcrypt");
const db = require("./config/database");
const user = require("./routes/users");
const post = require("./routes/posts");
var path = require("path");
// require('./public/uploads/')
// const { Sequelize } = require("sequelize/types");

var SequelizeStore = require("connect-session-sequelize")(session.Store);
// const PostImage = require("./models/postimage");
const User = require("./models/user");

// app init
const app = express();
var sessionStore = new SequelizeStore({ db: db });
const IN_PROD = process.env.NODE_ENV === "development";
app.use(
	session({
		name: process.env.SESS_NAME,
		resave: false,
		saveUninitialized: false,
		secret: process.env.SESSION_SECRET,
		store: sessionStore,
		cookie: {
			maxAge: parseInt(process.env.SESSION_LIFETIME),
			sameSite: true,
			secure: true,
		},
	})
);

sessionStore.sync();
app.use(express.urlencoded({ extended: false }));

const isAuth = (req, res, next) => {
	console.log("hola amigo");
	if (req.session.isAuth) {
		console.log("object");
		next();
	} else {
		res.send("log In first");
	}
};

db.authenticate()
	.then(() => console.log("Connected to Database"))
	.catch((err) => console.log(err));

console.log(__dirname);
let file = "image-1628557637324.jpg";
console.log(__dirname + `./public/uploads/${file}`);
console.log(path.join("./public/uploads/", file));

app.use("/user", user);
app.use("/post", post);
app.use("/postImages", express.static(__dirname + "/public/uploads"));
app.get("/fetchImage/:file(*)", (req, res) => {
	let file = req.params.file;
	console.log(__dirname + `public/uploads/${file}`);
	let fileLocation = path.join("./public/uploads/", file);
	res.send({ image: fileLocation });
	// res.sendFile(__dirname + `\public\uploads\${file}`);
});
app.use(express.json);
// app.use(express.static(__dirname + "public"));
// app.use(express.static(__dirname + "public"));
// app.use("/static", express.static(__dirname + "/public"));
// app.use(express.static("./public"));
// app.use(express.static(path.resolve("./public")));
// app.use(express.static("public"));
// app.use("/images", express.static(__dirname + "/uploads"));

app.get("/", (req, res) => {
	res.send("index");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`listening on ${port}`);
});

// PostImage.create({
// 	Image: require("/Users/mhass/Programming/lenditApp/src/images/example.png"),
// 	postId: 9,
// })
// 	.then((msg) => {
// 		console.log(msg);
// 	})
// 	.catch((err) => {
// 		console.log("errr is:  ", err);
// 	});

// app.post("/login", async (req, res) => {
// 	try {
// 		const user = await User.findOne({ where: { email: req.body.email } });
// 		if (user === null) {
// 			console.log("user", user);
// 			res.send("no user found");
// 		} else if (await bcrypt.compare(req.body.password, user.password)) {
// 			// console.log("user", user);
// 			// req.session.userId = user.id;
// 			res.send(user);
// 		} else {
// 			res.send("The password you entered is incorrect");
// 		}
// 	} catch (error) {
// 		res.send(error);
// 	}
// });
