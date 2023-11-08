//to run file, in a terminal type "node mongoDB_conn.js" in folder where file is located

//import mongodb module
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://axj65:hookem@cluster0.hk0fply.mongodb.net/?retryWrites=true&w=majority"; //change uri to uri from mongoDB
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
    //connect to mongodb
   client.connect();

    // Send a ping to confirm a successful connection
    client.db("admin").command({ ping: 1 });   
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // if database does not exist, create a database called ammoForecastTool
    dataBase = client.db('ammoForecastTool');


    const users = [
    {image: "/images/denim_jacket.jpeg", title:"denim jacket", price:"$69.99"},
    {image:"/images/black_hat.jpeg", title:"black hat", price:"$25.99"}];

    //create a collection called products and add 2 documents to collection
    dataBase.collection("products").insertMany(productList);

    // select first document in collection products
    const product= await dataBase.collection("products").findOne();
    //show results
    console.log(product);
    
    // select all documents in collection products
    const products= await dataBase.collection("products").find().toArray();
    //show results
    console.log(products);
}
run().catch(console.error);