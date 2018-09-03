Font2D = function(path, priority)
{
    this.path = path;
    this.priority = priority;

    this.texture = new Texture(path + ".png", this.priority);
    this.charDataFile = new BinaryFile(path + ".dat", undefined, this.priority);

    this.doneLoading = false;

    this.onFontLoadedEvent = [];
    
    this.charData = [];
    this.charDataFile.onLoadEvent = new Event(this, this.OnLoadCharData);
    this.texture.onTextureLoadEvent.push(new Event(this, this.OnTextureLoad));
}

Font2D.prototype.OnLoadCharData = function()
{
    // Stream
    var s = this.charDataFile;
    if(String.fromCharCode(s.ReadByte()) === "b") // Byte data
    {
        var size = s.ReadInt();
        
        for(var i = 0; i < size; i++)
        {
            var d = function() { };
            var ch = s.ReadByte();

            d.x = s.ReadShort();
            d.y = s.ReadShort();
            d.w = s.ReadShort();
            d.h = s.ReadShort();
            d.s = s.ReadShort();
            d.oy = s.ReadShort();

            this.charData[ch] = d;
        }
        
    }
    else
    {
        Logger.LogWarning("Font char data is not a byte data array.");
    }
    this.doneLoading = true;
    for (var i = 0; i < this.onFontLoadedEvent.length; i++)
    {
        this.onFontLoadedEvent[i]();
    }
}

Font2D.prototype.OnTextureLoad = function()
{
    for (var i = 0; i < this.onFontLoadedEvent.length; i++)
    {
        this.onFontLoadedEvent[i]();
    }
}
