# Task description
The task was to create a Time Reporting System web app in React.js.
A REST server to operate the app was to be implemented as well.

# How to use:
1. build the server : 
    npm run build
2. run the server:
    node .\server.js
3. connect to the server with a browser (currently the adress set to localhost:5000)

# Server data:
Exists within the same folder as the server.js file
"projects.json" is required for proper functionality

# User Interface:
Login Screen:
![Login View](https://github.com/SpartaqS/ReactJS-Time-Reporting-System/blob/main/docs/login.png)
User authentication was not required in the task, therefore a simple username input screen was implemented.
After "logging in", user's today's entries are shown:

Daily Entries Screen:
![Daily View](https://github.com/SpartaqS/ReactJS-Time-Reporting-System/blob/main/docs/daily-view.png)
Utilizing the "Add Entry" button, user may create a new entry for the selected date.
Each entry can be seen in detail, modified and deleted.

Entry Manipulation:
![Add a new entry](https://github.com/SpartaqS/ReactJS-Time-Reporting-System/blob/main/docs/entry-add.png)
![See entry details](https://github.com/SpartaqS/ReactJS-Time-Reporting-System/blob/main/docs/entry-details.png)
![Edit entry](https://github.com/SpartaqS/ReactJS-Time-Reporting-System/blob/main/docs/entry-edit.png)
![Delete entry](https://github.com/SpartaqS/ReactJS-Time-Reporting-System/blob/main/docs/entry-delete.png)