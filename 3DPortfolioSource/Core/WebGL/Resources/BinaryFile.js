BinaryFile = function(path, doLoad, priority)
{
    this.path = path;
    this.priority = priority;

    this.index = 0;
    this.length = 0;
    this.currentBuffer = undefined;
    this.dataview = undefined;

    this.isLoading = false;
    this.hasLoaded = false;
    this.hasFailed = false;
    this.onLoadEvent = undefined;
    this.onFailedEvent = undefined;

    if (doLoad == undefined || doLoad === true)
    {
        ResourceManager.AddResource(this);
    }
}

BinaryFile.prototype.Load = function()
{
    if(this.isLoading != false)
    {
        Logger.LogWarning("Loading already started for " + this.path + ".");
        return;
    }

    this.isLoading = true;
    this.hasLoaded = false;
    this.loadStartTime = Util.GetTime();

    this.xhttp = new XMLHttpRequest();
    try
    {
        this.xhttp.open("GET", this.path, true);
        this.xhttp.setRequestHeader("Content-type", "application/octet-stream");
        this.xhttp.responseType = "arraybuffer";

        // Events
        this.xhttp.onreadystatechange = new Event(this, this.OnReadyStateChange);

        this.xhttp.addEventListener("load", new Event(this, this.OnSuccess));
        this.xhttp.addEventListener("error", new Event(this, this.OnFailed));
        this.xhttp.addEventListener("abort", new Event(this, this.OnAbort));


        // Connect
        try
        {
            this.xhttp.send();
        }
        catch(e)
        {
            this.OnFailed();
        }
    }
    catch(e)
    {
        this.OnFailed();
    }
}

BinaryFile.prototype.Save = function(url)
{
    if (this.isLoading != false)
    {
        Logger.LogWarning("Loading already started for " + this.path + ".");
        return;
    }

    this.xhttp = new XMLHttpRequest();
    this.xhttp.open("POST", url, true);

    // Events
    this.xhttp.addEventListener("load", new Event(this, this.SaveResult));
    this.xhttp.addEventListener("error", new Event(this, this.SaveResult));
    this.xhttp.addEventListener("abort", new Event(this, this.SaveResult));

    // Connect
    this.xhttp.send(this.currentBuffer);
}

BinaryFile.prototype.SaveResult = function()
{
}

BinaryFile.prototype.CreateBuffer = function(bytes)
{
    this.SetBuffer(new ArrayBuffer(bytes));
}

BinaryFile.prototype.SetBuffer = function(buffer)
{
    this.currentBuffer = buffer;
    this.dataview = new DataView(this.currentBuffer);

    this.index = 0;
    this.length = buffer.byteLength;
}

BinaryFile.prototype.HasNext = function()
{
    if(this.index == this.length)
    {
        return false;
    }

    return true;
}

// READ
BinaryFile.prototype.ReadByte = function()
{
    this.index += 1;
    return this.dataview.getUint8(this.index - 1);
}

BinaryFile.prototype.ReadShort = function()
{
    this.index += 2;
    return this.dataview.getInt16(this.index - 2, true);
}

BinaryFile.prototype.ReadInt = function()
{
    this.index += 4;
    return this.dataview.getInt32(this.index - 4, true);
}

BinaryFile.prototype.ReadFloat = function()
{
    this.index += 4;
    return this.dataview.getFloat32(this.index - 4, true);
}

BinaryFile.prototype.ReadBoolean = function()
{
    if(this.ReadByte() == 1)
    {
        return true;
    }
    else
    {
        return false;
    }
}

BinaryFile.prototype.ReadString = function()
{
    var length = this.ReadInt();
    var value = "";
    for(var i = 0; i < length; i++)
    {
        value += String.fromCharCode(this.readByte());
    }
    return value;
}

BinaryFile.prototype.ReadShortBuffer = function(count)
{
    this.index += count * 2;
    return new Uint16Array(this.currentBuffer, (this.index - (count * 2)), count);
}

BinaryFile.prototype.ReadIntBuffer = function (count) {
    this.index += count * 4;
    return new Uint32Array(this.currentBuffer, (this.index - (count * 4)), count);
}

BinaryFile.prototype.ReadFloatBuffer = function(count)
{
    this.index += count * 4;
    return new Float32Array(this.currentBuffer, (this.index - (count * 4)), count);
}

// WRITE
BinaryFile.prototype.WriteByte = function(b)
{
    this.index += 1;
    return this.dataview.setUint8(this.index - 1, b);
}

BinaryFile.prototype.WriteBoolean = function(b)
{
    if(b == true)
    {
        this.writeByte(1);
    }
    else
    {
        this.writeByte(0);
    }
}

BinaryFile.prototype.WriteShort = function(b)
{
    this.index += 2;
    return this.dataview.setInt16(this.index - 2, parseInt(b), true);
}

BinaryFile.prototype.WriteInt = function(b)
{
    this.index += 4;
    return this.dataview.setInt32(this.index - 4, parseInt(b), true);
}

BinaryFile.prototype.WriteFloat = function(b)
{
    this.index += 4;
    return this.dataview.setFloat32(this.index - 4, parseFloat(b), true);
}

BinaryFile.prototype.WriteString = function(b)
{
    var length = b.length;
    this.WriteInt(length);
    for(var i = 0; i < length; i++)
    {
        this.WriteByte(b.charCodeAt(i));
    }
}

// Events
BinaryFile.prototype.OnReadyStateChange = function(e)
{
    if(this.xhttp.readyState == 4 && this.xhttp.status == 200)
    {
        if(this.hasLoaded === false)
        {
            this.hasLoaded = true;

            this.loadEndTime = Util.GetTime();
            Logger.LogInfo("File " + this.path + " loaded in " + (this.loadEndTime - this.loadStartTime) + " milliseconds.");

            this.SetBuffer(this.xhttp.response);

            if(this.onLoadEvent != undefined)
            {
                this.onLoadEvent();
            }
            ResourceManager.OnResourceLoad(this);
        }
    }
}

BinaryFile.prototype.OnSuccess = function(e)
{
    if (this.xhttp.status == 404)
    {
        this.OnFailed();
        return;
    }

    if(this.hasLoaded === false)
    {
        this.hasLoaded = true;

        this.loadEndTime = Util.GetTime();
        Logger.LogInfo("File " + this.path + " loaded in " + (this.loadEndTime - this.loadStartTime) + " milliseconds.");

        this.SetBuffer(this.xhttp.response);

        if(this.onLoadEvent != undefined)
        {
            this.onLoadEvent();
        }
        ResourceManager.OnResourceLoad(this);
    }
}

BinaryFile.prototype.OnFailed = function(e)
{
    if (this.hasFailed === false)
    {
        this.hasFailed = true;
        this.hasLoaded = false;

        Logger.LogInfo("File " + this.path + " load failed.");

        if (this.onFailedEvent != undefined)
        {
            this.onFailedEvent();
        }
        ResourceManager.OnResourceLoad(this);
    }
}

BinaryFile.prototype.OnAbort = function(e)
{
    if (this.hasFailed === false)
    {
        this.hasFailed = true;
        this.hasLoaded = false;

        Logger.LogInfo("File " + this.path + " load failed.");

        if (this.onFailedEvent != undefined)
        {
            this.onFailedEvent();
        }
        ResourceManager.OnResourceLoad(this);
    }
}
