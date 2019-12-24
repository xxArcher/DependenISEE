const Octokit = require("@octokit/rest");
const ylParser = require('parse-yarn-lock').default
const octokit = new Octokit({ auth: "5a7a77d427a31262b7c5fc5abf62b691a53bc882" });
var exports;

var ylPath = "";
var pkgJsonPath = "";
var currentRepo = ""

var a = false;

/* Read package json and return a list of dependencies */
function readPkgJson (repoPath) {
  var pathComponents = repoPath.split("\/");
  console.log("path1" + pkgJsonPath + " I AM HERE")
  return new Promise((resolve, reject) => {
    if (pkgJsonPath === "") {
      reject(new Error("Cannot find package.json"));
    } else { 
      octokit.repos.getContents({
        owner: pathComponents[3],
        repo: pathComponents[4],
        path: pkgJsonPath
      }).then(result => {
        var dependenciesNodes = { "dependency": [], "devDependency": [] }
        // content will be base64 encoded
        const content = Buffer.from(result.data.content, 'base64').toString();
        var temp = JSON.parse(content)
        dependenciesNodes = { "dependency": [], "devDependency": [] }
        var dependencies = temp["dependencies"]
        for (var i = 0; i < Object.keys(dependencies).length; i++) {
          var key = Object.keys(dependencies)[i];
          var node = { "name": key, "version": dependencies[key] }
          dependenciesNodes["dependency"].push(node);
        }
  
        var devDependencies = temp["devDependencies"]
        for (var i = 0; i < Object.keys(devDependencies).length; i++) {
          var key = Object.keys(devDependencies)[i];
          var node = { "name": key, "version": devDependencies[key] }
          dependenciesNodes["devDependency"].push(node);
        }
        console.log(dependenciesNodes)
        resolve(dependenciesNodes);
      }).catch((error) => {
        reject(error);
      })
    }
  })
  
};

/* Read Yarn.lock file and analyze subdependencies and return a list*/
/* readYL has to be run after readPkgJson */
function readYL (repoPath) {
  //var repoPath = "https://github.com/MalcolmChen97/React-Native-SmallApps";
  var pathComponents = repoPath.split("\/");
    return new Promise((resolve, reject) => {
      if (ylPath === "") {
        reject(new Error("can't find yarn.lock"));
      } else {
        octokit.repos.getContents({
          owner: pathComponents[3],
          repo: pathComponents[4],
          path: ylPath
        }).then(result => {
          // content will be base64 encoded
          var ylfinaldep = { "dependency": [], "devDependency": [] };
          var yldepenceiesNodes = [];
          const content = Buffer.from(result.data.content, 'base64').toString();
          var yldependencies = ylParser(content)
          // The object has two keys: "type", "object". "type" has nothing in it. 
          // "object" contains all dependencies we want
          var objectkey = Object.keys(yldependencies)[1] // object
          var innerDependencies = yldependencies[objectkey]
          for (var i = 0; i < Object.keys(innerDependencies).length; i++) {
            var key = Object.keys(innerDependencies)[i];
            //console.log(innerDependencies[key]);
            var sub_dep = null;
            try {
              var sub_dep = innerDependencies[key]["dependencies"]
            } catch (err) {
              //console.log("no dependencies");
            }
            var sub_dependencyList = [];
            if (sub_dep !== undefined) {
              for (var j = 0; j < Object.keys(sub_dep).length; j++) {
                var sub_key = Object.keys(sub_dep)[j];
                var node = { "name": sub_key, "version": sub_dep[sub_key] };
                sub_dependencyList.push(node);
              }
            }
  
            var cutKey = key.substring(0, key.lastIndexOf("@"));
            var ylnode = { "name": cutKey, "version": innerDependencies[key]["version"], "sub-dependencies": sub_dependencyList };
            yldepenceiesNodes.push(ylnode);
          }
  
          //Only save sub dependencies for the second level
          readPkgJson(repoPath).then(dpNodes => {
            ylfinaldep = { "dependency": [], "devDependency": [] };
            console.log(yldepenceiesNodes.length)
    
            for (var i = 0; i < dpNodes["dependency"].length; i++) {
              var check = 0;
              var dpversion = dpNodes["dependency"][i]["version"].replace("^", "");
              for (var j = 0; j < yldepenceiesNodes.length; j++) {
                var ylversion = yldepenceiesNodes[j]["version"].replace("^", "");
                if ((yldepenceiesNodes[j]["name"] === dpNodes["dependency"][i]["name"]) &&
                  (dpversion === ylversion)) {
                  ylfinaldep["dependency"].push(yldepenceiesNodes[j]);
                  check = 1;
                }
              }
              if (check == 0) {
                var emptynode = { "name": dpNodes["dependency"][i]["name"], "version": dpversion, "sub-dependencies": [] }
                ylfinaldep["dependency"].push(emptynode)
              }
            }
            for (var i = 0; i < dpNodes["devDependency"].length; i++) {
              var check = 0;
              var dpversion = dpNodes["devDependency"][i]["version"].replace("^", "");
              for (var j = 0; j < yldepenceiesNodes.length; j++) {
                var ylversion = yldepenceiesNodes[j]["version"].replace("^", "");
                if ((yldepenceiesNodes[j]["name"] === dpNodes["devDependency"][i]["name"]) &&
                  (dpversion === ylversion)) {
                  ylfinaldep["devDependency"].push(yldepenceiesNodes[j]);
                  check = 1
                }
              }
              if (check == 0) {
                var emptynode = { "name": dpNodes["devDependency"][i]["name"], "version": dpversion, "sub-dependencies": [] }
                ylfinaldep["devDependency"].push(emptynode)
              }
            }
            resolve(ylfinaldep)
          }).catch((error) => {
            reject(error);
          })
        }).catch((error) => {
          reject(error);
        })
      }
    })
};



/* Analyze the repo structure and create a file tree */
/* Analyze the dependency for each js file and add it to file tree */
function readRepo (repoPath) {
  fileTree = { "name": "default", "type": "directory", "subfile": [] };
  var pathComponents = repoPath.split("\/");
  return new Promise((resolve, reject) => {
    octokit.repos.get({
      owner: pathComponents[3],
      repo: pathComponents[4],
    }).then(result => {
       octokit.repos.getCommit({
        owner: pathComponents[3],
        repo: pathComponents[4],
        ref: result.data.default_branch
      }).then(result => {
        //   const myjson = result.data
        const sha = result.data.sha
         octokit.git.getTree({
          owner: pathComponents[3],
          repo: pathComponents[4],
          tree_sha: sha,
          recursive: 1
        }).then(result => {
           analyzeTree(result.data.tree, pathComponents[3], pathComponents[4])
           .then(finalresult => {
             currentRepo = repoPath;
             resolve(finalresult);
          }).catch((error) => {
            reject(error);
          })
        }).catch((error) => {
          reject(error);
        });
  
      }).catch((error) => {
        reject(error);
      })
    }).catch(error => {
      reject(error)
    })
  })
};


async function analyzeTree(tree, owner, repo) {
  var fileTree = { "name": "default", "type": "directory", "subfile": [] };
  return new Promise(function (resolve, reject) {
    try {
      for (var obj of tree) {
        if (obj["type"] === "tree") {
          createTreeNode(fileTree, obj["path"]);
        };
      }
      var promiseLit = []
      pkgJsonPath = ""
      ylPath = ""
      for (var obj of tree) {
        var pathSplit = obj["path"].split("\/");
        var ext = pathSplit[pathSplit.length - 1].split("\.")[1];
        if (obj["type"] === "blob") {
          // console.log(pathSplit[pathSplit.length-1])
          if (ext === "js") {
            //Promise call: obj in the second function call may not be the same as what is is in first function
            console.log("analyzeTree:" + obj["path"])
            var a = new Promise(function (resolve, reject) {
              analyzeFileDep(obj["path"], owner, repo).then(result => {
                filetree = AddFileNode(fileTree, result["path"], result["node"]);
                resolve(fileTree)
              }).catch((error) => {
                reject(error);
              })
            })
            promiseLit.push(a)
          } else if (pathSplit[pathSplit.length - 1] === "package.json") {
            pkgJsonPath = obj["path"]
            console.log("======set path=====" + obj["path"])
          } else if (pathSplit[pathSplit.length - 1] === "yarn.lock") {
            ylPath = obj["path"]
            console.log("======set path=====" + obj["path"])
          }
        }
      }
      Promise.all(promiseLit).then(values => {
        resolve(values[values.length - 1])
      }).catch((err) => {
        reject(err)
        console.log('A promise failed to resolve', err);
    })
    } catch (error) {
      reject(fileTree);
    }
  })
}

function createTreeNode(fileTree, path) {
  if (!path.includes("\/")) {
    var treeNode = { "name": path, "type": "directory", "subfile": [] };
    fileTree["subfile"].push(treeNode);
  } else {
    var pathSplit = path.split("\/");
    var i = 0;
    var currentNode = fileTree;
    while (i < pathSplit.length) {
      var bool = 0;
      for (var j = 0; j < currentNode["subfile"].length; j++) {
        var node = currentNode["subfile"][j];
        loop:
        if (node["name"] === pathSplit[i]) {
          currentNode = currentNode["subfile"][j];
          bool = 1;
          break loop;
        }
      }
      if (bool == 0) {
        var newNode = { "name": pathSplit[i], "type": "directory", "subfile": [] }
        currentNode["subfile"].push(newNode);
        var l = currentNode["subfile"].length
        currentNode = currentNode["subfile"][l - 1];
      }
      i++;
    }

  }
}

function analyzeFileDep(path, owner, repo) {
  var ext = path.split("\.")[1];
  var pathSplit = path.split("\/");
  var fileName = pathSplit[pathSplit.length - 1];
  //console.log(path)
  return new Promise((resolve, reject) => {
    octokit.repos.getContents({
      owner: owner,
      repo: repo,
      path: path
    }).then(result => {
      const content = Buffer.from(result.data.content, 'base64').toString();
      var reg = content.match(/import.*from.*;/g)
      var dependency = []
      if (reg !== null) {
        for (var dep of reg) {
          var fromIndex = dep.indexOf("from");
          var str = dep.substring(fromIndex + 4, dep.length - 1)
          var cleanDep = str.trim();
  
          dependency.push(cleanDep.substring(1, cleanDep.length - 1))
        }
      }
      node = { "name": fileName, "type": "file", "dependency": dependency }
      console.log("fileDep" + path)
      resolve({ "node": node, "path": path })
  
    }).catch((error) => {
      reject(error);
    });
  })
}

function AddFileNode(fileTree, path, fileNode) {
  var pathSplit = path.split("\/");
  var currentNode = fileTree
  for (var i = 0; i < pathSplit.length - 1; i++) {
    // console.log("path split looking at "+ pathSplit[i])
    var error = 1
    for (var j = 0; j < currentNode["subfile"].length; j++) {

      //console.log(currentNode["subfile"][j])
      if (pathSplit[i] === currentNode["subfile"][j]["name"]) {
        // console.log("switching")
        currentNode = currentNode["subfile"][j]
        error = 0
      }
    }
    if (error == 1) {
      console.log(currentNode["subfile"])
      console.log("error message: can't find directory " + "path")
    }
  }

  currentNode["subfile"].push(fileNode)
  return fileTree;
}

module.exports = {
  readPkgJson: readPkgJson,
  readRepo: readRepo,
  readYL: readYL
}