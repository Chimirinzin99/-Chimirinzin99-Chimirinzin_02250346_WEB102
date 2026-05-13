# P3_File-Upload-Server

----------
Objective
----------

To create a server-side file upload mechanism with Node.js and Express that can accept, verify, and save files sent from a React or Next.js frontend. The objective is to foster comprehension of managing multipart form data, implementing validation for file type and size, and guaranteeing safe and efficient file storage while unifying the entire upload process between the client and server

------------------
Technologies Used
------------------

- Next.js (Frontend)
- Node.js
- Express.js
- Multer (file handling middleware)
- Axios (API requests)

-----------------
Concepts Applied
-----------------

Client-server communication
Multipart/form-data handling
File validation (type and size)
Middleware usage (Multer)
API route creation
Error handling


# Reflection

In this task, I utilized multiple key principles associated with comprehensive web development. I discovered how to manage file uploads through multipart/form-data, permitting the transmission of both text and binary data simultaneously. I utilized middleware in Express to effectively handle incoming file data. I also applied file validation methods like limiting file types and restricting file size to enhance security. The connection between the frontend and backend through API calls enabled me to grasp how data moves through various layers of a web application

------------------------
Challenges and Solutions
------------------------

- A significant challenge I encountered was that the upload process constantly displayed “Upload failed” even if the code  
  appeared to be correct. 
- I found that the problem stemmed from wrong API endpoints and absent response fields like the success status in the backend. 
  Correcting the response format and guaranteeing effective communication between frontend and backend addressed the problem.
- Another challenge was comprehending how files are managed internally on the server, particularly the transformation into 
  buffers prior to storage.
- At first, this was perplexing, but through practice and troubleshooting, I managed to grasp the process thoroughly

----------------
What I Learned ?
----------------
By engaging in this hands-on activity,
I developed a more comprehensive insight into the functionality of file upload systems in practical applications.
I discovered how the frontend creates and transmits file information utilizing FormData and how the backend handles and saves it. I also recognized the significance of managing responses correctly to show success or error messages to users.

------------------------
How to run the project?
------------------------
install dependencies
- npm install express cors multer morgan dotenv
- npm install
- 

start backend
- npm run dev

start frontend
- npm run dev 

--------
Results
--------

The system successfully uploads files from the frontend to the server, validates them, and stores them securely 
where file in saved in the upload directory where:
- Validation works (file type and size)
- Successful uploads return proper information
- Error handling works for invalid files and size limits 