# main-with-backend 
Repo with backend functionality 

Link to Deployed site: 
=
https://profitpro-e81ab.web.app/

Key Notes: 
=

Webpack
  - a bundling system that allows all files in a project to access node_module packages (examples: "firebase/auth", "firebase/firestore", etc.)
  - Webpack references the "src" directory to find files that it will bundle and export into the "dist" directory
  - when you are ready to compile the project (post any updates) use npx webpack
        - this will gather all files and bundle them and post them in the "dist" directory
        - the "dist" directory is what firebase will reference when hosting the app


<img width="230" alt="image" src="https://github.com/user-attachments/assets/6abf07ee-e9dc-4bae-8c13-e5cc0966b7d8">

File organization

  - All modifiable files must go in the "src" directory
      - the "src" directory is organized into three categories of files
            - html
            - js
            - css


Best practices for this project:
=

JAVASCRIPT
==
  - When referencing other files (example is when calling a js file in your index.html) think of it as in the same directory (example: src='/styles.css' instead of src='../css/styles.css'
    because when all the files get bundled and put in the "dist" directory, they will all be in the same spot
  - When creating javascript files to add functionality, import the app object from firebaseConfig.js and export any functions or packages created in your file
      - For example:
       
    From the firebaseConfig.js file, we export the app object so that we can use it to call other firebase functions, for example:
    
    ![image](https://github.com/user-attachments/assets/db5e8769-2819-4093-a738-fbee60fd150f)
    
    Here, we see that we can import the app object from firebaseConfig, and use it to initialize auth for the project 

    By modularizing our js files, we can create better readability amongst each other

HTML
==
  - When creating new html pages, keep in mind the style of the application, looking and referencing the fonts used and colors
  - Put all files in the html directory
  - When you want to include the html in the project, you must modify the webpack.config.js file to configure the webpack script portion to add your new html file to the bundle that will autopopulate the "dist" directory

   For example, for the index.html file that is in ./src/html/index.html, the webpack config file includes:
   
   ![image](https://github.com/user-attachments/assets/bac8dc57-6308-4f65-904b-280d7f701f39)
    
  - this line copies the file in ./src/html/index.html and places it into the "dist" directory as "index.html"
  - this allows the main.js file (bundled version of index.js) to access index.html and all other files in the dist directory

CSS
==
  - idrk go crazy



PS
=

If anybody has any question please reach out, it for real took me forever to figure all of this out so don't feel bad for not getting it immediately. You can get to me via discord or email or we can schedule a call to talk about it 

Erik 
    


    

