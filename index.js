const express = require("express")
const app = express();
app.use(express.json())

const cors = require("cors")
app.use(cors({  
    origin: "*"   
})) 

const mongodb = require("mongodb") 
const mongoClient = mongodb.MongoClient;
const URL="mongodb+srv://admin:admin123@cluster0.hijj3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

//form list get
app.get("/users", async function (req, res) {
 
    try {
        let connection = await mongoClient.connect(URL)
        let db = connection.db("form")
        let users = await db.collection("data").find({}).toArray();
        await connection.close();
        res.json(users)

    } catch (error) {
        console.log(error)
    }

    // res.json(usersList) 
})

// form edit page

app.get("/user/:id", async function (req, res) {


    try {
        let connection = await mongoClient.connect(URL)
        let db = connection.db("form")
        let objId = mongodb.ObjectId(req.params.id)
        let user = await db.collection("data").findOne({ _id: objId });
        await connection.close(); 

        if (user) {
            res.json(user)
        }
        else {
            res.status(401).json({ message: "User Not Found" })
        }
    } catch (error) {
        res.status(500).json({ message: "Message Went Wrong" })
    }
})


//form post user creat

app.post("/create-form", async function (req, res) {

    try {
        //connect to the Database   
        let connection = await mongoClient.connect(URL)
 
        //select DB
        let db = connection.db("form") 

        //select collection
        //do any operation
        await db.collection("data").insertOne(req.body)

        //close the connection
        connection.close(); 

        res.json({ message: "User Added" })
    } catch (error) {
        console.log(error) 
    }
})

 
//form  user edit 
app.put("/user/:id", async function (req, res) {

    try {
        let connection = await mongoClient.connect(URL)
        let db = connection.db("form")
        let objId = mongodb.ObjectId(req.params.id)
        await db.collection("data").findOneAndUpdate({ _id: objId }, { $set: req.body })
        //await db.collection("users").updateMany({gender:"female" },{$set:{grade:"A"}}) - this line is saying for who is female that one add for "A" grade.

        await connection.close();
        res.json({ message: "User updated " })

    } catch (error) {
        console.log(error) 
    }
})


//form  delete
app.delete("/user/:id", async function (req, res) {

    try { 
        let connection = await mongoClient.connect(URL)
        let db = connection.db("form")
        let objId = mongodb.ObjectId(req.params.id)
        await db.collection("data").deleteOne({ _id: objId })
        await connection.close();
        res.json({ message: "User Delected" })

    } catch (error) {
        console.log(error)
    }

})

app.listen(process.env.PORT || 3001) 

