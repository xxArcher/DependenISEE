var exports = module.exports = {};
const Octokit = require("@octokit/rest");
const ylParser = require('parse-yarn-lock').default
const octokit = new Octokit();

var dependenciesNodes = [];
var yldepenceiesNodes = [];
var fileTree = {"name":"default","type":"directory","subfile":[]};
var a = false;
exports.readPkgJson = function(path){
    //var repoPath = "https://github.com/MalcolmChen97/React-Native-SmallApps";
    var pathComponents = repoPath.split("\/");
    // for (var i=0;i<pathComponents.length;i++){
    //     console.log(pathComponents[i]);
    // }
    octokit.repos.getContents({
        owner: pathComponents[3],
        repo: pathComponents[4],
        //TODO
        path: path
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


exports.readRepo = function(repoPath){
    octokit.repos.getCommit({
        owner:"MalcolmChen97",
        repo:"React-Native-SmallApps",
        ref: "master"
      }).then( result =>{
        //   const myjson = result.data
          const sha = result.data.sha
          octokit.git.getTree({
            owner:"MalcolmChen97",
            repo:"React-Native-SmallApps",
            tree_sha:sha,
            recursive: 1
          }).then(result=>{
            //   for (var obj of result.data.tree){
            //       console.log(obj["path"]+" "+obj["type"])
                 
            //   }
              analyzeTree(result.data.tree);
          })


      })

};

function analyzeTree(tree){
      for(var obj of tree){
          if (obj["type"]==="tree"){
              createTreeNode(obj["path"]);
          } else if (obj["type"]==="blob") {
              var fileNode = analyzeFileDep(obj["path"]);
              //AddFileNode(fileNode);
          };
      }
      console.log(fileTree["subfile"][0]["subfile"])
      console.log(fileTree["subfile"][1]["subfile"])
}

function createTreeNode(path){
    if (!path.includes("\/")){
        var treeNode = { "name":path, "type":"directory","subfile":[]};
        fileTree["subfile"].push(treeNode);
    } else{         
        var pathSplit = path.split("\/");  
        var i = 0;  
        var currentNode = fileTree;
        while (i<pathSplit.length ){
            var bool = 0;
            for(var j=0; j <currentNode["subfile"].length; j++){
                var node = currentNode["subfile"][j];
                loop:
                if(node["name"]=== pathSplit[i])
                   {currentNode = currentNode["subfile"][j];
                    bool = 1;
                    break loop;
                    }
            }
            if(bool == 0){
               var newNode = {"name":pathSplit[i],"type":"directory","subfile":[]}
               currentNode["subfile"].push(newNode);
               var l = currentNode["subfile"].length
               currentNode = currentNode["subfile"][l-1];
             }
             i++;
        }

       }
}

function analyzeFileDep(path){
     var ext = path.split("\.")[1];
     var pathSplit = path.split("\/");
     var fileName = pathSplit[pathSplit.length-1];
     if (fileName === "yarn.lock"){
          //readYL(path);
     } else if (fileName === "package.json"){
          //readPkgJson(path);
     } else if (ext === "js" ){
        octokit.repos.getContents({
            owner:"MalcolmChen97",
            repo: "React-Native-SmallApps",
            path: path 
          }).then(result => {
            const content = Buffer.from(result.data.content, 'base64').toString();
            var reg = content.match(/import.*from.*;/g)
            var dependency = []
            if (reg !== null){
              for (var dep of reg){
                var fromIndex = dep.indexOf("from");
                var str = dep.substring(fromIndex+4,dep.length-1)
                var cleanDep = str.trim();
            
                dependency.push(cleanDep.substring(1,cleanDep.length-1))
             }
            }
            var node = {"name":fileName,"type":"file","dependency":dependency}
            console.log(node);
            return node;
          }
        )
     }
}