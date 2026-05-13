# Practical 1 Web_102 Social Media API Documentation

-----
Aim:
-----
- RESTful API design for a social media platform which includes endpoints for managing users, posts, comments, likes, and followers.
- The API follows standard HTTP methods such as GET, POST, PUT, and DELETE to perform CRUD operations.

------------------
Technologies Used
------------------

- HTML (for documentation structure)
- CSS (for styling the documentation)
- REST API design principles

--------------
API Endpoints
--------------
1. users:
- GET /api/users → List all users
- GET /api/users/{id} :  Get a specific user
- POST /api/users : Create a user
- PUT /api/users/{id} : Update a user
- DELETE /api/users/{id} : Delete a user

2. Posts:
- GET /api/posts → List all posts
- GET /api/posts/{id} → Get a specific post
- POST /api/posts → Create a post
- PUT /api/posts/{id} → Update a post
- DELETE /api/posts/{id} → Delete a post

3. Comments:

- GET /api/posts/{postId}/comments → Get comments
- POST /api/comments → Add comment
- DELETE /api/comments/{id} → Delete comment

4.  Likes:

- POST /api/posts/{id}/like → Like a post
- DELETE /api/posts/{id}/unlike → Unlike a post

5.Followers:

- POST /api/users/{id}/follow → Follow user
- DELETE /api/users/{id}/unfollow → Unfollow user
- GET /api/users/{id}/followers → List followers
- GET /api/users/{id}/following → List following


----------------
Testing the API
----------------
Run Server: npm run dev
The endpoints can be tested using:

- Postman
- Command line using curl

# Reflection

In this practical, I applied the concept of RESTful API design. I used HTTP methods such as GET, POST, PUT, and DELETE to perform CRUD operations on different resources like users, posts, comments, likes, and followers.
I also learned how to structure API endpoints clearly and consistently. Each resource follows a predictable pattern, making the API easy to understand and use.

---------------
What I Learned
---------------

- Through this exercise, I learned how APIs are designed and documented in real-world applications. 
- I understood how different components of a social media platform are connected through endpoints.
- I also improved my understanding of how client applications communicate with servers using HTTP requests.

-------------------------------
Challenges Faced and solutions
-------------------------------

One challenge I faced was understanding how to structure endpoints properly, especially for nested resources like comments under posts.
Another difficulty was maintaining consistency in naming endpoints and formatting the documentation.
To overcome these challenges, I:
- Followed REST API conventions and examples
- Referred to similar API structures
- Practiced writing endpoints step by step

