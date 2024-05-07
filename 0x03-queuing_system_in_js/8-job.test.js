/* eslint-env mocha */
const { expect } = require('chai');
const kue = require('kue');
const createPushNotificationsJobs = require('./8-job');

describe('createPushNotificationsJobs', () => {
  let queue;

  before(() => {
    // Create a new queue in test mode
    queue = kue.createQueue({ testMode: true });
  });

  afterEach(() => {
    // Clear the queue after each test
    queue.testMode.clear();
  });

  after(() => {
    // Exit the test mode and shut down the queue after all tests
    queue.testMode.exit();
    queue.shutdown();
  });

  it('should add a job to the queue', () => {
    // Call the createPushNotificationsJobs function
    createPushNotificationsJobs(queue);

    // Assert that a job has been added to the queue
    expect(queue.testMode.jobs.length).to.equal(1);
  });
});
