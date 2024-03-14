import express from "express";
import bodyParser  from "body-parser";

const app = express();
const port = 3000;
const userData = [{ }];

let keyData = false;
let keyToCompare = false;
let currentEmail = "";

app.use(express.static("public"), bodyParser.urlencoded( { extended: true } ));

app.get("/", (req, res) => {
    if (keyToCompare) {
        searchUserEmail(req, res);
    } else {
        res.render("index.ejs", { message: keyToCompare });
    }
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.get("/signup", (req, res) => {
    res.render("signup.ejs");
});

app.get("/post", (req, res) => {
    res.render("post.ejs")
});


app.get("/logout", (req, res) => {
    keyData = false;
    keyToCompare = false;
    res.render("index.ejs", { message: keyToCompare });
});

app.post('/eliminar', (req, res) => {
    for (let i = 0; i < userData.length; i++) {
        const element = userData[i];
        if (element.email === currentEmail) {
            const indice = req.body.indice;
            element.createPosts.splice(indice, 1);
            //res.redirect("/");
            res.render("index.ejs", { message: keyToCompare, user: element.user, items: element.createPosts });
            break;
        }
    }
});

app.post("/check_post", (req, res) => {
    if (req.body.comments !== '') {
        for (let i = 0; i < userData.length; i++) {
            const element = userData[i];
            if (element.email === currentEmail) {
                element.createPosts.push( `${req.body["comments"]}` );
                res.render("index.ejs", { message: keyToCompare, user: element.user, items: element.createPosts });
                break;
            }
        }
    } else {
        res.redirect("/");
    } 
});

function searchUserEmail(req, res, next) {
    for (let i = 0; i < userData.length; i++) {
        const element = userData[i];
        if (element.email === currentEmail) {
            res.render("index.ejs", { message: keyToCompare, user: element.user, items: element.createPosts });
            break;
        }
    }
}

app.post("/check_signup", (req, res) => {
    if (req.body["password"] === req.body["cPassword"]) {
        for (let i = 0; i < userData.length; i++) {
            const element = userData[i];
            if (element["email"] === req.body["email"]) {
                res.render("signup.ejs", { message: "User is already used" });
                break;
            }
        }
        if (keyData === false) {
            keyData = true;
            keyToCompare = true;
            currentEmail = req.body["email"];
            userData.push({ user: req.body["user"], email: req.body["email"], password: req.body["password"], createPosts: [""] });
            searchUserEmail(req, res);
        }
    } else {
        res.render("signup.ejs", { message: "Password is not the same" } );
    }
});

app.post("/check_login", (req, res) => {
    for (let i = 0; i < userData.length; i++) {
        const element = userData[i];
        if (element["email"] === req.body["email"] && element["password"] === req.body["password"]) {
            keyToCompare = true;
            break;
        }
    }
    if (keyToCompare === true) {
        searchUserEmail(req, res);
    } else {
        res.render("login.ejs", { message: "Incorrect user or password" });
    }
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});