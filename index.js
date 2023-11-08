const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port =process.env.PORT||5000
const app = express()
app.use(express.json())
app.use(cors())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cd4t4do.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
   await client.connect();
   const blogCollection =client.db('AllBlogs').collection('allBlogs')
   const popularCollection =client.db('AllBlogs').collection('popularBlogs')
   const comments =client.db('AllBlogs').collection('comments')


 app.post('/comments',async(req,res)=>{
    const body =req.body 
    const result =await comments.insertOne(body)
    res.send(result)
     
   })





   app.get('/blogs',async(req,res)=>{
    const result=await blogCollection.find().toArray()
    res.send(result)
   })
   app.get('/blogs/:id',async(req,res)=>{
    const id=req.params.id
    const query ={_id:new ObjectId(id)}
    const result=await blogCollection.findOne(query)
    res.send(result)
   })
    app.get('/all/:category',async(req,res)=>{
     const category=req.params.category
     const query={category:category}
     const result=await blogCollection.find(query).toArray()
     res.send(result)
   
    })


   ///////////add blogs 
   app.post('/blogs',async(req,res)=>{
    const body =req.body 
    
     const result =await blogCollection.insertOne(body)
     res.send(result)
     
   })
 
 app.patch('/blogs/:id',async(req,res)=>{
   const id =req.params.id 
   const query ={_id:new ObjectId(id)}
 
   const option={upsert:true}
   const update=req.body
   const document ={
     $set:{
       title:update.title,
       image:update.image,
       short_description:update.short_description,
       category:update.category,
       full_description:update.full_description,
       author:update.author,
       date_published:update.date_published,
       source:update.source
     }
   }  
   const result =await blogCollection.updateOne(query ,document,option)
   res.send(result)
   
 })

 //db.collectionName..sort({ length: -1 }).limit(10)


   app.post('/popular',async(req,res)=>{
    const body =req.body 
    const result =await popularCollection.insertOne(body)
    res.send(result)
     
   })
  
   app.get('/popular',async(req,res)=>{
    const result=await popularCollection.find().toArray()
    res.send(result)
   })
   app.get('/blog',async(req,res)=>{
    const result=await blogCollection.find().sort({_id:-1}).limit(6).toArray()
    res.send(result)
   
   })

   
   app.get('/details',async(req,res)=>{
    // const result = await blogCollection.find({
    //   "full_description": { $exists: true },
    //   $expr: { $gt: [{ $strLenCP: "$full_description" }, 5] }
    //  }).sort({ length: -1 }).limit(5).toArray();
    const result =await blogCollection.find({"full_description":{$exists:true},
     $expr:{$gt:[{$strLenCP:"$full_description"},10]}}).sort({length:-1}).limit(10).toArray()
     res.send(result)
   
   })

 
   app.delete('/popular/:id',async(req,res)=>{
    const id=req.params.id
    const query ={_id:new ObjectId(id)}
    const result=await popularCollection.deleteOne(query)
    res.send(result)
   })


    
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
    //await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('I an trying to create my blog')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})