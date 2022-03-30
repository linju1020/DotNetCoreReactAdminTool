var fs = require('fs');
let OS = require('os').platform();

function PowerShell() {
  this.BrowseForFolder = async function (Title) {
    var promise = new Promise(function (resolve, reject) {
      // ... some code

      console.log(`OS:${OS}`);

      if (OS == "win32") {

        var psScript = `(new-object -COM 'Shell.Application').BrowseForFolder(0,'${Title}',529,0).self.path`;

        var spawn = require('child_process').spawn;
        var child = spawn('powershell', [psScript]);
        child.stdout.on('data', function (data) {
          //console.log('Powershell Data: ' + data);
          if (data.length > 0) {
            resolve(data.toString().replace('\r', '').replace('\n', ''));
          }
        });
        child.stderr.on('data', function (data) {
          //this script block will get the output of the PS script
          console.log('Powershell Errors: ' + data);
          reject(null);
        });
        child.on('exit', function () {
          //console.log('Powershell Script finished');
        });
        child.stdin.end(); //end
      }
      else if (OS == "darwin") {
        try {
          var execSync = require('child_process').execSync;
          let mac_path = execSync(`osascript -e 'POSIX path of (choose folder with prompt "${Title}" with showing package contents)'`).toString();
          if (mac_path.length > 0) {
            resolve(mac_path.toString().replace('\r', '').replace('\n', ''));
          }
        } catch (e) {
          console.log('darwin osascript Errors: ' + e);
          reject(null);
        }
      }
      else if (OS == "linux") {
        throw 'do net support Linux';
        reject(null);
      }
    });
    return promise;
  };

  this.SavaFile = (basepath, templatefilename, choose_tablename, replaces, savefolder) => {
    
    var new_Template_file = this.CreateFile(basepath, templatefilename, choose_tablename, replaces);

    var newfilepath = savefolder + '/' + templatefilename.replace(/tablename[0-9]{0,1}/, choose_tablename);
    //console.log(`newfilepath:`+newfilepath);
    if (!fs.existsSync(savefolder)) fs.mkdirSync(savefolder);
    fs.writeFileSync(newfilepath, new_Template_file);
  };

  this.CreateFile = (basepath, templatefilename, choose_tablename, replaces) => {
    var Template_file = fs
      .readFileSync(basepath + '/template/' + templatefilename)
      .toString();
    //console.log(Template_file);
    var new_Template_file = Template_file;
    for (var i in replaces) {
      new_Template_file = new_Template_file.replace(replaces[i][0], replaces[i][1]);
    }
    console.log(`######################################`);
    console.log(`######################################`);
    console.log(`###${choose_tablename}################`);
    console.log(new_Template_file);
    console.log(`###${choose_tablename}#END############`);
    console.log(`######################################`);
    console.log(`######################################`);
    return new_Template_file;
  };
}

//new PowerShell().BrowseForFolder();
module.exports = PowerShell;
