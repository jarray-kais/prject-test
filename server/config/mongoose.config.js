import { connect } from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
const MONGO_URI = process.env.MONGO_URI
async function dbconnect() {
    try {
        await connect(MONGO_URI , {
            dbName: 'projet',
        })
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export default dbconnect ;