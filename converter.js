var param = process.argv.slice(2);

var fs = require('fs');
var changeCase = require('change-case'); //for strings

var act = require('./actions.js'); //for actions

var steps, elementPath, dataUsed, maxSteps;
var option = [], page = [], action = [], object = [], data = [];

var testType = param[0], project = param[1], scriptName = param[2];

var header, body = "", footer, content;

try {
	var objectContents = fs.readFileSync('./Resources/ObjectRepository/' + changeCase.lowerCase(project) + "_web_controls.json");
	elementPath = JSON.parse(objectContents);
} catch (err){
	if (err.code === 'ENOENT') {
		console.log('Repository File not found!');
		return;
	}
}
	try {
	var dataContents = fs.readFileSync('./Resources/Test Data/data.json');
	dataUsed = JSON.parse(dataContents);
} catch (err){
	if (err.code === 'ENOENT') {
		console.log('Test Data File not found!');
		return;
	}
}


if(testType == "test")
{
	try {
		var scriptsContents = fs.readFileSync('./Data/' + project + '/' + scriptName + 'on');
		steps = JSON.parse(scriptsContents);
		maxSteps = steps["steps"].length;
	} catch (err){
		if (err.code === 'ENOENT') {
			console.log('Data Script File not found!');
			return;
		}
	}

	for(var y = 0; y<= maxSteps - 1; y++)
    {
    	option[y] = steps["steps"][y]["option"];
    	page[y] = steps["steps"][y]["page"];
		action[y] = steps["steps"][y]["action"];
		object[y] = elementPath [page[y]] [steps["steps"] [y] ["object"]];
		data[y] = dataUsed[project] [0] [steps["steps"] [y] ["data"]];
    }

    //compose js
    header = "module.exports = {\n\t\'" + scriptName + "\' : function(" + project + "){"
    
    //need to change this to lessen line of codes
    for(var x = 0; x<= maxSteps-1; x++)
    {
    	body += act.action(project, action[x], object[x], data[x]);
    }

    footer = "\n\t\t" + project + ".end();\n\t}\n};"

    content = header + body + footer;

    fs.writeFile(scriptName, content, function(error){
    	if(error){
    		return console.error(error);
    	}
    });

    var run = require('./node_modules/nightwatch/bin/runner.js');

}
else if (testType == "suite")
{
	try {
		var scriptsContents = fs.readFileSync('./Data/' + project + '/' + scriptName + 'on');
		steps = JSON.parse(scriptsContents);
		maxSteps = steps["scripts"] [0] ["scriptName"].length;
	} catch (err){
		if (err.code === 'ENOENT') {
			console.log('Data Script File not found!');
			return;
		}
	}
	
	if (maxSteps != 0)
	{
		fs.mkdir(scriptName.slice(0, scriptName.length -3),function(error){

		});
		for(var x = 0; x<= maxSteps-1;x++)
		{
			fs.writeFile(steps["scripts"] [0] ["scriptName"] [x], "test " + (x + 1), function(error){
    			if(error){
    				return console.error(error);
    			}
   			});
		}
	}
	else
	{
		console.log("Please check your test suite file.");
	}
	
}
else
{
	console.log("invalid run type: " + testType)
}