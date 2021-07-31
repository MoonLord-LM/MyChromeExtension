
var log = function (){
    console.log('this is run in background.js');
}
log();
setInterval(log, 10000);
