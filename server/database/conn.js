const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.ATLAS_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
var dataBase;

module.exports = {
  connectToServer: async function () {
    client.connect();

    // Send a ping to confirm a successful connection
    client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    dataBase = client.db("ammoForecastTool");

    /*
    // Create collection for individual qualifications
    const individualQualifications = [
      { eventType: 'M4 Day', ammoType: '5.56 Ball', data: { TIV: 45, TV: 40, TVI: 40, Total: 125 } },
      { eventType: 'M4 Night_CBRN', ammoType: '5.56 Ball', data: { Day_CBRN: 10, Night: 10, Night_CBRN: 5, Total: 25} },
      { eventType: 'M4 Night_CBRN', ammoType: '5.56 Tracer', data: { Day_CBRN: 0, Night: 10, Night_CBRN: 5, Total: 15} },
      { eventType: 'M249 Day', ammoType: '5.56 Ball', data: { TIV: 30, TV: 50, TVI: 0, Total: 85 } },
      { eventType: 'M249 Day', ammoType: '5.56 Link', data: { TIV: 0, TV: 150, TVI: 200, Total: 350 } },
      { eventType: 'M249 Night & CBRN', ammoType: '5.56 Link', data: { Day_CBRN: 50, Night: 0, Night_CBRN: 0, Total: 50} },
      { eventType: 'M249 Night & CBRN', ammoType: '5.56 Link-Tracer', data: { Day_CBRN: 0, Night: 100, Night_CBRN: 50, Total: 150} },
      { eventType: 'M17 Day', ammoType: '9MM', data: { TIV: 20, TV: 30, TVI: 30, Total: 80 } },
      { eventType: 'M17 Night_CBRN', ammoType: '9MM', data: { Day_CBRN: 7, Night: 5, Night_CBRN: 0, Total: 12} },
      { eventType: 'M110', ammoType: '7.62MM M118LR', data: { TIV: 91, TV: 42, TVI: 42, Total: 175 } },
      { eventType: 'M2010', ammoType: '.300 Win Mag MK248', data: { TIV: 71, TV: 42, TVI: 42, Total: 155 } },
      { eventType: 'M107', ammoType: '.50CAL Ball M2/M33', data: { TIV: 71, TV: 42, TVI: 42, Total: 155 } }
    ];
    
    //create a collection called individualQualifications and add all individualQualifications documents to collection
    dataBase.collection("individualQualifications").insertMany(individualQualifications);
*/

    /*

    // Create collection for saved training events
    const savedEvents = [
      { userID: 1, eventName: 'M4 Qualification', date: Date('2024-01-01'), data: 'Tableview1' },
      { userID: 1, eventName: 'M4 Qualification', date: Date('2024-01-02'), data: 'Tableview2' },
      { userID: 1, eventName: 'M4 Qualification', date: Date('2024-01-03'), data: 'Tableview3' },
      { userID: 1, eventName: 'M4 Qualification', date: Date('2024-01-04'), data: 'Tableview4' },
      { userID: 1, eventName: 'M4 Qualification', date: Date('2024-01-05'), data: 'Tableview5' }
    ];
    //create a collection called products and add all individualQualifications documents to collection
    dataBase.collection("savedEvents").insertMany(savedEvents);


    // Create collection for users
    const users = [
      { userID: 1, firstName: 'Albert', lastName: 'Joe', email: 'albertjoe@utexas.edu' },
      { userID: 2, firstName: 'first1', lastName: 'last1', email: 'email1' },
      { userID: 3, firstName: 'first2', lastName: 'last2', email: 'email2' },
      { userID: 4, firstName: 'first3', lastName: 'last3', email: 'email3' },
      { userID: 5, firstName: 'first4', lastName: 'last4', email: 'email4' },
      { userID: 6, firstName: 'first5', lastName: 'last5', email: 'email5' }
    ];
    //create a collection called products and add all individualQualifications documents to collection
    dataBase.collection("users").insertMany(users);

*/

    // select all documents in collection
    //const savedEvents= await dataBase.collection("savedEvents").find().toArray();
    //show results
    //console.log(savedEvents);

    // find user with email "albertjoe@utexas.edu"
    //const find_1 = await dataBase.collection("users").find({ email: "albertjoe@utexas.edu" }).toArray();
    //console.log(find_1);

    //delete user with email "email5"
    //dataBase.collection("users").deleteOne({ email: "email5" });
    // now show it is deleted
    //const users= await dataBase.collection("users").find().toArray();
    //show results
    //console.log(users);
  },

  getDb: function () {
    return dataBase;
  },
};
//run().catch(console.error);
