angular
    .module("fileOpera",["fileIO"])
    .factory("fileUpdate",["io",function(io){
        var devtools = chrome.devtools;
        var port = chrome.extension.connect(),
            devtoolsConsole = function(content){
                devtools.inspectedWindow.eval("console.dir("+JSON.stringify(content)+")");
            },
            //need escape char
            reg = /[\*|\.|\?|\+|\$|\^|\[|\]|\(|\)|\{|\}|\||\\|\/]/g,
            //trim and get \n,\x20,\t
            reg1 = /^(\n?)(\t*\x20*)(\S+)\s*\n$/,
            trim = function(str){
                return str.replace(reg1,"$3");
            },
            lastCon;
            
            io();
            
        return function(context){
                //listen resourceContentCommitted,and format code
                devtools.inspectedWindow.onResourceContentCommitted.addListener(function(resource,content){
                    var matchReg = [],
                        newContent,
                        compareCon = content;
                    
                    if(lastCon === compareCon){
                        return;
                    }else{
                        lastCon = compareCon;
                    }
                    
                    for(var k in context.formatMap){
                        matchReg.push(k.replace(reg,function(n){return "\\"+n;}));
                    }
                    
                    //generate regexp
                    matchReg = new RegExp("\\n?[\\t|\\x20]*("+matchReg.join("|")+")\\s*\\n","g");
        
                    if(matchReg.test(content)){
                        newContent = content.replace(matchReg,function(n){
                            var list = reg1.exec(n);
                            devtoolsConsole(list);
                            return ((list[1]+context.formatMap[trim(n)]).replace(/\n/g,"\n"+list[2])+"\n")||n;
                        });
                        devtoolsConsole(newContent);
                        resource.setContent(newContent,false,function(info){
                            if(info.isError){
                                devtoolsConsole(nativeIO.saveBlobToFile);
                                nativeIO.saveBlobToFile(details[0], content);
                            }
                            devtoolsConsole(info);
                        });
                    }
                });
                
               /* devtools.inspectedWindow.onResourceAdded.addListener(function(){
                    devtoolsConsole("fire resourceAdded");
                });
                */
                port.postMessage({
                    scriptToInject: 'js/content.js',
                    tabId: devtools.inspectedWindow.tabId
                });
        }
    }]);
