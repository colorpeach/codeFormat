angular
    .module("fileIO",[])
    .factory("io",function(){
        var devtoolsConsole = function(content){
                chrome.devtools.inspectedWindow.eval("console.log("+JSON.stringify(content)+")");
            };
        return function(){
            var plugin = document.createElement("embed");
                plugin.setAttribute("type", "application/x-npapifileioforchrome");
                plugin.setAttribute("id", "npApiPlugin");
                plugin.style.position = "absolute";
                plugin.style.left = "-9999px";
                
            // Add plugin to document 
            document.documentElement.appendChild(plugin);

            window.nativeIO = document.getElementById("npApiPlugin");
            for(var n in nativeIO)
                devtoolsConsole(n);
        }
    });
