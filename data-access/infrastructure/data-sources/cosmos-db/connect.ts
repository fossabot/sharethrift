import mongoose from 'mongoose';

async function connect() {
    mongoose.connection.on('open', () => {
        console.log('open');
    });
    
    mongoose.connection.on('close', () => {
        console.log('close');
    });
    
    mongoose.connection.on('disconnected', () => {
        console.log('disconnected');
    });
    
    mongoose.connection.on('connected', () => {
        console.log('connected');
    });
    
    mongoose.connection.on('connecting', () => {
        console.log('connecting');
    });
    
    mongoose.connection.on('reconnected', () => {
        console.log('reconnected');
    });
    
    mongoose.connection.on('error', (err) => {
        console.error('error', err);
    });
    
    mongoose.connection.on('fullsetup', () => {
        console.log('fullsetup');
    });
    
    mongoose.connection.on('all', () => {
        console.log('all');
    });
    
    mongoose.connection.on('reconnectFailed', (err) => {
        console.error('reconnectFailed', err);
    });
    /*
    setInterval(() => {
        console.log(mongoose.connection.readyState)
    }, 2000);
    */

    //mongoose.set('useCreateIndex', true); //Prevents deprecation warning
    if(!process.env.COSMOSDB || process.env.COSMOSDB.length === 0) throw new Error("CosmosDB connection string not found.");
    if(!process.env.COSMOSDB_DBNAME || process.env.COSMOSDB_DBNAME.length === 0) throw new Error("CosmosDB name not found.");
    try {
        await mongoose.connect(`${process.env.COSMOSDB}&retrywrites=false`, {
          //  useNewUrlParser: true, 
          //  useUnifiedTopology: true,
          //  useFindAndModify: false,
            useUnifiedTopology: true,
            tlsInsecure: process.env.NODE_ENV === "development", //only true for local developent - required for Azure Cosmos DB emulator
            dbName: process.env.COSMOSDB_DBNAME,
            keepAlive: true, 
            keepAliveInitialDelay: 300000
         //   poolSize: Number(process.env.COSMOSDB_POOL_SIZE)
        } as mongoose.ConnectOptions).then(() => console.log(`🗄️ Successfully connected Mongoose to ${mongoose.connection.name} 🗄️`));

        if(process.env.NODE_ENV === "development"){
            mongoose.set('debug', {shell: true});
        }
    } catch (error) {
        console.log(`🔥 An error ocurred when trying to connect Mongoose with ${mongoose.connection.name} 🔥`)
        throw error;
    }







}

export default connect;