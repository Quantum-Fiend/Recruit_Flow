import 'dotenv/config';
console.log('Current Directory:',process.cwd());
console.log('DATABASE_URL:',process.env.DATABASE_URL ? 'Defined (Starts with ' + process.env.DATABASE_URL.substring(0,15) + '...)' : 'Undefined');
