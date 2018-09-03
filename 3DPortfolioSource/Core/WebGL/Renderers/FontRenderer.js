FontRenderer = function(sceneContainer, parent, font, material)
{
    this.sceneContainer = sceneContainer;
	this.font = font;
	this.parent = parent;

    this.dimensional = 3;

    this.hasBounds = false;
    this.boundX = 0;

    this.scene = this.sceneContainer.scene;

    this.mesh = new Mesh();

    this.rotation = [0, 0, 0];

	if (parent != undefined)
	{
        this.meshRenderer = sceneContainer.AddMeshRendererChild(parent, this.mesh, material, [0.0, 0.0, 0.0], [1.0, 1.0, 1.0], [0.0, 0.0, 0.0]);
	}
	else
	{
        this.meshRenderer = sceneContainer.AddMeshRenderer(this.mesh, material, [0.0, 0.0, 0.0], [1.0, 1.0, 1.0], [0.0, 0.0, 0.0]);
    }

    this.castShadow = true;

    this.font.onFontLoadedEvent.push(new Event(this, this.OnResourceLoadedEvent));
    if (this.font.mesh != undefined)
    {
        this.font.mesh.onMeshLoadedEvent.push(new Event(this, this.OnResourceLoadedEvent));
    }
}

FontRenderer.prototype.TextSizeUntilSpace = function(textArray, curIndex)
{
    var offsetX = 0.0;
    for(var i = curIndex; i < textArray.length; i++)
    {
        var character = textArray[i];
        if(character === ' ' || character == '\n') return offsetX;

        var chdata = this.font.charData[character.charCodeAt()];

        if(chdata == undefined) continue;

        var x = chdata.x;
        var y = chdata.y;
        var w = chdata.w;
        var h = chdata.h;
        var s = chdata.s;
        var oy = chdata.oy;

        var sx = x / this.font.texture.width;
        var sy = y / this.font.texture.height;
        var sw = w / this.font.texture.width;
        var sh = h / this.font.texture.height;

        offsetX += sw + (1.0 / this.font.texture.width);
    }

    return offsetX;
}

FontRenderer.prototype.SetAlignment = function(align)
{
    this.meshRenderer.align = align;
}

FontRenderer.prototype.GetFontHeight = function()
{
    var character = 'a';
    var chdata = this.font.charData[character.charCodeAt()];

    if(chdata != undefined)
    {
        return chdata.h / this.font.texture.height * 2.0;
    }

    return 0.0;
}

FontRenderer.prototype.Generate2D = function()
{
	var newVertices = [];
	var newNormals = [];
	var newUVs = [];
	var newIndices = [];

    var offsetX = 0.0;
    var offsetY = 0.0;

    if(this.dimensional == 2)
    {
        this.meshRenderer.material = this.scene.defaultUnlitMaterial;
    }

	this.meshRenderer.texture = this.font.texture;
	this.meshRenderer.transparency = true;
    this.meshRenderer.castShadow = false;

    var fontHeight = this.GetFontHeight();

	for (var i = 0; i < this.text.length; i++)
	{
		var character = this.text[i];
        var pass = false;
        var forceNewLine = false;
        if(character === '\n') { character = 'a'; pass = true; forceNewLine = true; }
		if (character === ' ') { character = 'a'; pass = true; }

		var chdata = this.font.charData[character.charCodeAt()];

		if (chdata == undefined) continue;

		var x = chdata.x;
		var y = chdata.y;
		var w = chdata.w;
		var h = chdata.h;
		var s = chdata.s;
		var oy = chdata.oy;

		var tx1 = x / this.font.texture.width;
		var ty1 = 1.0 - y / this.font.texture.height;
		var tx2 = (w / this.font.texture.width) + tx1;
		var ty2 = (-h / this.font.texture.height) + ty1;

		var sx = x / this.font.texture.width;
		var sy = y / this.font.texture.height;
		var sw = w / this.font.texture.width;
		var sh = h / this.font.texture.height;

		var soy = chdata.oy / this.font.texture.height;

        if(this.hasBounds == true)
        {
            // New line?
            if(offsetX + this.TextSizeUntilSpace(this.text, i) > this.boundX || forceNewLine == true)
            {
                offsetX = 0.0;
                offsetY += fontHeight;

                if(pass) continue;
            }
        }

		if (pass === false)
		{
			// Plane
            newVertices.push(sw + offsetX);
			newVertices.push(-0.5);
            newVertices.push(soy + offsetY);
			newIndices.push(0);
			newUVs.push(tx2);
			newUVs.push(ty1);

            newVertices.push(offsetX);
			newVertices.push(-0.5);
            newVertices.push(soy + offsetY);
			newIndices.push(1);
			newUVs.push(tx1);
			newUVs.push(ty1);

            newVertices.push(offsetX);
			newVertices.push(-0.5);
            newVertices.push(sh + soy + offsetY);
			newIndices.push(2);
			newUVs.push(tx1);
			newUVs.push(ty2);

            newVertices.push(offsetX);
			newVertices.push(-0.5);
            newVertices.push(sh + soy + offsetY);
			newIndices.push(3);
			newUVs.push(tx1);
			newUVs.push(ty2);

            newVertices.push(sw + offsetX);
			newVertices.push(-0.5);
            newVertices.push(sh + soy + offsetY);
			newIndices.push(4);
			newUVs.push(tx2);
			newUVs.push(ty2);

            newVertices.push(sw + offsetX);
			newVertices.push(-0.5);
            newVertices.push(soy + offsetY);
			newIndices.push(5);
			newUVs.push(tx2);
			newUVs.push(ty1);
		}

        offsetX += sw + (1.0 / this.font.texture.width);
	}

	for (var i = 0; i < this.text.length * 18; i++)
	{
		newNormals[i] = 0;
	}

	// Finalize
	this.vertices = newVertices;
	this.normals = newNormals;
	this.uvs = newUVs;
	this.faceVertices = newIndices;

	this.vertices._length = this.vertices.length;
	this.normals._length = this.normals.length;
	this.uvs._length = this.uvs.length;
	this.faceVertices._length = this.faceVertices.length;

	this.meshOffsets = [this.faceVertices.length];
	this.meshOffsets._length = this.meshOffsets.length;

	this.mesh.obj = this;
	this.mesh.OnLoadOBJEvent();
}

FontRenderer.prototype.Generate3D = function()
{
	var newVertices = [];
	var newNormals = [];
	var newUVs = [];
	var newIndices = [];

	this.meshRenderer.transparency = false;
    this.meshRenderer.castShadow = this.castShadow;

	var indexer = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!.?_-+=/@#%";

	var offsetX = 0.0;
    
	for (var i = 0; i < this.text.length; i++)
	{
		var character = this.text[i];
		var pass = false;
		if (character === ' ') { character = 'a'; pass = true; }

		var chdata = this.font.charData[character.charCodeAt()];
		var index = indexer.indexOf(character);

		if (chdata == undefined || index == -1) continue;

		var x = chdata.x;
		var y = chdata.y;
		var w = chdata.w;
		var h = chdata.h;
		var s = chdata.s;
		var oy = chdata.oy;

		var tx1 = x / this.font.texture.width;
		var ty1 = 1.0 - y / this.font.texture.height;
		var tx2 = (w / this.font.texture.width) + tx1;
		var ty2 = (-h / this.font.texture.height) + ty1;

		var sx = x / this.font.texture.width;
		var sy = y / this.font.texture.height;
		var sw = w / this.font.texture.width;
		var sh = h / this.font.texture.height;

		var soy = chdata.oy / this.font.texture.height;

		var vertexStart = this.font.mesh.obj.meshOffsets[index];
		var vertexEnd = this.font.mesh.obj.meshOffsets[index + 1];
		var vertexCount = vertexEnd - vertexStart;

		// Bounding box
		var minX = 999999.0;
		var minY = 999999.0;
		var minZ = 999999.0;

		var maxX = -999999.0;
		var maxY = -999999.0;
		var maxZ = -999999.0;

		for (var j = 0; j < vertexCount; j++)
		{
			var index3 = j * 3 + 0 + vertexStart * 3;
			if (this.font.mesh.obj.vertices[index3 + 0] < minX) { minX = this.font.mesh.obj.vertices[index3 + 0]; }
			if (this.font.mesh.obj.vertices[index3 + 1] < minY) { minY = this.font.mesh.obj.vertices[index3 + 1]; }
			if (this.font.mesh.obj.vertices[index3 + 2] < minZ) { minZ = this.font.mesh.obj.vertices[index3 + 2]; }

			if (this.font.mesh.obj.vertices[index3 + 0] > maxX) { maxX = this.font.mesh.obj.vertices[index3 + 0]; }
			if (this.font.mesh.obj.vertices[index3 + 1] > maxY) { maxY = this.font.mesh.obj.vertices[index3 + 1]; }
			if (this.font.mesh.obj.vertices[index3 + 2] > maxZ) { maxZ = this.font.mesh.obj.vertices[index3 + 2]; }
		}

		if (pass === false)
		{
			for(var j = 0; j < vertexCount; j++)
			{
				var index2 = j * 2 + vertexStart * 2;
				var index3 = j * 3 + vertexStart * 3;

				newVertices.push(-this.font.mesh.obj.vertices[index3 + 2] - minZ);
				newVertices.push(this.font.mesh.obj.vertices[index3 + 0] - minX + offsetX);
				newVertices.push(-this.font.mesh.obj.vertices[index3 + 1]); // -minY
				newNormals.push(-this.font.mesh.obj.normals[index3 + 2]);
				newNormals.push(this.font.mesh.obj.normals[index3 + 0]);
				newNormals.push(-this.font.mesh.obj.normals[index3 + 1]);
				newUVs.push(this.font.mesh.obj.uvs[index2 + 0]);
				newUVs.push(this.font.mesh.obj.uvs[index2 + 1]);
				newIndices.push(j);
			}
		}

		offsetX += maxX - minX + 0.5;
	}

	// Finalize
	this.vertices = newVertices;
	this.normals = newNormals;
	this.uvs = newUVs;
	this.faceVertices = newIndices;

	this.vertices._length = this.vertices.length;
	this.normals._length = this.normals.length;
	this.uvs._length = this.uvs.length;
	this.faceVertices._length = this.faceVertices.length;

	this.meshOffsets = [this.faceVertices.length];
	this.meshOffsets._length = this.meshOffsets.length;
    
	this.mesh.obj = this;
    this.mesh.OnLoadOBJEvent();
}

FontRenderer.prototype.SetPosition = function(position)
{
	this.meshRenderer.position = position;
}

FontRenderer.prototype.SetRotation = function(rotation)
{
    this.rotation = rotation;
}

FontRenderer.prototype.SetColor = function(color)
{
    this.meshRenderer.SetColor(color[0], color[1], color[2], color[3], 0);
}

FontRenderer.prototype.SetScale = function (scale)
{
    if (this.dimensional == 3)
    {
        this.meshRenderer.scale = [scale[1] * 0.01, scale[0] * 0.01, scale[2] * 0.01];
    }
    else
    {
        this.meshRenderer.scale = scale;
    }
}

FontRenderer.prototype.SetText = function(text)
{
    this.text = text;

	if (this.font.doneLoading === true && this.previousText != this.text)
	{
	    if (this.dimensional == 2 && this.font.texture.isLoaded === true)
		{
		    this.previousText = this.text;
		    this.Generate2D();

		    this.meshRenderer.rotation = [this.rotation[0], this.rotation[1], this.rotation[2]];
		}
		
		if (this.dimensional == 3 && this.font.mesh.isLoaded === true)
		{
            this.previousText = this.text;
			this.Generate3D();

			this.meshRenderer.rotation = [this.rotation[0], this.rotation[1], -Util.DegToRad(90) + this.rotation[2]];
		}
	}
}

FontRenderer.prototype.SetTextIf = function(text, compareText)
{
    if(this.text == compareText)
    {
        this.SetText(text);
    }
}

// Events
FontRenderer.prototype.OnResourceLoadedEvent = function ()
{
    // Check if we need to generate text
    this.SetText(this.text);
}
