import { createClient, print } from 'redis';
import { promisify } from 'util';

const client = createClient();

client.on('connect', () => {
  console.log('Redis client connected to the server');
}).on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err}`);
});

const setNewSchool = (schoolName, value) => {
  client.set(schoolName, value, print);
};

const getAsync = promisify(client.get).bind(client);

const displaySchoolValue = async (schoolName) => {
  try {
    const reply = await getAsync(schoolName);
    console.log(reply);
  } catch (error) {
    console.log(error);
  }
};

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
