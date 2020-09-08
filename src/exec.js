/* const {execSync} = require('child_process');
var os = require('os');
var iconv = require('iconv-lite');

let OS = os.platform();

function folder(prompt) {
  let path;

  if (OS == 'win32') {
    try {
      path = execSync(
        `(new-object -COM 'Shell.Application').BrowseForFolder(0,'',0,0).Self.Path`,
        {shell: 'powershell',encoding :'utf-8'}
      );
      console.log(path);
    } catch (e) {
        path="";
      console.log(e);
      //path = e.output;
    }
    //path = iconv.decode(path, 'cp866');
  } else if (OS == 'linux')
    path = execSync(
      `zenity --file-selection --directory --title "${prompt}"`
    ).toString();
  else if (OS == 'darwin')
    path = execSync(
      `osascript -e 'POSIX path of (choose folder with prompt "${prompt}" with showing package contents)'`
    ).toString();

  path.trim();
  return path;
}

function file(prompt) {
  let path;

  if (OS == 'win32')
    path = iconv.decode(
      execSync(`.\\chooser.ps1 -title "${prompt}"`, {shell: 'powershell'}),
      'cp866'
    );
  else if (OS == 'linux')
    path = execSync(`zenity --file-selection --title "${prompt}"`);
  else if (OS == 'darwin')
    path = execSync(
      `osascript -e 'POSIX path of (choose file with prompt "${prompt}")'`
    );

  path.trim();
  return path;
}

module.exports = {folder, file};

// let prompt = "Select _Data folder.";

// console.log(file(prompt));
 */