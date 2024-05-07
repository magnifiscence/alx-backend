const kue = require('kue');

const queue = kue.createQueue();

const blacklistedNumbers = [4153518780, 4153518781];

function sendNotification (phoneNumber, message, job, done) {
  if (blacklistedNumbers.includes(phoneNumber)) {
    const error = new Error(`Phone number ${phoneNumber} is blacklisted`);
    return done(error);
  }

  job.progress(50);

  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
  done();
}

queue.process('push_notification_code_2', 2, (job, done) => {
  job.progress(0);

  sendNotification(job.data.phoneNumber, job.data.message, job, done);
});

queue.on('error', (err) => {
  console.error('Queue error:', err);
});

console.log('Jobs processing started...');
