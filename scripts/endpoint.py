import sys
import os
import re

args = sys.argv

if len(args) < 2:
    print "You need to supply a path for the endpoint\n"
else:
    path = args[1]
    template = "\'\"use strict\";\\nconst mysql = require(\"../../globals/sql_templating.js\");\\nconst Promise = require(\"bluebird\");\\nconst constants = require(\"../../globals/constants.js\");\\n\\nexports.endpoint = inst => inst.route({\\n\\tmethod: \"\",\\n\\tpath: \"\",\\n\\thandler: (request, response) => {\\n\\n\\t}\\n});\n\nfunction validate_request (requestBody) {\n\treturn new Promise((resolve, reject) => {\n\n\t});\n}\'";
    newPath = "./src/endpoints/" + path + ".js"
    if os.path.isfile(newPath):
        print "THAT PATH ALREADY EXISTS!\n"
    else:
        os.system("echo " + template + " > " + newPath)
        server = open("./server.js", "r+")
        serverNew = re.sub(r";([\s]*?\/\/START)", ";\nrequire(\"" + newPath + r'").endpoint(instance);\1', server.read())
        server.seek(0)
        server.write(serverNew)
        server.truncate()
        server.close()
