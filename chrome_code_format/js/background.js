window.nativeIO = document.getElementById("npApiPlugin");
chrome.runtime.onConnect.addListener(function(devToolsConnection) {
    // assign the listener function to a variable so we can remove it later
    var devToolsListener = function(message, sender, sendResponse) {
        
        saveFile(message.path,message.content);
    }
    // add the listener
    devToolsConnection.onMessage.addListener(devToolsListener);

//     devToolsConnection.onDisconnect.addListener(function() {
//          devToolsConnection.onMessage.removeListener(devToolsListener);
//     });
});

function saveFile(path,newContent){
    var byteArray = [];
    for (var i = 0; i < newContent.length; ++i)
    {
        byteArray.push(newContent.charCodeAt(i));
    }
    var blobInt8 = new Int8Array(byteArray);
    var blob = new Blob([blobInt8]); 
    
    var reader = new FileReader();
    reader.onloadend = function(e){
        var data = Array.prototype.slice.call(new Uint8Array(reader.result), 0);
        nativeIO.saveBlobToFile(path.replace(/^file:\/\//,""), data);
        console.log("success");
    };
    reader.readAsArrayBuffer(blob);
}