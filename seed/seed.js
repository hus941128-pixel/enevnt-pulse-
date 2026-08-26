require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const connectDB = require('../src/config/db');

const User = require('../src/models/User');
const Category = require('../src/models/Category');
const Event = require('../src/models/Event');
const Registration = require('../src/models/Registration');
const Message = require('../src/models/Message');

const SALT_ROUNDS = 10;

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Event.deleteMany({}),
      Registration.deleteMany({}),
      Message.deleteMany({}),
    ]);

    console.log('Creating users...');
    const hashedPassword = await bcrypt.hash('password123', SALT_ROUNDS);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@eventpulse.com',
      password: hashedPassword,
      role: 'admin',
    });

    const attendee = await User.create({
      name: 'John Attendee',
      email: 'attendee@eventpulse.com',
      password: hashedPassword,
      role: 'attendee',
    });

    console.log('Creating categories...');
    const categories = await Category.insertMany([
      {
        name: 'Music',
        slug: 'music',
        description: 'Concerts, festivals, and live performances',
      },
      {
        name: 'Technology',
        slug: 'technology',
        description: 'Tech talks, hackathons, and developer meetups',
      },
      {
        name: 'Sports',
        slug: 'sports',
        description: 'Sports events, tournaments, and fitness activities',
      },
      {
        name: 'Business',
        slug: 'business',
        description: 'Networking, conferences, and workshops',
      },
      {
        name: 'Arts',
        slug: 'arts',
        description: 'Art exhibitions, theater, and cultural events',
      },
    ]);

    const [music, technology, sports, business, arts] = categories;

    console.log('Creating events...');
    const now = new Date();

    const events = await Event.insertMany([
      {
        title: 'Cairo Jazz Festival',
        description: 'An evening of live jazz music featuring local and international artists.',
        date: new Date(now.getFullYear(), now.getMonth() + 1, 15, 19, 0),
        location: { city: 'Cairo', address: 'Opera House, Zamalek' },
        capacity: 500,
        registeredCount: 1,
        category: music._id,
        organizer: admin._id,
        status: 'published',
      },
      {
        title: 'Node.js Developers Meetup',
        description: 'Monthly meetup for Node.js developers. Talks, networking, and pizza.',
        date: new Date(now.getFullYear(), now.getMonth() + 1, 20, 18, 0),
        location: { city: 'Cairo', address: 'Tech Hub, Maadi' },
        capacity: 100,
        registeredCount: 1,
        category: technology._id,
        organizer: admin._id,
        status: 'published',
      },
      {
        title: 'Alexandria Marathon 2026',
        description: 'Annual marathon along the Mediterranean coast.',
        date: new Date(now.getFullYear(), now.getMonth() + 2, 1, 6, 0),
        location: { city: 'Alexandria', address: 'Corniche Road' },
        capacity: 2000,
        registeredCount: 0,
        category: sports._id,
        organizer: admin._id,
        status: 'published',
      },
      {
        title: 'Startup Pitch Night',
        description: 'Watch startups pitch their ideas to investors.',
        date: new Date(now.getFullYear(), now.getMonth() + 1, 25, 17, 0),
        location: { city: 'Cairo', address: 'Greek Campus, Downtown' },
        capacity: 150,
        registeredCount: 0,
        category: business._id,
        organizer: admin._id,
        status: 'published',
      },
      {
        title: 'Modern Art Exhibition',
        description: 'Contemporary art from emerging Egyptian artists.',
        date: new Date(now.getFullYear(), now.getMonth() + 1, 10, 10, 0),
        location: { city: 'Giza', address: 'Art Gallery, Dokki' },
        capacity: 80,
        registeredCount: 0,
        category: arts._id,
        organizer: admin._id,
        status: 'published',
      },
      {
        title: 'React Workshop',
        description: 'Hands-on workshop covering React hooks and best practices.',
        date: new Date(now.getFullYear(), now.getMonth() + 2, 5, 14, 0),
        location: { city: 'Alexandria', address: 'Library of Alexandria' },
        capacity: 50,
        registeredCount: 0,
        category: technology._id,
        organizer: admin._id,
        status: 'published',
      },
      {
        title: 'Draft Event - Not Published',
        description: 'This event is still in draft mode.',
        date: new Date(now.getFullYear(), now.getMonth() + 3, 1, 12, 0),
        location: { city: 'Cairo', address: 'TBD' },
        capacity: 30,
        registeredCount: 0,
        category: business._id,
        organizer: admin._id,
        status: 'draft',
      },
    ]);

    const [jazzFestival, nodeMeetup] = events;

    console.log('Creating registrations...');
    await Registration.insertMany([
      {
        user: attendee._id,
        event: jazzFestival._id,
        status: 'confirmed',
      },
      {
        user: attendee._id,
        event: nodeMeetup._id,
        status: 'confirmed',
      },
    ]);

    console.log('Creating messages...');
    await Message.insertMany([
      {
        event: jazzFestival._id,
        sender: admin._id,
        content: 'Doors open at 6:30 PM. Please bring your ticket.',
        type: 'announcement',
      },
      {
        event: nodeMeetup._id,
        sender: admin._id,
        content: 'Pizza will be served at 7 PM. See you there!',
        type: 'announcement',
      },
    ]);

    console.log('\nDatabase seeded successfully!\n');
    console.log('Sample credentials (password for both): password123');
    console.log('  Admin:    admin@eventpulse.com');
    console.log('  Attendee: attendee@eventpulse.com');
    console.log('\nSummary:');
    console.log('  Users:         2');
    console.log(`  Categories:    ${categories.length}`);
    console.log(`  Events:        ${events.length}`);
    console.log('  Registrations: 2');
    console.log('  Messages:      2');

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
