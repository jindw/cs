var FS = require('fs');
function writeOnMissed(root,path,realpath){
	path = path.replace(/^\//,'');
	var file = root+path;
	var content = FS.readFileSync(require.resolve(realpath));
	if(content){
		try{
			var source = FS.readFileSync(file);
		}catch(e){}
		if(!source){
			mkdirSync(Path.resolve(dir))
			FS.writeFile(file, content);
		}
	}
}
exports.init = function(testServer,exports){
	var rbs = testServer.rbs;
	var root = rbs.root.replace(/[\\\/]?$/,'/');
	exports.setHtcPath = function(path){
		console.log('htc path is reset as: ',path,'\nhtc mimeType is required as: text/x-component')
		rbs.config.cs.htcPath = path;
		//writeOnMissed(root,path,'cs/static/cs.htc');
		return exports;
	}
	exports.setScriptPath = function(path){
		console.log('script path is reset as: ',path)
		rbs.config.cs.scriptPath = path;
		if(!path.match(/^https?\:\/\//)){
			//if(path.indexOf('/static/')!=0){//why?
			//var content = rbs.getContentAsBinary('/static/cs/lib/runtime/cs-exported.js').toString()
			//else{
			//writeOnMissed(root,path,'cs/lib/runtime/cs-exported.js');
		}
		return exports;
	}
	
	var querystring = require('querystring');  
	var http = require('http');  
	
	  
	function exportTo(output,options){
		var postData = genPostData(options)
		var options = {
			host: '127.0.0.1',
			port: testServer.port,
			"user-agent":'nodejs',
			'path':'/--export.zip',
	 		method: 'POST',
			headers: {  
				'Content-Type': 'application/x-www-form-urlencoded',  
				'Content-Length': postData.length  
			}  
		};
	
		var post = http.request(options,function(res){
			//console.log('STATUS: ' + res.statusCode);
			//console.log('HEADERS: ' + JSON.stringify(res.headers));
			console.log('write to:',output)
			var out = FS.createWriteStream(output);
			res.pipe(out);
			res.on('end',function(){
				console.log('close output:',output)
				//out.close()
			})
		});
		post.on('error', function(e) {
			console.dir(e)
			console.log("error: "+e.message,'\n',postData,postData.length );
		});
		post.write(postData);
		post.end();
	}
	exports.exportTo = function exportOuter(){
		var outerArgs = arguments
		if(testServer.port){
			exportTo.apply(this,outerArgs)
		}else{
			setTimeout(function(){
				exportOuter.apply(null,outerArgs);
			},1000)
		}
	}
}

function genPostData(options){
	if(options && options.branch){
		var postData = {  
		}; 
		if(options.branch.css){
			postData.cssBranch = true;
		}
		if(options.branch.js){
			postData.jsBranch = true;
		}
		if(options.branch.jsi){
			postData.jsiClosure = true;
		}
		return querystring.stringify(postData)
	}else{
		return "cssBranch=true"
	}
}