import mongoose from 'mongoose';

const connectionString = `mongodb://127.0.0.1:27017/${process.env.MONGO_DATABASE}?compressors=zlib&gssapiServiceName=mongodby`;
const connectedDB = async () => {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    });
    console.log('Persistence Server: Running mongodb-org-server at port 27017');
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

export default connectedDB;