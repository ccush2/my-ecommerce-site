const jsonServer = require("json-server");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const server = jsonServer.create();
const router = jsonServer.router("./db.json");
const middlewares = jsonServer.defaults();

const SECRET_KEY = "Th1s1sAS3cr3tK3yF0rS1gn1ngJWTs";
const PORT = 3001;

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(
    "Received login request with username:",
    username,
    "and password:",
    password
  );

  const db = router.db;
  const user = db
    .get("users")
    .find((user) => user.username === username)
    .value();

  if (!user) {
    console.log("User not found");
    return res.status(401).json({ error: "Invalid username or password" });
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      console.error("Error during password comparison:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (!result) {
      console.log("Password comparison failed");
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ username: user.username }, SECRET_KEY);
    console.log("Login successful, sending token:", token);
    res.json({ token });
  });
});

server.post("/signup", (req, res) => {
  const { email, username, password, firstname, lastname } = req.body;
  const db = router.db;
  const existingUser = db
    .get("users")
    .find((user) => user.username === username || user.email === email)
    .value();

  if (existingUser) {
    console.log("Username or email already exists");
    return res.status(400).json({ error: "Username or email already exists" });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error during password hashing:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      username,
      password: hashedPassword,
      name: {
        firstname,
        lastname,
      },
    };

    db.get("users").push(newUser).write();
    console.log("New user created:", newUser);
    res.status(201).json({ message: "User created successfully" });
  });
});

server.use(router);

server.listen(PORT, () => {
  console.log(`Mock server is running on port ${PORT}`);
});
