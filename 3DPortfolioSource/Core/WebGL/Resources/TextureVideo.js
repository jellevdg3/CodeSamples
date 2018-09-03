TextureVideo = function(path, priority)
{
    this.path = path;
    this.priority = priority;
    
    this.isLoaded = false;
    this.playing = false;
    this.shouldPlay = false;

    this.firstFrame = true;

    this.videoDiv = Document.CreateVideo(Document.Body);

    // Black pixel
    this.image = new Image();
    this.image.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    this.image.onload = new Event(this, this.OnPreImageLoad);

    ResourceManager.AddResource(this);
}

TextureVideo.prototype.Load = function()
{
    this.videoDiv.src = this.path;
    this.videoDiv.play();
    ResourceManager.OnResourceLoad(this);
}

// Events
TextureVideo.prototype.OnPreImageLoad = function(e)
{
    // Static gl
    var gl = Renderer.gl;

    this.textureSource = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.textureSource);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    
    // Initialize video
    this.videoDiv.autoplay = false;
    this.videoDiv.muted = true;
    this.videoDiv.loop = true;
    this.videoDiv.controls = false;
    Style.MakeHidden(this.videoDiv);

    this.videoDiv.onplay = new Event(this, this.OnVideoPlay);
    this.videoDiv.ontimeupdate = new Event(this, this.OnVideoUpdate);
    
    this.videoDiv.pause();
    this.playing = false;
}

TextureVideo.prototype.Play = function()
{
    this.playing = true;
    this.shouldPlay = true;
    this.videoDiv.play();
}

TextureVideo.prototype.Pause = function()
{
    this.shouldPlay = false;
}

// Events
TextureVideo.prototype.OnVideoPlay = function(e)
{

}

TextureVideo.prototype.OnVideoUpdate = function(e)
{
    if(Window.Focused == false && this.playing == true)
    {
        this.playing = false;
        this.videoDiv.pause();
    }

    if(Window.Focused == true && this.playing == false && this.shouldPlay == true)
    {
        this.playing = true;
        this.videoDiv.play();
    }
    
    if(this.shouldPlay == false)
    {
        this.videoDiv.pause();
    }

    if(e == undefined)
    {
        // Static gl
        var gl = Renderer.gl;

        if((this.playing == true && this.shouldPlay == true) || this.firstFrame == true)
        {
            this.firstFrame = false;

            gl.bindTexture(gl.TEXTURE_2D, this.textureSource);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.videoDiv);
        }
    }
    else
    {
        this.isLoaded = true;
    }
}
