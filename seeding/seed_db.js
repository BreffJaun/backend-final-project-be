// I M P O R T:  E X T E R N A L  D E P E N D E N C I E S
import * as dotenv from "dotenv"; dotenv.config();
import mongoose from "mongoose";
import {faker} from "@faker-js/faker";

// I M P O R T:  M O D E L
import UserModel from "../models/userModel.js";
import CoffeeShopModel from "../models/coffeeshopsModel.js";

// C O N N E C T   W I T H   M O N G O O S E  D B
const MONGO_DB_CONNECTION_STRING = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority` || "mongodb://localhost:27017"

mongoose.set("strictQuery", false); // to prevent an erroneous error message
mongoose.connect(MONGO_DB_CONNECTION_STRING, 
{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connect with MongoDB: SUCCESS ✅'))
.catch((err) => console.log('Connect with MongoDB: FAILED ⛔', err))
// for errors which comes after the successfully connection
mongoose.connection.on('error', console.log);

// S E E D I N G   P R O C E S S
seed()

async function seed() {
  try {
    // CREATE FAKE USER DATA START //
    const fakeUserData= []
    for(let i = 0; i < 50; i++) {
      fakeUserData.push({
        userName: faker.name.firstName(),
        city: faker.address.cityName(),
        email: faker.internet.exampleEmail(),
        password: faker.internet.password(),
        avatar: bla
      })
    }
    const userPromise = UserModel.insertMany(fakeUserData);
    // CREATE FAKE USER DATA END //
          
    // CREATE FAKE SHOP DATA START //
    const fakeShopData= []
    for(let i = 0; i < 250; i++) {
      fakeShopData.push({
        name: faker.company.name(),
        img_url: faker.image.business(640, 640, false), // width, height, randomize
        location: {
          address: {
            street: faker.address.streetName(),
            number: faker.random.numeric(),
            zip: faker.address.zipCode(),
            city: faker.address.cityName(),
          },
          longitude: faker.address.longitude(54.7819, 47.4921, 4), //max, min, precision
          latitude: faker.address.latitude(14.9872, 6.0838, 4)
        },
        services: {
          has_sockets: faker.datatype.boolean(),
          has_wifi: faker.datatype.boolean(),
          has_toilet: faker.datatype.boolean(),
          can_take_calls: faker.datatype.boolean()
        },
        seats: faker.finance.amount(0, 30, 0), // min, max, decimal-num
        espresso_price: faker.finance.amount(1, 3, 2, "€", true), // min, max, decimal-num, toLocaleString 
        
      })
    }
    const shopPromise = CoffeeShopModel.insertMany(fakeShopData);
    const values = await Promise.all([
      userPromise,
      shopPromise
    ])
    console.log("Seeding complete", values);
  } catch (err) {
    console.log(err);
  } finally {
    mongoose.disconnect()
  }
}

// npm run seed
// to seed the db (fill it with fake data)

// min longitude 47.4921 / max longitude 54.7819
// min latitude 14.9872 / max latitude 6.0838
// Espresso 2.90 (Solingen)
// 