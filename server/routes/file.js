var express = require('express');
var router = express.Router();
var fs = require("fs");
path = require('path');
var multer  = require('multer');
var userIdGlobal = "";
var GlobalFolderpath=__dirname+"/../Users";


router.post('/createFile', function(req, res, next) {
    var fileDetails = [];
    //console.log("inside createfile route");
    //console.log(__dirname);
    var UserFolder1=(__dirname+'/../');
    //console.log(UserFolder1);
    var UserFolder=UserFolder1+"Users/"+req.body.userId;
    //console.log(UserFolder);
    fs.access(UserFolder, function(err) {
        if (err && err.code === 'ENOENT') {
            console.log("creating user folder");
            fs.mkdir(UserFolder,function(err)
            {
                if(err)
                console.log("error in creating directory");
                else{
                    console.log(UserFolder);
                console.log("directory is successfully created");
                fs.access(UserFolder, fs.constants.F_OK, (err) => {
                    console.log(`${UserFolder} ${err ? 'does not exist' : 'exists'}`);
                  });
                  let filename = req.body.name;
                  var Folderpath=UserFolder+"/";
                  //var Folderpath=UserFolder;
                  var path=Folderpath+filename;
                  if(req.body.type=="folder"){
                fs.mkdir(path,function(err)
              {
                  if(err)
                  console.log("error in creating directory");
                  else{
                  console.log("directory is successfully created");
              }
              });
                  }
                  else
                  {
                      var filecontent=" ";
                      //console.log(req.body.type);
                      path=path+".txt";
                    fs.writeFile(path,filecontent, (err) => {
                        if(err)
                        console.log("error in creating file");
                        else{
                        console.log("file is successfully created");
                    }
                  });
                }
                  fs.readdir(Folderpath, function(err, items) {

                    if(items!=undefined && items.length>0 && items!=null)
                    {
                      for (var i=0; i<items.length; i++) {
                          var file = Folderpath +  items[i];
                         fs.stat(file, generate_callback(file, i, items.length));
                         //console.log(' Outside Filedetails: ', fileDetails);
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
                                //  console.log(tempItemObj.mtime);
                                //  console.log('Index: ', index);
                                  //console.log('Folder Count', folderCount)

                                  if(index+1 == folderCount){
                                    //  console.log('Reached end of the list',i)
                                      //console.log('Inside:', fileDetails);
                                      res.json({fileData:fileDetails});
                                  }
                              }
                      };
                    }
                    else {
                      res.json(null)
                    }




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
          console.log("directory is successfully created");
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
                }
            });
          }

          fs.readdir(Folderpath, function(err, items) {

                    if(items!=undefined && items.length>0 && items!=null){
                      for (var i=0; i<items.length; i++) {
                          var file = Folderpath  + items[i];
                         fs.stat(file, generate_callback(file, i, items.length));
                         //console.log(' Outside Filedetails: ', fileDetails);
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
                                  fileDetails.push(tempItemObj);7
                                  //console.log('Index: ', index);
                                  //console.log('Folder Count', folderCount)

                                  if(index+1 == folderCount){
                                      //console.log('Reached end of the list',i)
                                      //console.log('Inside: ', fileDetails);
                                      res.json({fileData:fileDetails});
                                  }
                              }
                      };
                    }
                    else {
                      res.json(null);
                    }

          });
    }
    });

 });


router.post('/deleteFile', function(req, res, next) {
    var rimraf = require('rimraf');
    var fileDetails = [];
    var path=req.body.file;
    var pathLength=path.length;
    var filename=req.body.name;
    var filelength=filename.length;
    var newpath=path.substr(0,(pathLength-filelength-1));
    //console.log("path:",path);
    //console.log("path length",pathLength,"file length",filelength,"path without file",newpath);
    var newpath1=newpath+"/"+filename;
    rimraf(newpath1,function(err){
        if(err){
            console.log("error in deleting file");
        }
        else{
        console.log('done');
        var Folderpath=newpath;
        //console.log(Folderpath);
        fs.readdir(Folderpath, function(err, items) {
            if(items.length>0){
            for (var i=0; i<items.length; i++) {
                var file = Folderpath+'/'  + items[i];
               fs.stat(file, generate_callback(file, i, items.length));
               //console.log(' Outside Filedetails: ', fileDetails);
            }
            function generate_callback(file, index, folderCount) {
                return function(err, stats) {
                    if('size' in stats){
                        console.log('Size in stats exists')
                    }
                    else{
                        console.log('Size in stats does not exists')
                    }
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
                        //console.log('Index: ', index);
                        //console.log('Folder Count', folderCount)

                        if(index+1 == folderCount){
                          //  console.log('Reached end of the list',i)
                            //console.log('Inside: ', fileDetails);
                            res.json({fileData:fileDetails});
                        }
                    }
            };
        }
        else
        {
            res.json(null);
        }
        });
        }
    });

});

router.post('/getFiles', function(req, res, next){
   // console.log("req body:",req);
    //console.log("UserId:",req.body.userId);
    //var UserFolder1=(__dirname+'/../');
    //console.log(UserFolder1);
    //var UserFolder=UserFolder1+"Users/"+req.body.userId;
    //console.log(UserFolder);

    var fileDetails = [];
    console.log("inside createfile route");
    console.log(__dirname);
    var UserFolder1=(__dirname+'/../');
    console.log(UserFolder1);
    var UserFolder=UserFolder1+"Users/"+req.body.userId;
    userIdGlobal = req.body.userId;
    console.log('---------->',UserFolder);

    fs.access(UserFolder, function(err) {
        if (err && err.code === 'ENOENT') {
            console.log("creating user folder");
            fs.mkdir(UserFolder,function(err)
            {
                if(err)
                console.log("error in creating directory");
                else{
                    console.log(UserFolder);
                console.log("directory is successfully created");
                fs.access(UserFolder, fs.constants.F_OK, (err) => {
                    console.log(`${UserFolder} ${err ? 'does not exist' : 'exists'}`);
                  });
                  var Folderpath=UserFolder;
                  fs.readdir(Folderpath, function(err, items) {
                      //console.log("items:", items);
                      if(items!=undefined && items.length>0 && items!=null){
                      for (var i=0; i<items.length; i++) {
                          var file = Folderpath +'/' + items[i];
                         fs.stat(file, generate_callback(file, i, items.length));
                        // console.log(' Outside Filedetails: ', fileDetails);
                      }
                      function generate_callback(file, index, folderCount) {
                          return function(err, stats) {
                              //console.log("stats",stats);
                              if('size' in stats){
                                  console.log('Size in stats exists')
                              }
                              else{
                                  console.log('Size in stats does not exists')
                              }
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
                          //        console.log('Index: ', index);
                            //      console.log('Folder Count', folderCount)
              
                                  if(index+1 == folderCount){
                              //        console.log('Reached end of the list',i)
                                //      console.log('Inside: ', fileDetails);
                                      res.json({fileData:fileDetails});
                                  }
                              }
                      };
                  }
                  else
                  {
                      res.json(null);
                  }
                  });
                }
            });
        }
        else
        {
            var Folderpath=UserFolder;
            fs.readdir(Folderpath, function(err, items) {
                //console.log("items:", items);
                if(items!=undefined && items.length>0 && items!=null){
                for (var i=0; i<items.length; i++) {
                    var file = Folderpath +'/' + items[i];
                   fs.stat(file, generate_callback(file, i, items.length));
                  // console.log(' Outside Filedetails: ', fileDetails);
                }
                function generate_callback(file, index, folderCount) {
                    return function(err, stats) {
                        //console.log("stats",stats);
                        if('size' in stats){
                            console.log('Size in stats exists')
                        }
                        else{
                            console.log('Size in stats does not exists')
                        }
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
                    //        console.log('Index: ', index);
                      //      console.log('Folder Count', folderCount)
        
                            if(index+1 == folderCount){
                        //        console.log('Reached end of the list',i)
                          //      console.log('Inside: ', fileDetails);
                                res.json({fileData:fileDetails});
                            }
                        }
                };
            }
            else
            {
                res.json(null);
            }
            });
        }


    });
});


var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
      console.log("dirname",__dirname);
      //GlobalFolderpath=__dirname+"/../Users/"+userIdGlobal;
        callback(null,__dirname+"/../Users/"+userIdGlobal);
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname);
    }
 });


  var upload = multer({ storage: Storage }).array("myfile", 1);

  router.post('/uploadFile', function(req, res) {
    var fileDetails=[];
    console.log('Upload route called');
    console.log(req.query);
    upload(req,res,function(err) {
        if(err) {
          console.log('Error uploading', err);
        }
        else{
          console.log('Uploaded Successfully');
        }
    });
    var Folderpath=GlobalFolderpath+"/"+userIdGlobal;
    console.log("Folder--->",GlobalFolderpath);
    //console.log("Folder--->",Folderpath);

    fs.readdir(Folderpath, function(err, items) {
      console.log("items==",items);
        if(items!=undefined && items.length>0 && items!=null){
        for (var i=0; i<items.length; i++) {
            var file = Folderpath+'/'  + items[i];
           fs.stat(file, generate_callback(file, i, items.length));
           //console.log(' Outside Filedetails: ', fileDetails);
        }
        function generate_callback(file, index, folderCount) {
            return function(err, stats) {
                if('size' in stats){
                    console.log('Size in stats exists')
                }
                else{
                    console.log('Size in stats does not exists')
                }
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
                    //console.log('Index: ', index);
                    //console.log('Folder Count', folderCount)

                    if(index+1 == folderCount){
                      //  console.log('Reached end of the list',i)
                        //console.log('Inside: ', fileDetails);
                        res.json({fileData:fileDetails});
                    }
                }
        };
    }
    else
    {
        res.json(null);
    }
    });

    //res.send('Work under progress');
  })

  // router.post('/uploadFile',function(req, res, next){
  //     console.log('------------------------')
  //     console.log(userIdGlobal);
  //     console.log(req.file);
  //     // upload(req,res,function(err) {
  //     //         if(err) {
  //     //           console.log('Error uploading', err);
  //     //         }
  //     //         else{
  //     //           console.log('Uploaded Successfully');
  //     //   }
  //     // });
  //     console.log('------------------------')
  //
  // });
module.exports = router;
