var express = require('express');
var router = express.Router();
var fs = require("fs");
path = require('path');
var multer  = require('multer');
var userIdGlobal = "";
var GlobalSelectedpath;

function readFiles(Folderpath,callback)
{
   var fileDetails = [];
   fs.readdir(Folderpath, function(err, items) {
                   if(items!=undefined && items.length>0 && items!=null){

                    for (var i=0; i<items.length; i++) {
                        var file = Folderpath + '/' + items[i];
                        var finalpath=Folderpath;
                       fs.stat(file, generate_callback(file, items.length,finalpath));
                    }
                    function generate_callback(file,folderCount,finalpath) {
                        return function(err, stats) {
                                var time=stats["mtime"];
                                time = JSON.stringify(time).toString().split('T');
                                time = time[0].substr(1);
                                var nameFile=file.split('/');
                                var namelength=nameFile.length;
                               var types= stats.isDirectory();
                               var ftype;
                               if(types==true)
                                    ftype="folder";
                                else
                                    ftype="file";
                                      var tempItemObj={
                                          file:file,
                                          name: nameFile[namelength-1],
                                          size:stats["size"],
                                          mtime:time,
                                          type:ftype,
                                          path:finalpath
                                      };
                                      fileDetails.push(tempItemObj);
                                      if(fileDetails.length == folderCount){
                                      callback(null,{fileData:fileDetails});
                                      }
                            }
                    };
                }
                    else{
                        callback(null,null);
                    }
                    
                });
                
}

function readSelected(Folderpath,callback){
    var fileDetails = [];
    console.log("Folderpath",Folderpath);
    fs.readdir(Folderpath, function(err, items) {
      console.log("items",items);
                    if(items!=undefined && items.length>0 && items!=null){
                      for (var i=0; i<items.length; i++) {
                          var file = Folderpath  +"/"+ items[i];
                          var finalpath=Folderpath;
                         fs.stat(file, generate_callback(file, items.length,finalpath));
                      }
                      function generate_callback(file, folderCount,finalpath) {
                          return function(err, stats) {
                            var time=stats["mtime"];
                            time = JSON.stringify(time).toString().split('T');
                            time = time[0].substr(1);
                            var nameFile=file.split('/');
                            var namelength=nameFile.length;
                            var username=nameFile[namelength-2];
                            var stop;
                            if(username==userIdGlobal)
                            stop="yes";
                            else
                            stop="no"
                           var types= stats.isDirectory();
                           var ftype;
                           if(types==true)
                                ftype="folder";
                            else
                                ftype="file";
                                  var tempItemObj={
                                      file:file,
                                      name: nameFile[namelength-1],
                                      size:stats["size"],
                                      mtime:time,
                                      type:ftype,
                                      path:finalpath,
                                      root:stop
                                  };
                                  fileDetails.push(tempItemObj);

                                  if(fileDetails.length == folderCount){
                                      console.log("inside selected folder-- all files",{fileData:fileDetails})
                                      callback(null,{fileData:fileDetails},null);
                                  }
                              }
                      };
                    }
                    else {
                        var nameFile=Folderpath.split('/');
                        var namelength=nameFile.length;
                        var currentFile=nameFile[namelength-1];
                        console.log("name::",Folderpath);
                        callback(null,null,Folderpath);
                    }

          });
}

router.post('/createFile', function(req, res, next) {
console.log(req.body.name);
var fpath=req.body.path;
console.log("fpath",fpath);
if(fpath==null)
{
    var newpath=__dirname+'/../Users/'+req.body.userId;
    console.log("newpath",newpath);
    var path=newpath+'/'+req.body.name;
    console.log("path",path);
}
else{
var filename = req.body.name;
var path=fpath+'/'+filename;
console.log("path",path);
var newpath=fpath;
}
    if(req.body.type=="folder"){
        fs.mkdir(path,function(err)
      {
          if(err)
          console.log("error in creating directory",err);
          else{
          console.log("directory is successfully created");
          readFiles(newpath,(err,response)=>{
            if(response == null)
                res.json(null);
            else{
               res.json(response);
            }
       })
      }
      });
          }
          else
          {
            var filecontent=" ";
            var ext;
            console.log(req.body.type);
            if(req.body.type=="Textfile"){
            ext=".txt";
          }
            else if (req.body.type=="Word document") {
              ext=".docx";
            }
            else if (req.body.type=="Excel workbook") {
              ext=".xlsx";
            }
            else if (req.body.type=="PowerPoint Presentation") {
              ext=".pptx";
            }
            else if (req.body.type=="Forms for Excel") {
              ext=".xlsx";
            }
            path=path+ext;
            fs.writeFile(path,filecontent, (err) => {
                if(err)
                console.log("error in creating file",err);
                else{
                console.log("file is successfully created");
                readFiles(newpath,(err,response)=>{
                    if(response == null)
                        res.json(null);
                    else{
                       res.json(response);
                    }
               })
                }
            });
          }
 });


router.post('/deleteFile', function(req, res, next) {
    var rimraf = require('rimraf');
    var fileDetails = [];
    console.log("req body in delete",req.body);
    var path=req.body.path;
    var filename=req.body.name;
    var newpath=path+"/"+filename;
    rimraf(newpath,function(err){
        if(err){
            console.log("error in deleting file");
        }
        else{
        console.log('done');
        var Folderpath=path;
        readFiles(Folderpath,(err,response)=>{
            if(response == null)
                res.json(null);
            else{
               res.json(response);
            }
       })
            }
    });

});

router.post('/getFiles', function(req, res, next){
  
    var UserFolder=__dirname+'/../Users/'+req.body.userId;
    console.log("userfolder-->",UserFolder);
    userIdGlobal = req.body.userId;
    GlobalSelectedpath=UserFolder;
    fs.access(UserFolder, function(err) {
        if (err && err.code === 'ENOENT') {
            console.log("creating user folder");
            fs.mkdir(UserFolder,function(err)
            {
                if(err)
                console.log("error in creating directory");
                else{
                console.log("directory is successfully created");
                 var Folderpath=UserFolder;
                  console.log("Folderpath",Folderpath)
                  readFiles(Folderpath,(err,response)=>{
                    if(response == null)
                        res.json(null);
                    else{
                        console.log("inside old function",response);
                       res.json(response);
                    }
               })
                }
            });
        }
        else
        {
            var Folderpath=UserFolder;

            readFiles(Folderpath,(err,response)=>{
                if(response == null)
                    res.json(null);
                else{
                    console.log("inside old function",response);
                   res.json(response);
                }
           })
        }
    });
});


var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null,GlobalSelectedpath);
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname);
    }
 });


  var upload = multer({ storage: Storage }).array("myfile", 1);

  router.post('/uploadFile', function(req, res) {
    upload(req,res,function(err) {
        if(err) {
          console.log('Error uploading', err);
        }
        else{
          console.log('Uploaded Successfully');
          var Folderpath= GlobalSelectedpath;
          console.log("--->",GlobalSelectedpath);
          readFiles(GlobalSelectedpath,(err,response)=>{
              if(response == null)
                  res.json(null);
              else{
                  console.log("inside old function",response);
                 res.json(response);
              }
         })
        }
    });

  });

  router.post('/selectedFolder', function(req, res) {
      var Folderpath=req.body.file;
     console.log("inside selected folder",Folderpath);
      GlobalSelectedpath=Folderpath;
       readSelected(Folderpath,(err,response,currentfolder)=>{
            if(response == null)
                res.json(currentfolder);
            else{
               res.json(response);
            }
       })

  });
router.post('/handleBack', function(req, res) {
  var stop;
  var path=req.body.userId;
  console.log("path",path);
  var nameFile=path.split('/');
  var namelength=nameFile.length;
  var filename=nameFile[namelength-1];
  var username=nameFile[namelength-2];
  var pathLength=path.length;
  var filelength=filename.length;
  path=path.substr(0,(pathLength-filelength-1));
  console.log("newpath:",path);

  readSelected(path,(err,response)=>{
    if(response == null)
        res.json(null);
    else{
       res.json(response);
    }
})
});


module.exports = router;
