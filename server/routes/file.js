var express = require('express');
var router = express.Router();
var fs = require("fs");
path = require('path');
var multer  = require('multer');
var userIdGlobal = "";
var GlobalFolderpath=__dirname+"/../Users";
var GlobalSelectedpath;

function readFiles(Folderpath,callback)
{
   var fileDetails = [];
   fs.readdir(Folderpath, function(err, items) {
                   if(items!=undefined && items.length>0 && items!=null){
                     for (var i=0; i<items.length; i++) {
                         var file = Folderpath  +"/"+ items[i];
                        fs.stat(file, generate_callback(file, i, items.length));
                     }
                     function generate_callback(file, index, folderCount) {
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
                                     type:ftype
                                 };
                                 fileDetails.push(tempItemObj);

                                 if(index+1 == folderCount){
                                     //res.json({fileData:fileDetails});
                                     callback(null,{fileData:fileDetails});
                                 }
                             }
                     };
                   }
                   else {
                       //res.json(null);
                       callback(null,{fileData:fileDetails});
                   }

         });

}

function readSelected(Folderpath,callback){
    var fileDetails = [];
    fs.readdir(Folderpath, function(err, items) {
                    if(items!=undefined && items.length>0 && items!=null){
                      for (var i=0; i<items.length; i++) {
                          var file = Folderpath  +"/"+ items[i];
                         fs.stat(file, generate_callback(file, i, items.length));
                      }
                      function generate_callback(file, index, folderCount) {
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
                            //console.log("username",username,"global",userIdGlobal);
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
                                      root:stop
                                  };
                                  fileDetails.push(tempItemObj);

                                  if(index+1 == folderCount){
                                      console.log("inside selected folder-- all files",{fileData:fileDetails})
                                      callback(null,{fileData:fileDetails},null);
                                  }
                              }
                      };
                    }
                    else {
                        //console.log("folderpath selected",Folderpath);
                        var nameFile=Folderpath.split('/');
                        var namelength=nameFile.length;
                        var currentFile=nameFile[namelength-1];
                        //console.log("name::",currentFile);
                        callback(null,null,currentFile);
                    }

          });
}

router.post('/createFile', function(req, res, next) {
//  console.log("request:",req.body.path);
    // var UserFolder1=(__dirname+'/../');
    // var UserFolder=UserFolder1+"Users/"+req.body.userId;
    var filename = req.body.name;
    //var Folderpath=UserFolder;
    var Folderpath=req.body.path;
  //  console.log("Folderpath",Folderpath,"filename",filename);
    var path=Folderpath+"/"+filename;
    //console.log("Folder path--->",Folderpath);
    if(req.body.type=="folder"){
        fs.mkdir(path,function(err)
      {
          if(err)
          console.log("error in creating directory");
          else{
          console.log("directory is successfully created");
          //readFiles(Folderpath,res);
          readFiles(Folderpath,(err,response)=>{
            if(response == null)
                res.json(null);
            else{
                //console.log("inside old function",response);
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
                console.log("error in creating file");
                else{
                console.log("file is successfully created");
                //readFiles(Folderpath,res);
                readFiles(Folderpath,(err,response)=>{
                    if(response == null)
                        res.json(null);
                    else{
                        //console.log("inside old function",response);
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
    var path=req.body.file;
    var pathLength=path.length;
    var filename=req.body.name;
    var filelength=filename.length;
    var newpath=path.substr(0,(pathLength-filelength-1));
    var newpath1=newpath+"/"+filename;
    rimraf(newpath1,function(err){
        if(err){
            console.log("error in deleting file");
        }
        else{
        console.log('done');
        var Folderpath=newpath;
        //readFiles(Folderpath,res);
        readFiles(Folderpath,(err,response)=>{
            if(response == null)
                res.json(null);
            else{
                //console.log("inside old function",response);
               res.json(response);
            }
       })
            }
    });

});

router.post('/getFiles', function(req, res, next){
  //console.log(req.body);
    var UserFolder1=(__dirname+'/../');
    var UserFolder=UserFolder1+"Users/"+req.body.userId;
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
                    //console.log(UserFolder);
                console.log("directory is successfully created");
                  var Folderpath=UserFolder;
                  //readFiles(Folderpath,res);
                  readFiles(Folderpath,(err,response)=>{
                    if(response == null)
                        res.json(null);
                    else{
                        //console.log("inside old function",response);
                       res.json(response);
                    }
               })
                }
            });
        }
        else
        {
            var Folderpath=UserFolder;
            //readFiles(Folderpath,res);
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
      //console.log("body in multer",req.body);
      //console.log("dirname",__dirname);
      //console.log("GlobalSelectedpath",GlobalSelectedpath);
        //callback(null,__dirname+"/../Users/"+userIdGlobal);
        callback(null,GlobalSelectedpath);
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname);
    }
 });


  var upload = multer({ storage: Storage }).array("myfile", 1);

  router.post('/uploadFile', function(req, res) {
    //console.log("checking-->",req.file);
    //console.log('Upload route called');
    //console.log(req.query);
    upload(req,res,function(err) {
        if(err) {
          console.log('Error uploading', err);
        }
        else{
          console.log('Uploaded Successfully');
        }
    });
    var Folderpath= GlobalSelectedpath;
    //GlobalFolderpath+"/"+userIdGlobal;
    //console.log("Folder--->",GlobalFolderpath,"userid",userIdGlobal);
    //console.log("path",Folderpath);
    //readFiles(Folderpath,res);
    readFiles(Folderpath,(err,response)=>{
        if(response == null)
            res.json(null);
        else{
            console.log("inside old function",response);
           res.json(response);
        }
   })
  });

  router.post('/selectedFolder', function(req, res) {
      var Folderpath=req.body.file;
     console.log("inside selected folder",Folderpath);
      GlobalSelectedpath=Folderpath;
       readSelected(Folderpath,(err,response,currentfolder)=>{
            if(response == null)
                res.json(currentfolder);
            else{
              //  console.log("inside new function",response);
               res.json(response);
            }
       })

  });
router.post('/handleBack', function(req, res) {
  console.log(req.body.userId);
  var stop;
  var path=req.body.userId;
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
        //console.log("inside old function",response);
        //var backobj={response,"route":stop};
        //console.log("back obj-->",backobj);
       res.json(response);
    }
})
});


module.exports = router;
