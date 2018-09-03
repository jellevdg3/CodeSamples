Context = function(canvas)
{
    this.canvas = canvas;

    this.CreateContext(false);
    this.debugExt = this.glContext.getExtension("WEBGL_debug_renderer_info");
    this.gpuName = "Unknown.";

    this.cpuRenderingEnabled = false;

    if(Window.IsMobileBrowser() == true)
    {
        Logger.LogInfo("Phone detected!");
    }

    if(this.debugExt != undefined)
    {
        this.gpuName = this.glContext.getParameter(this.debugExt.UNMASKED_RENDERER_WEBGL);
        Logger.LogInfo("GPU found: " + this.gpuName + ".");
        if(this.gpuName != undefined)
        {
            if (this.gpuName.indexOf("SwiftShader") != -1)
            {
                Logger.LogInfo("CPU rendering detected!");
                this.cpuRenderingEnabled = true;
            }

            // Turn on anti-aliasing? Only if not mobile or rendering on the CPU
            if (Window.IsMobileBrowser() == false && this.cpuRenderingEnabled == false)
            {
                Logger.LogInfo("Enabling anti-aliasing.");
                this.canvas.Remove();
                this.canvas.Create();
                this.CreateContext(true);
            }
        }
    }
}

Context.prototype.CreateContext = function(antialias)
{
    var attributes = {};
    attributes.alpha = false;
    attributes.depth = true;
    attributes.stencil = false;
    attributes.preserveDrawingBuffer = true;
    attributes.antialias = antialias;

    this.glContext = this.canvas.GetDiv().getContext("experimental-webgl", attributes) || this.canvas.GetDiv().getContext("webgl", attributes);
    this.glContext.imageSmoothingEnabled = false;
    this.glContext.parentCanvas = this.canvas;
}

Context.prototype.GetGL = function()
{
    return this.glContext;
}

Context.prototype.Resize = function(width, height)
{
    var gl = this.GetGL();

    if(Window.devicePixelRatio == undefined) Window.devicePixelRatio = 1.0;

    width *= Window.devicePixelRatio;
    height *= Window.devicePixelRatio;

    gl.viewportWidth = width;
    gl.viewportHeight = height;

    gl.width = width;
    gl.height = height;
}
