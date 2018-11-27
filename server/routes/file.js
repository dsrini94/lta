var express = require('express');
var router = express.Router();
var fs = require("fs");
path = require('path');


router.post('/createFile', function(req, res, next) {
    var fileDetails = [];
    console.log("inside createfile route");
    console.log(__dirname);
    var UserFolder1=(__dirname+'/../');
    console.log(UserFolder1);
    var UserFolder=UserFolder1+"/Users/"+req.body.userId;
    console.log(UserFolder);
    fs.access(UserFolder, function(err) {
        if (err && err.code === 'ENOENT') {
            console.log("creating user folder");
            fs.mkdir(UserFolder,function(err)
            {
                if(err)
                console.log("error in creating directory");
                else{
                    console.log(UserFolder);
                console.log("file is successfully created");
                fs.access(UserFolder, fs.constants.F_OK, (err) => {
                    console.log(`${UserFolder} ${err ? 'does not exist' : 'exists'}`);
                  });
                  let filename = req.body.name;
                  var Folderpath=UserFolder+"/";
                  var path=Folderpath+filename;
                  if(req.body.type=="folder"){
                fs.mkdir(path,function(err)
              {
                  if(err)
                  console.log("error in creating directory");
                  else{
                  console.log("file is successfully created");
              }
              });
                  }
                  else
                  {
                      var filecontent=" ";
                    fs.writeFile(path,filecontent, (err) => {
                        if(err)
                        console.log("error in creating directory");
                        else{
                        console.log("file is successfully created");
                    }
                  });
                }
                  fs.readdir(Folderpath, function(err, items) {
                      for (var i=0; i<items.length; i++) {
                          var file = Folderpath + '/' + items[i];
                         fs.stat(file, generate_callback(file, i, items.length));
                         console.log(' Outside Filedetails: ', fileDetails);
                      }
                      function generate_callback(file, index, folderCount) {
                          return function(err, stats) {
                            var time=stats["mtime"];
                            time = JSON.stringify(time).toString().split('T');
                            time = time[0].substr(1);
                            var nameFile=file.split('//');
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
                                  console.log(tempItemObj.mtime);
                                  console.log('Index: ', index);
                                  console.log('Folder Count', folderCount)

                                  if(index+1 == folderCount){
                                      console.log('Reached end of the list',i)
                                      console.log('Inside:', fileDetails);
                                      res.json({fileData:fileDetails});
                                  }
                              }
                      };

                  });
            }
            });
        }
        else {
          let filename = req.body.name;
          var Folderpath=UserFolder+"/";
          var path=Folderpath+filename;
          if(req.body.type=="folder"){
        fs.mkdir(path,function(err)
      {
          if(err)
          console.log("error in creating directory");
          else{
          console.log("file is successfully created");
      }
      });
          }
          else
          {
            var filecontent=" ";
            fs.writeFile(path,filecontent, (err) => {
                if(err)
                console.log("error in creating directory");
                else{
                console.log("file is successfully created");
                }
            }); 
          }
          fs.readdir(Folderpath, function(err, items) {
              for (var i=0; i<items.length; i++) {
                  var file = Folderpath + '/' + items[i];
                 fs.stat(file, generate_callback(file, i, items.length));
                 console.log(' Outside Filedetails: ', fileDetails);
              }
              function generate_callback(file, index, folderCount) {
                  return function(err, stats) {
                    var time=stats["mtime"];
                    time = JSON.stringify(time).toString().split('T');
                    time = time[0].substr(1);
                    var nameFile=file.split('//');
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
                          fileDetails.push(tempItemObj);7
                          console.log('Index: ', index);
                          console.log('Folder Count', folderCount)

                          if(index+1 == folderCount){
                              console.log('Reached end of the list',i)
                              console.log('Inside: ', fileDetails);
                              res.json({fileData:fileDetails});
                          }
                      }
              };

          });
    }
    });

 });


router.post('/deleteFile', function(req, res, next) {
    var rimraf = require('rimraf');
    var fileDetails = [];
    var UserFolder1=(__dirname+'../../');
    var UserFolder=UserFolder1+"/Users/"+req.body.userId;
    let filename = req.body.name;
    var Folderpath=UserFolder+"/";
    var path=Folderpath+filename;
    rimraf(path, function (err) {
        if(err){
            console.log("error in deleting file");
        }
        else{
            console.log('done');
            fs.readdir(Folderpath, function(err, items) {
                if(items.length>0){
                for (var i=0; i<items.length; i++) {
                    var file = Folderpath + '/' + items[i];
                   fs.stat(file, generate_callback(file, i, items.length));
                   console.log(' Outside Filedetails: ', fileDetails);
                }
                function generate_callback(file, index, folderCount) {
                    return function(err, stats) {
                        console.log(stats);
                        if('size' in stats){
                            console.log('Size in stats exists')
                        }
                        else{
                            console.log('Size in stats does not exists')
                        }
                        var time=stats["mtime"];
                        time = JSON.stringify(time).toString().split('T');
                        time = time[0].substr(1);
                        var nameFile=file.split('//');
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
                            console.log('Index: ', index);
                            console.log('Folder Count', folderCount)

                            if(index+1 == folderCount){
                                console.log('Reached end of the list',i)
                                console.log('Inside: ', fileDetails);
                                res.json({fileData:fileDetails});
                            }
                        }
                };
            }
            else
            {
                res.json({fileData:fileDetails});
            }
            });

        }

    });

});

module.exports = router;
