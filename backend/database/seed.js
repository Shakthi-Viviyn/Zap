import supabase from './client.js';
import { faker } from '@faker-js/faker';


const walletAmounts = [0.1, 0.25, 0.5, 1, 2, 4, 5, 10, 20, 50];

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateWallets = (userId) => {
  const walletCount = getRandomInt(5, 10); // Generate between 5 and 10 wallets per user
  const wallets = [];

  for (let i = 0; i < walletCount; i++) {
    const privateKey = `${faker.datatype.uuid()}-${currentDatetime}`;
    const publicKey = `${faker.datatype.uuid()}-${currentDatetime}`;
    const amount = walletAmounts[getRandomInt(0, walletAmounts.length - 1)];

    wallets.push({
      user_id: userId,
      private_key: privateKey,
      public_key: publicKey,
      amount: amount
    });
  }

  return wallets;
};


const generateUserData = () => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const username = faker.internet.userName();
  const email = faker.internet.email();
  const password = faker.internet.password();

  return {
    first_name: firstName,
    last_name: lastName,
    username: username,
    email: email,
    password: password
  };
};


const seedDatabase = async () => {
  // Generate users and their wallets
  for (let i = 0; i < 10; i++) {
    const userData = generateUserData();

    // Insert the user into the `users` table
    const { data: userDataResponse, error: userError } = await supabase
      .from('users')
      .insert([userData])
      .select('id'); // We select 'id' so we can use it to insert wallets

    if (userError) {
      console.error('Error inserting user:', userError.message);
      continue;
    }

    const userId = userDataResponse[0].id;

    // Generate wallets for the user
    const wallets = generateWallets(userId);

    // Insert wallets into the `wallets` table
    const { data: walletDataResponse, error: walletError } = await supabase
      .from('wallets')
      .insert(wallets);

    if (walletError) {
      console.error('Error inserting wallets:', walletError.message);
      continue;
    }

    console.log(`User ${userData.username} and their wallets have been added.`);
  }
};


seedDatabase()
  .then(() => console.log('Database seeding complete!'))
  .catch((err) => console.error('Error during seeding:', err));
