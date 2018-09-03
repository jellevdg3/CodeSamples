Texture = function(path, priority)
{
    this.path = path;
    this.priority = priority;

    this.image = new Image();

    this.isLoaded = false;

    this.onTextureLoadEvent = [];

    this.wrap = 0;

    if(path != undefined)
    {
        this.image.onload = new Event(this, this.OnLoadEvent);
        this.image.onerror = new Event(this, this.OnLoadFailedEvent);
    }
    else
    {
        this.image.onload = new Event(this, this.OnLoadEvent);
        this.image.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    }

    ResourceManager.AddResource(this);
}

Texture.prototype.Repeat = function()
{
    this.wrap = 0;
}

Texture.prototype.Clamp = function()
{
    this.wrap = 1;
}

Texture.prototype.Load = function()
{
    this.loadStartTime = Util.GetTime();

    if(this.path != undefined)
    {
        this.image.src = this.path;
    }
}

Texture.prototype.OnLoadEvent = function()
{
    // Static gl
    var gl = Renderer.gl;

    this.width = this.image.width;
    this.height = this.image.height;

    this.textureSource = gl.createTexture();

    var textureWrap = undefined;
    if (this.wrap == 0)
    {
        textureWrap = gl.REPEAT;
    }
    if(this.wrap == 1)
    {
        textureWrap = gl.CLAMP_TO_EDGE;
    }

    gl.bindTexture(gl.TEXTURE_2D, this.textureSource);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, textureWrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, textureWrap);
    gl.bindTexture(gl.TEXTURE_2D, null);

    this.loadEndTime = Util.GetTime();

    if(this.path != undefined)
    {
        Logger.LogInfo("Texture " + this.path + " loaded in " + (this.loadEndTime - this.loadStartTime) + " milliseconds.");
    }

    this.isLoaded = true;
    for (var i = 0; i < this.onTextureLoadEvent.length; i++)
    {
        this.onTextureLoadEvent[i]();
    }
    ResourceManager.OnResourceLoad(this);
}

Texture.prototype.OnLoadFailedEvent = function()
{
    ResourceManager.OnResourceLoad(this);
}
