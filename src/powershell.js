var fs = require('fs');

function PowerShell() {
  this.BrowseForFolder = async function (Title) {
    var promise = new Promise(function (resolve, reject) {
      // ... some code

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
    });
    return promise;
  };

  this.SavaFile = (basepath, templatefilename, choose_tablename, replaces, savefolder) => {
    var Template_file = fs
      .readFileSync(basepath + '/template/' + templatefilename)
      .toString();
    //console.log(Template_file);
    var new_Template_file = Template_file;
    for (var i in replaces) {
      new_Template_file = new_Template_file.replace(replaces[i][0], replaces[i][1]);
    }
    console.log(new_Template_file);
    var newfilepath = savefolder + '/' + templatefilename.replace('tablename', choose_tablename);
    //console.log(`newfilepath:`+newfilepath);
    if (!fs.existsSync(savefolder)) fs.mkdirSync(savefolder);
    fs.writeFileSync(newfilepath, new_Template_file);
  };
}

//new PowerShell().BrowseForFolder();
module.exports = PowerShell;
