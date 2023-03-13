let express = require("express");

let bcrypt = require("bcrypt");
let path = require("path");
let { open } = require("sqlite");
let sqlite3 = require("sqlite3");

let app = express();
const cors = require("cors");
app.use(
  cors({
    origin: "https://quiet-tartufo-53b672.netlify.app",
  })
);
app.use(express.json());

let dbPath = path.join(__dirname, "studentMaster.db");
let db = null;

let initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3005, () => {
      console.log("The Server is running at http://localhost:3005/");
    });
  } catch (e) {
    console.log(`The Error is : ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

//API 1

app.post("/register", async (request, response) => {
  try {
    let { name, email, password, mobile, isStudent } = request.body;
    let hashedPassword = await bcrypt.hash(request.body.password, 10);

    let getUserQuery = `
    SELECT 
        * 
    FROM 
        studentMaster 
    WHERE 
        email='${email}';
    `;

    let userDetails = await db.get(getUserQuery);

    if (userDetails !== undefined) {
      response.status(400);
      response.send("User already exists");
    } else {
      if (password.length < 5) {
        response.status("400");
        response.send("Password is too short");
      } else {
        let hashedPassword = await bcrypt.hash(password, 10);
        let createUserQuery = `
                INSERT INTO 
                    studentMaster(name,email,password,mobile,isStudent) 
                     
                VALUES (
                    "${name}","${email}","${hashedPassword}","${mobile}","${isStudent}"
                );
                `;

        await db.run(createUserQuery);
        response.status(200);
        response.send("User created successfully");
      }
    }
  } catch (e) {
    console.log(`The Error is : ${e.message}`);
    process.exit(1);
  }
});

// API 2

app.post("/login", async (request, response) => {
  try {
    let { email, password } = request.body;
    let getUserQuery = `
        SELECT 
            * 
        FROM 
            studentMaster 
        WHERE 
            email='${email}';
        `;

    let dbUser = await db.get(getUserQuery);

    if (dbUser === undefined) {
      response.status(400);
      response.json({ err: "Invalid user" });
    } else {
      let isPasswordCorrect = await bcrypt.compare(password, dbUser.password);
      if (isPasswordCorrect) {
        response.status(200);
        response.send({ name: dbUser.name, isStudent: dbUser.isStudent });
      } else {
        response.status(400);
        response.json({ err: "Invalid password" });
      }
    }
  } catch (e) {
    console.log(`The Error is : ${e.message}`);
    process.exit(1);
  }
});

//API 5

app.get("/allusers", async (request, response) => {
  try {
    const getUserQuery = `
    SELECT 
        * 
    FROM 
        studentMaster 
    `;

    let userDetails = await db.all(getUserQuery);
    response.send(userDetails);
  } catch (e) {
    console.log(`The Error is : ${e.message}`);
    process.exit(1);
  }
});

//API 7

app.get("/allopera", async (request, response) => {
  try {
    const getUserQuery = `
    SELECT 
        * 
    FROM 
        operations 
    `;

    let alloperations = await db.all(getUserQuery);
    response.send(alloperations);
  } catch (e) {
    console.log(`The Error is : ${e.message}`);
    process.exit(1);
  }
});

// API 4

app.get("/:email", async (request, response) => {
  try {
    let { email } = request.params;

    let getUserQuery = `
    SELECT
        *
    FROM
        studentMaster
    WHERE
        email='${email}';
    `;

    let userDetails = await db.get(getUserQuery);
    if (userDetails) {
      response.send({
        email: userDetails.email,
        name: userDetails.name,
        isStudent: userDetails.isStudent,
      });
    } else {
      response.send("No Such User Exists");
    }
  } catch (e) {
    console.log(`The Error is : ${e.message}`);
    process.exit(1);
  }
});

//API 6 operation

app.post("/updateoperations", async (request, response) => {
  try {
    let { email, operation } = request.body;
    let createUserQuery = `
                INSERT INTO 
                    operations(email,operation) 
                     
                VALUES (
                    "${email}","${operation}"
                );
                `;

    await db.run(createUserQuery);
    response.status(200);
    response.send("Operation created successfully");
  } catch (e) {
    console.log(`The Error is : ${e.message}`);
    process.exit(1);
  }
});

//API 9

app.get("/operations/:email/", async (request, response) => {
  try {
    let { email } = request.params;

    let getUserQuery = `
    SELECT
        *
    FROM
        operations
    WHERE
        email='${email}';
    `;

    let userDetails = await db.all(getUserQuery);
    if (userDetails) {
      response.send(userDetails);
    } else {
      response.send("No Such operations by the given User Exists");
    }
  } catch (e) {
    console.log(`The Error is : ${e.message}`);
    process.exit(1);
  }
});

module.exports = app;
