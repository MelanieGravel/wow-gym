

## Tweaks
Change Key Sender file with this line (*node_modules/node-key-sender/key-sender.js:115*)
```
var command = 'java -jar "' + jarPath + '" ' + arrParams.join(' ') + module.getCommandLineOptions();
```