module.exports = {
	"action" : function (project, action, object, data) {
		var toRetun = "";

		if(action == "url")
    	{
    		toRetun = "\n\t\t" + project + ".url(\"" + data + "\");"
    	}
    	else if(action == "setValue")
    	{
    		toRetun = "\n\t\t" + project + ".useXpath()." + action + "(\"" + object + "\",\"" + data + "\");"
    	}
    	else
    	{
    		toRetun = "\n\t\t" + project + ".useXpath()." + action + "(\"" + object + "\");"
    	}

		return toRetun;
	}
};