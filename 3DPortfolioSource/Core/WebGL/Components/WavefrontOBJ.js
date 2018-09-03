WavefrontOBJ = function(path, priority)
{
    this.path = path;
    this.priority = priority;
    
	// Data
	this.vertices = [];
	this.normals = [];
	this.uvs = [];
	this.faceVertices = [];
	this.faceNormals = [];
    this.faceUVs = [];

    this.meshOffsets = [];
    
    this.file = new TextFile(path, this.priority);
    this.file.onLoadEvent = new Event(this, this.Parse);

    this.onLoadEvent = undefined;
    this.onFailEvent = undefined;
}

WavefrontOBJ.prototype.Parse = function()
{
    var blob = this.file.GetContents();
	this.parseStartTime = Util.GetTime();

	// Data
	this.vertices = [];
	this.normals = [];
	this.uvs = [];
	this.faceVertices = [];
	this.faceNormals = [];
	this.faceUVs = [];
    
	// Text
	if (typeof blob === "string" || blob instanceof String)
	{
		var lines = blob.split(/\r?\n/);

		for(var i = 0; i < lines.length; i++)
		{
			// Split data row
			var data = lines[i].split(" ");
			
			switch(data[0])
			{
				case "v": if (data.length > 3) { this.vertices.push(+data[1]); this.vertices.push(+data[2]); this.vertices.push(+data[3]); } break;
				case "vn": if (data.length > 3) { this.normals.push(+data[1]); this.normals.push(+data[2]); this.normals.push(+data[3]); } break;
				case "vt": if (data.length > 2) { this.uvs.push(+data[1]); this.uvs.push(+data[2]); } break;

				case "f":
					if (data.length != 4)
					{
						Logger.LogWarning("Face count is not 3!");
						return;
					}

					for (var j = 0; j < 3; j++)
					{
						var indices = data[j + 1].split("/");
                        this.faceVertices.push(indices[0] - 1);
                        if(indices.length > 1)
                        {
                            this.faceUVs.push(indices[1] - 1);
                        }
                        if(indices.length > 2)
                        {
                            this.faceNormals.push(indices[2] - 1);
                        }
					}

					break;

                case "usemtl":
                    this.meshOffsets.push(this.faceVertices.length);

				default: break;
			}
		}
    }
    this.meshOffsets.push(this.faceVertices.length);
    this.meshOffsets._length = this.meshOffsets.length;

    this.ConvertVertexData();

	this.parseEndTime = Util.GetTime();

	var debugInfo = "";
	debugInfo += "Vertex count: " + (this.vertices.length / 3) + ". ";
	debugInfo += "Normal count: " + (this.normals.length / 3) + ". ";
	debugInfo += "UV count: " + (this.uvs.length / 2) + ". ";
    debugInfo += "Face vertex count: " + (this.faceVertices.length / 3) + ". ";

    Logger.LogInfo("Wavefront OBJ " + this.path + " parsed in " + (this.parseEndTime - this.parseStartTime) + " milliseconds. Vertex count: " + debugInfo);
    
    if(this.onLoadEvent != undefined)
    {
        this.onLoadEvent();
    }
}

WavefrontOBJ.prototype.ConvertVertexData = function()
{
    var newVertices = [];
    var newNormals = [];
    var newUVs = [];
    var newIndices = [];
    
    var total = this.faceVertices.length;
    for(var i = 0; i < total; i++)
    {
        newVertices.push(this.vertices[this.faceVertices[i] * 3 + 0]);
        newVertices.push(this.vertices[this.faceVertices[i] * 3 + 1]);
        newVertices.push(this.vertices[this.faceVertices[i] * 3 + 2]);

        newNormals.push(this.normals[this.faceNormals[i] * 3 + 0]);
        newNormals.push(this.normals[this.faceNormals[i] * 3 + 1]);
        newNormals.push(this.normals[this.faceNormals[i] * 3 + 2]);

        newUVs.push(this.uvs[this.faceUVs[i] * 2 + 0]);
        newUVs.push(this.uvs[this.faceUVs[i] * 2 + 1]);

        newIndices.push(i);
    }

    this.vertices = newVertices;
    this.normals = newNormals;
    this.uvs = newUVs;
    this.faceVertices = newIndices;

    this.vertices._length = this.vertices.length;
    this.normals._length = this.normals.length;
    this.uvs._length = this.uvs.length;
    this.faceVertices._length = this.faceVertices.length;
}
