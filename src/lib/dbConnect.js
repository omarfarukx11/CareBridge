const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.DB_URL;
const dbname = process.env.DB_NAME;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}


const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 10, 
  minPoolSize: 5,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

/**

 * @param {string} cname 
 */
export const dbConnect = async (cname) => {
  try {
    const connectedClient = await clientPromise;
    const db = connectedClient.db(dbname);
    return db.collection(cname);
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    throw new Error("Failed to connect to database");
  }
};