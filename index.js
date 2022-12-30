const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://task-manager:1lIote7ibzkiKFsQ@cluster0.cgb6icj.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const taskCollection = client.db("taskDatabase").collection("tasks");

    app.post("/tasks", async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      res.send(result);
    });

    app.get("/tasks",  async (req, res) => {
        const email = req.query.email; 
        const query = { email: email };
        const added = await taskCollection.find(query).toArray();
        res.send(added);
      });

      app.delete("/deleteTask/:id", async (req, res) => {
        const id = req.params.id;
        const filter={ _id: ObjectId(id)};
        const result = await taskCollection.deleteOne(filter);
        res.send(result);
      });


      app.put("/tasks/completed/:id",async( req, res )=>{
        const id=req.params.id;
        const filter={
          _id: ObjectId(id)
        }
        const options={upsert:true};
        const updateDoc = {
          $set: {
              confirm: true
          }
      }
      const result = await taskCollection.updateOne(filter, updateDoc, options);
            res.send(result)
            console.log(result)
      })


    //   app.put('/updateTask', async (req, res) => {
    //     const updateTask = req.body;
        
    //     const filter = {
    //         _id: ObjectId(updateTask.id)
    //     }
    //     const option = { upsert: false };
    //     const updateDoc = {
    //         $set: {
    //           title: updateTask.title,
    //             description: updateTask.description,
    //         }
    //     }
    //     console.log(updateDoc)
    //     const result = await taskCollection.updateOne(filter, updateDoc, option);
    //     console.log(result);
    //     res.send(result)
        
    // })
    

  } finally {
  }
}
run().catch(console.log);

app.get("/", (req, res) => {
  res.send("server Running");
});

app.listen(port, () => {
  console.log(`Simple server running on port ${port}`);
});
