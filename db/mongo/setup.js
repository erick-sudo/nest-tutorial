// Connect to the admin database
db = db.getSiblingDB('admin')

// Create a root user with admin privileges
db.createUser({
   user: 'admin',
   pwd: 'admin-password',
   roles: [{ role: 'root', db: 'admin' }]
});

// Switching to the desired database
db = db.getSiblingDB('nest_tutorial')

// Create a user with readWrite privileges for the specified database
db.createUser({
   user: 'nest_tutorial',
   pwd: 'nest_tutorial',
   roles: [{ role: 'readWrite', db: 'nest_tutorial' }]
});