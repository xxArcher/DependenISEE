# DependenISEE
Give your GitHub repository link and receive your analysis

**Goal** 
Understanding what a given project depends on (also known as dependencies)

**Setup**
```
npm install -g bundle-phobia-cli
npm install in root directory & lib folder
npm start in root directory to run front-end
yarn start in lib folder to run back-end
```

**Task Assignment**
Analyzing dependencies and their usage, as well as dependency's dependencies (Ryan)
Visualizing dependencies and their usage (Sam)
Visualizing dependencies of dependencies and their usage (Aya) 
Analyzing best path for upgrading libraries, repos which have been abandoned (Andy)
Visualizing best path for upgrading libraries, abandoned repos (Megha)
Front end UI layout with React.js (Aya)

**Functionality**
The idea behind the project is to get a better idea of what resides in the node_modules folder. Dependencies make up a huge part of js projects. The dependencies we add to our project, depend on other dependencies, and they depend on other dependencies (you get the idea). For the most part, we only care about the dependencies that we added and the dependencies of those dependencies (aka sub-dependencies). 
