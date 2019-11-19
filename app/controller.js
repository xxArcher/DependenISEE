var exports = module.exports = {};
const Octokit = require("@octokit/rest");
const ylParser = require('parse-yarn-lock').default
const octokit = new Octokit();

var dependenciesNodes = [];
var yldepenceiesNodes = [];
var a = false;
exports.readPkgJson = function(repoPath){
    //var repoPath = "https://github.com/MalcolmChen97/React-Native-SmallApps";
    var pathComponents = repoPath.split("\/");
    // for (var i=0;i<pathComponents.length;i++){
    //     console.log(pathComponents[i]);
    // }
    octokit.repos.getContents({
        owner: pathComponents[3],
        repo: pathComponents[4],
        //TODO
        path: 'auth/package.json' 
      }).then(result => {
          // content will be base64 encoded
          const content = Buffer.from(result.data.content, 'base64').toString();
          var temp = JSON.parse(content)
          var dependencies = temp["dependencies"]
          for (var i=0; i< Object.keys(dependencies).length;i++ ){
              var key = Object.keys(dependencies)[i];
              var node = { "name": key, "version": dependencies[key]}
              //console.log(node);
              dependenciesNodes.push(node);
          }
          console.log(dependenciesNodes);
        })
        
    return "";
};


exports.readYL = function(repoPath){
    //var repoPath = "https://github.com/MalcolmChen97/React-Native-SmallApps";
    var pathComponents = repoPath.split("\/");
    // for (var i=0;i<pathComponents.length;i++){
    //     console.log(pathComponents[i]);
    // }
    octokit.repos.getContents({
        owner: pathComponents[3],
        repo: pathComponents[4],
        //TODO
        path: 'auth/yarn.lock' 
      }).then(result => {
          // content will be base64 encoded
          const content = Buffer.from(result.data.content, 'base64').toString();
          var yldependencies = ylParser(content)
          // The object has two keys: "type", "object". "type" has nothing in it. 
          // "object" contains all dependencies we want
          var objectkey = Object.keys(yldependencies)[1] // object
          var innerDependencies = yldependencies[objectkey]
          for (var i=0;i<Object.keys(innerDependencies).length; i++ ) {
              var key = Object.keys(innerDependencies)[i];
              //console.log(innerDependencies[key]);
              var sub_dep = null;
              try{
              var sub_dep = innerDependencies[key]["dependencies"]
              }catch (err){
                  //console.log("no dependencies");
              }
              var sub_dependencyList = [];
              if (sub_dep !== undefined){
                 for (var j=0; j< Object.keys(sub_dep).length; j++){
                    var sub_key = Object.keys(sub_dep)[j];
                    var node = { "name": sub_key, "version": sub_dep[sub_key]} ;
                    sub_dependencyList.push(node);
                 }
              }
               //console.log(sub_dependencyList)
               var ylnode = { "name": key, "version": innerDependencies[key]["version"],"sub-dependencies":sub_dependencyList};
               //console.log(ylnode);
               yldepenceiesNodes.push(ylnode);
           }
           for (var i=0; i<20; i++){
               console.log(yldepenceiesNodes[i]);
           }

        })
        
    return "";
};


