angular
    .module("fileOpera",[])
    .factory("fileUpdate",[function(){
        var devtools = chrome.devtools;
        var port = chrome.extension.connect(),
            devtoolsConsole = function(content){
                devtools.inspectedWindow.eval("console.log('"+JSON.stringify(content)+"')");
            },
            //need escape char
            reg = /[\*|\.|\?|\+|\$|\^|\[|\]|\(|\)|\{|\}|\||\\|\/]/g,
            //trim and get \n,\s
            reg1 = /^(\s*\n?)(\t*\s*)(\S+)\s*\n$/,
            trim = function(str){
                return str.replace(reg1,"$3");
            },
            lastCon;
            devtoolsConsole(1);
            
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
                    matchReg = new RegExp("\\n?\\s*("+matchReg.join("|")+")\\s*\\n","g");
        
                    if(matchReg.test(content)){
                        newContent = content.replace(matchReg,function(n){
                            var list = reg1.exec(n);
                            devtoolsConsole(list);
                            return ((list[1]+context.formatMap[trim(n)]).replace(/\n/g,"\n"+list[2])+"\n")||n;
                        });
                        resource.setContent(newContent,false,function(err){
                            if(err)
                                devtoolsConsole(err);
                        });
                        devtools.inspectedWindow.getResources(function(resources){
                            devtoolsConsole(resources);
                        });
                    }
                });
                
                port.postMessage({
                    scriptToInject: 'js/content.js',
                    tabId: devtools.inspectedWindow.tabId
                });
        }
    }]);