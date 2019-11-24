var exports = (module.exports = {})
const Octokit = require("@octokit/rest")
const ylParser = require("parse-yarn-lock").default
const octokit = new Octokit()

var ylPath = ""
var pkgJsonPath = ""
var currentRepo = ""
var dependenciesNodes = []
var ylfinaldep = []
var fileTree = { name: "default", type: "directory", subfile: [] }
exports.fileTree = fileTree
var a = false

/* Read package json and return a list of dependencies */
exports.readPkgJson = function(repoPath) {
  var pathComponents = repoPath.split("/")

  return octokit.repos
    .getContents({
      owner: pathComponents[3],
      repo: pathComponents[4],
      path: pkgJsonPath
    })
    .then(result => {
      // content will be base64 encoded
      const content = Buffer.from(result.data.content, "base64").toString()
      var temp = JSON.parse(content)
      dependenciesNodes = []
      var dependencies = temp["dependencies"]
      for (var i = 0; i < Object.keys(dependencies).length; i++) {
        var key = Object.keys(dependencies)[i]
        var node = { name: key, version: dependencies[key] }
        dependenciesNodes.push(node)
      }

      var devDependencies = temp["devDependencies"]
      for (var i = 0; i < Object.keys(devDependencies).length; i++) {
        var key = Object.keys(devDependencies)[i]
        var node = { name: key, version: devDependencies[key] }
        dependenciesNodes.push(node)
      }
      console.log(dependenciesNodes)
      return dependenciesNodes
    })
}

/* Read Yarn.lock file and analyze subdependencies and return a list*/
/* readYL has to be run after readPkgJson */
exports.readYL = function(repoPath) {
  var pathComponents = repoPath.split("/")

  console.log("pkgpath: " + pkgJsonPath)
  return octokit.repos
    .getContents({
      owner: pathComponents[3],
      repo: pathComponents[4],
      path: ylPath
    })
    .then(result => {
      // content will be base64 encoded
      var yldepenceiesNodes = []
      const content = Buffer.from(result.data.content, "base64").toString()
      var yldependencies = ylParser(content)
      // The object has two keys: "type", "object". "type" has nothing in it.
      // "object" contains all dependencies we want
      var objectkey = Object.keys(yldependencies)[1] // object
      var innerDependencies = yldependencies[objectkey]
      for (var i = 0; i < Object.keys(innerDependencies).length; i++) {
        var key = Object.keys(innerDependencies)[i]
        //console.log(innerDependencies[key]);
        var sub_dep = null
        try {
          var sub_dep = innerDependencies[key]["dependencies"]
        } catch (err) {
          //console.log("no dependencies");
        }
        var sub_dependencyList = []
        if (sub_dep !== undefined) {
          for (var j = 0; j < Object.keys(sub_dep).length; j++) {
            var sub_key = Object.keys(sub_dep)[j]
            var node = { name: sub_key, version: sub_dep[sub_key] }
            sub_dependencyList.push(node)
          }
        }

        var cutKey = key.substring(0, key.lastIndexOf("@"))
        var ylnode = {
          name: cutKey,
          version: innerDependencies[key]["version"],
          "sub-dependencies": sub_dependencyList
        }
        yldepenceiesNodes.push(ylnode)
      }
      return this.readPkgJson(repoPath).then(dpNodes => {
        ylfinaldep = []
        console.log(yldepenceiesNodes.length)
        for (var i = 0; i < dpNodes.length; i++) {
          for (var j = 0; j < yldepenceiesNodes.length; j++) {
            if (
              yldepenceiesNodes[j]["name"] === dpNodes[i]["name"] &&
              yldepenceiesNodes[j]["version"] === dpNodes[i]["version"]
            ) {
              ylfinaldep.push(yldepenceiesNodes[j])
              console.log(yldepenceiesNodes[j])
            }
          }
        }
        return ylfinaldep
      })
    })
}

/* Analyze the repo structure and create a file tree */
/* Analyze the dependency for each js file and add it to file tree */
exports.readRepo = function(repoPath) {
  var pathComponents = repoPath.split("/")
  return octokit.repos
    .getCommit({
      owner: pathComponents[3],
      repo: pathComponents[4],
      ref: "master"
    })
    .then(result => {
      //   const myjson = result.data
      const sha = result.data.sha
      return octokit.git
        .getTree({
          owner: pathComponents[3],
          repo: pathComponents[4],
          tree_sha: sha,
          recursive: 1
        })
        .then(result => {
          return analyzeTree(
            result.data.tree,
            pathComponents[3],
            pathComponents[4]
          ).then(finalresult => {
            currentRepo == repoPath
            return finalresult
          })
        })
    })
}

async function analyzeTree(tree, owner, repo) {
  var tree
  return new Promise(function(resolve, reject) {
    try {
      for (var obj of tree) {
        if (obj["type"] === "tree") {
          createTreeNode(obj["path"])
        }
      }
      var promiseLit = []
      for (var obj of tree) {
        var pathSplit = obj["path"].split("/")
        var ext = pathSplit[pathSplit.length - 1].split(".")[1]
        if (obj["type"] === "blob") {
          // console.log(pathSplit[pathSplit.length-1])
          if (ext === "js") {
            //Promise call: obj in the second function call may not be the same as what is is in first function
            console.log("analyzeTree:" + obj["path"])
            var a = new Promise(function(resolve, reject) {
              analyzeFileDep(obj["path"], owner, repo).then(result => {
                AddFileNode(result["path"], result["node"])
                resolve(fileTree)
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
      })
    } catch (error) {
      reject(fileTree)
    }
  })
}

function createTreeNode(path) {
  if (!path.includes("/")) {
    var treeNode = { name: path, type: "directory", subfile: [] }
    fileTree["subfile"].push(treeNode)
  } else {
    var pathSplit = path.split("/")
    var i = 0
    var currentNode = fileTree
    while (i < pathSplit.length) {
      var bool = 0
      for (var j = 0; j < currentNode["subfile"].length; j++) {
        var node = currentNode["subfile"][j]
        loop: if (node["name"] === pathSplit[i]) {
          currentNode = currentNode["subfile"][j]
          bool = 1
          break loop
        }
      }
      if (bool == 0) {
        var newNode = { name: pathSplit[i], type: "directory", subfile: [] }
        currentNode["subfile"].push(newNode)
        var l = currentNode["subfile"].length
        currentNode = currentNode["subfile"][l - 1]
      }
      i++
    }
  }
}

function analyzeFileDep(path, owner, repo) {
  var ext = path.split(".")[1]
  var pathSplit = path.split("/")
  var fileName = pathSplit[pathSplit.length - 1]
  return octokit.repos
    .getContents({
      owner: owner,
      repo: repo,
      path: path
    })
    .then(result => {
      const content = Buffer.from(result.data.content, "base64").toString()
      var reg = content.match(/import.*from.*;/g)
      var dependency = []
      if (reg !== null) {
        for (var dep of reg) {
          var fromIndex = dep.indexOf("from")
          var str = dep.substring(fromIndex + 4, dep.length - 1)
          var cleanDep = str.trim()

          dependency.push(cleanDep.substring(1, cleanDep.length - 1))
        }
      }
      node = { name: fileName, type: "file", dependency: dependency }
      console.log("fileDep" + path)
      return { node: node, path: path }
    })
}

function AddFileNode(path, fileNode) {
  var pathSplit = path.split("/")
  var currentNode = fileTree
  for (var i = 0; i < pathSplit.length - 1; i++) {
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
  return fileTree
}