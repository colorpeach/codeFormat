angular
    .module("fileOpera",[])
    .factory("fileUpdate",[function(){
        var devtools = chrome.devtools;
        var nativeIO = document.getElementById("npApiPlugin");
        var port = chrome.extension.connect(),
            devtoolsConsole = function(content){
                devtools.inspectedWindow.eval("console.log("+JSON.stringify(content)+")");
            },
            //need escape char
            reg = /[\*|\.|\?|\+|\$|\^|\[|\]|\(|\)|\{|\}|\||\\|\/]/g,
            //trim and get \n,\x20,\t
            reg1 = /^(\n?)(\t*\x20*)(\S+)\s*\n$/,
            trim = function(str){
                return str.replace(reg1,"$3");
            },
            lastCon;
            
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
                        resource.setContent(newContent,false,function(info){
                            if(info.isError){
                                port.postMessage({
                                    path:info.details[0],
                                    content: newContent
                                });
                            }
                            devtoolsConsole(info);
                        });
                    }
                });
                
        }
    }]);
