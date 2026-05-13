# Practical 2 Web_102 Tik-Tok API Design

-----
Aim:
----- 
- To design a RESTful API for a TikTok-like platform built with Node.js and Express

It manages three main resources:

- Users
- Videos
- Comments
----------------------
Required dependencies
----------------------

- npm install express cors morgan body-parser dotenv
- npm install --save-dev nodemon

-------------------
Technologies used:
-------------------

- Node.js 
- JavaScript
- Express.js
- npm Packages 
- 
--------------
 API Features
--------------
1. Users
Create user (with duplicate validation)
Follow / unfollow users
Delete user (cascading delete for videos & comments)

2. Videos
CRUD operations
Like / Unlike videos
Fetch video comments
Validate user existence before creation

3. Comments
Create / update / delete comments
Like / unlike comments
Validate user and video existence

---------------
Testing Points
---------------

- Start server with npm run dev
- Test with curl or Postman
  
Using Curl:
- Get all users:
curl -X GET http://localhost:3000/api/users
- Get all videos:
curl -X GET http://localhost:3000/api/videos
- Get user by ID:
curl -X GET http://localhost:3000/api/users/1
- Get video by ID:
curl -X GET http://localhost:3000/api/videos/1
- Get user’s videos:
curl -X GET http://localhost:3000/api/users/1/videos
- Get video comments:
curl -X GET http://localhost:3000/api/videos/1/comments

# Reflection

In this practical,I  buil a REST API using correct HTTP methods and status codes, and structuring the project using the MVC architecture to separate Models, Controllers, and Routes. I also used middleware for logging, CORS handling, and request parsing, and simulated a database using in-memory JavaScript arrays and objects. Additionally, I implemented cascading operations to maintain data consistency when deleting users, added input validation to ensure required fields and prevent duplicates, and handled errors properly using appropriate HTTP status codes for invalid requests.

---------------
What I Learned
---------------

- Structure an Express project using MVC architecture
- Build and organize RESTful APIs properly
- Understand how HTTP status codes communicate results clearly
- Use middleware effectively and understand execution order in Express
  
-------------------------------
Challenges Faced and  Solutions
-------------------------------

1. ID mismatch errors (req.params.id was string)
Solved by using parseInt() consistently in controllers

2. Routes returning 404 incorrectly
Fixed route ordering (specific routes placed before dynamic /:id routes)
