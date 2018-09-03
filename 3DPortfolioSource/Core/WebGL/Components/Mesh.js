Mesh = function(objPath, priority)
{
    this.objPath = objPath;
    this.priority = priority;

    this.isLoaded = false;
    
    if (this.objPath != undefined)
    {
        this.binPath = "Cache/" + this.objPath.replace(".obj", ".dat");
        this.bin = new BinaryFile(this.binPath, undefined, this.priority);

        this.bin.onLoadEvent = new Event(this, this.OnLoadBinaryEvent);
        this.bin.onFailedEvent = new Event(this, this.OnLoadFailedBinaryEvent);
    }

    this.onMeshLoadedEvent = [];
}

Mesh.prototype.CreateBuffersFromOBJ = function()
{
    // Obtain static gl
    var gl = Renderer.gl;

    this.startTime = Util.GetTime();

    // Create vertex buffer
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.obj.vertices), gl.STATIC_DRAW);
    this.vertexBuffer.itemSize = 3;
    this.vertexBuffer.numItems = this.obj.vertices._length / 3;

    // Create normal buffer
    this.normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.obj.normals), gl.STATIC_DRAW);
    this.normalBuffer.itemSize = 3;
    this.normalBuffer.numItems = this.obj.normals._length / 3;

    // Create UV buffer
    this.uvsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.obj.uvs), gl.STATIC_DRAW);
    this.uvsBuffer.itemSize = 2;
    this.uvsBuffer.numItems = this.obj.uvs._length / 2;

    // Create index buffer
    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.obj.faceVertices), gl.STATIC_DRAW);
    this.indexBuffer.itemSize = 1;
    this.indexBuffer.numItems = this.obj.faceVertices._length;

    this.endTime = Util.GetTime();

    //Logger.LogInfo("Vertex buffers created in:" + (this.endTime - this.startTime) + "ms.");
}

Mesh.prototype.CreateBuffersFromBinary = function()
{
    // Header
    var versionNumber = this.bin.ReadInt();

    if (versionNumber != 5)
    {
        Logger.LogInfo("BINARY FILE WRONG VERSION.");
        return false;
    }

    var vertexCount = this.bin.ReadInt();
    var normalCount = this.bin.ReadInt();
    var uvCount = this.bin.ReadInt();
    var indicesCount = this.bin.ReadInt();
    var submeshCount = this.bin.ReadInt();
    this.bin.ReadInt();
    this.bin.ReadInt();

    // Generate obj
    this.obj = {};
    this.obj.vertices = this.bin.ReadFloatBuffer(vertexCount);
    this.obj.normals = this.bin.ReadFloatBuffer(normalCount);
    this.obj.uvs = this.bin.ReadFloatBuffer(uvCount);
    this.obj.faceVertices = this.bin.ReadShortBuffer(indicesCount);
    this.obj.meshOffsets = this.bin.ReadIntBuffer(submeshCount);

    this.obj.vertices._length = vertexCount;
    this.obj.normals._length = normalCount;
    this.obj.uvs._length = uvCount;
    this.obj.faceVertices._length = indicesCount;
    this.obj.meshOffsets._length = submeshCount;

    // Obtain static gl
    var gl = Renderer.gl;

    this.startTime = Util.GetTime();

    // Create vertex buffer
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.obj.vertices, gl.STATIC_DRAW);
    this.vertexBuffer.itemSize = 3;
    this.vertexBuffer.numItems = this.obj.vertices._length / 3;

    // Create normal buffer
    this.normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.obj.normals, gl.STATIC_DRAW);
    this.normalBuffer.itemSize = 3;
    this.normalBuffer.numItems = this.obj.normals._length / 3;

    // Create UV buffer
    this.uvsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.obj.uvs, gl.STATIC_DRAW);
    this.uvsBuffer.itemSize = 2;
    this.uvsBuffer.numItems = this.obj.uvs._length / 2;

    // Create index buffer
    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.obj.faceVertices, gl.STATIC_DRAW);
    this.indexBuffer.itemSize = 1;
    this.indexBuffer.numItems = this.obj.faceVertices._length;

    this.endTime = Util.GetTime();

    //Logger.LogInfo("Vertex buffers created in: " + (this.endTime - this.startTime) + "ms.");

    return true;
}

Mesh.prototype.CalculateBounds = function()
{
    this.boundsMinX = 999999.0;
    this.boundsMinY = 999999.0;
    this.boundsMinZ = 999999.0;

    this.boundsMaxX = -999999.0;
    this.boundsMaxY = -999999.0;
    this.boundsMaxZ = -999999.0;

    for (var i = 0; i < this.obj.vertices._length; i += 3)
    {
        // Min
        if(this.obj.vertices[i + 0] < this.boundsMinX) this.boundsMinX = this.obj.vertices[i + 0];
        if(this.obj.vertices[i + 1] < this.boundsMinY) this.boundsMinY = this.obj.vertices[i + 1];
        if(this.obj.vertices[i + 2] < this.boundsMinZ) this.boundsMinZ = this.obj.vertices[i + 2];

        // Max
        if(this.obj.vertices[i + 0] > this.boundsMaxX) this.boundsMaxX = this.obj.vertices[i + 0];
        if(this.obj.vertices[i + 1] > this.boundsMaxY) this.boundsMaxY = this.obj.vertices[i + 1];
        if(this.obj.vertices[i + 2] > this.boundsMaxZ) this.boundsMaxZ = this.obj.vertices[i + 2];
    }

    this.boundsX = this.boundsMaxX - this.boundsMinX;
    this.boundsY = this.boundsMaxY - this.boundsMinY;
    this.boundsZ = this.boundsMaxZ - this.boundsMinZ;

    this.centerX = (this.boundsMinX + this.boundsMaxX) / 2;
    this.centerY = (this.boundsMinY + this.boundsMaxY) / 2;
    this.centerZ = (this.boundsMinZ + this.boundsMaxZ) / 2;
}

Mesh.prototype.SaveBinaryFile = function()
{
    if (Logger.logLevel >= LogLevel.DEBUG && this.binPath != undefined)
    {
        this.saveBinary = new BinaryFile(this.binPath, false);

        // Header
        var headerSize = 8 * 4;
        this.saveBinary.CreateBuffer((this.obj.vertices._length * 4) + (this.obj.normals._length * 4) + (this.obj.uvs._length * 4) + (this.obj.faceVertices._length * 2) + (this.obj.meshOffsets._length * 4) + headerSize);

        var vertexArray = Float32Array.from(this.obj.vertices);
        var normalArray = Float32Array.from(this.obj.normals);
        var uvArray = Float32Array.from(this.obj.uvs);
        var indexArray = Uint16Array.from(this.obj.faceVertices);
        var offsetArray = Uint32Array.from(this.obj.meshOffsets);

        this.saveBinary.WriteInt(5); // Version number
        this.saveBinary.WriteInt(this.obj.vertices._length); // Vertices
        this.saveBinary.WriteInt(this.obj.normals._length); // Normals
        this.saveBinary.WriteInt(this.obj.uvs._length); // UVs
        this.saveBinary.WriteInt(this.obj.faceVertices._length); // Indices
        this.saveBinary.WriteInt(this.obj.meshOffsets._length); // Submeshes
        this.saveBinary.WriteInt(0); // Fill
        this.saveBinary.WriteInt(0); // Fill

        for (var i = 0; i < this.obj.vertices._length; i++)
        {
            this.saveBinary.WriteFloat(vertexArray[i]);
        }
        for (var i = 0; i < this.obj.normals._length; i++)
        {
            this.saveBinary.WriteFloat(normalArray[i]);
        }
        for (var i = 0; i < this.obj.uvs._length; i++)
        {
            this.saveBinary.WriteFloat(uvArray[i]);
        }
        for (var i = 0; i < this.obj.faceVertices._length; i++)
        {
            this.saveBinary.WriteShort(indexArray[i]);
        }
        for (var i = 0; i < this.obj.meshOffsets._length; i++)
        {
            this.saveBinary.WriteInt(offsetArray[i]);
        }

        this.saveBinary.Save("SaveBinaryModel.php?path=" + this.binPath);

        Logger.LogInfo("Saving mesh of " + this.saveBinary.currentBuffer.byteLength + " bytes.");
    }
}

// Events
Mesh.prototype.OnLoadOBJEvent = function()
{
    this.CreateBuffersFromOBJ();
    this.CalculateBounds();
    this.SaveBinaryFile();

    this.isLoaded = true;
    for (var i = 0; i < this.onMeshLoadedEvent.length; i++)
    {
        this.onMeshLoadedEvent[i]();
    }
}

Mesh.prototype.OnLoadBinaryEvent = function ()
{
    var loadOBJ = true;
    try
    {
        loadOBJ = !this.CreateBuffersFromBinary();
        this.CalculateBounds();

        this.isLoaded = true;
    }
    catch(e)
    {
    }
    if(loadOBJ === true)
    {
        this.OnLoadFailedBinaryEvent();
    }
    else
    {
        for (var i = 0; i < this.onMeshLoadedEvent.length; i++)
        {
            this.onMeshLoadedEvent[i]();
        }
    }
}

Mesh.prototype.OnLoadFailedBinaryEvent = function ()
{
    this.obj = new WavefrontOBJ(this.objPath);
    this.obj.onLoadEvent = new Event(this, this.OnLoadOBJEvent);
}
