CoreRender = function(parent)
{
    this.parent = parent;

    // Create canvas
    this.canvas = new Canvas(this.parent);

    // Create context
    this.context = new Context(this.canvas);
    var gl = this.context.GetGL();
    this.gl = gl;
    Renderer.gl = this.gl;

    // Ray cast
    this.startMouseRay = [0, 0, 0];
    this.endMouseRay = [0, 0, 0];
    this.mouseRayDirection = [0, 0, 0];
    this.mouseRayDirectionLength = 0;
    
    // Register to window
    Window.AddResizeListener(this);

    // Register to the Renderer
    Renderer.AddRender(this);

    // Test scene
    this.renderers = [];

    this.pMatrix = mat4.create();
    this.mvMatrix = mat4.create();
    this.nMatrix = mat3.create();

    this.lightMVMatrix = mat4.create();
    this.lightPMatrix = mat4.create();

    this.mvMatrixStack = [];
    this.lightMVMatrixStack = [];

    this.camera = new Camera(this);

    // Lighting
    this.lightingDirection = [0.0, -0.8, 0.8];
    this.lightingRotation = Math.PI + (Math.PI / 2.0);
    
    // Shadow data
    this.shadowDepthTextureSize = 1024;

    this.shadowNextUpdate = 1.0;

    this.shadowFramebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.shadowFramebuffer);
    
    this.shadowDepthTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.shadowDepthTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.shadowDepthTextureSize, this.shadowDepthTextureSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    
    this.renderBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.shadowDepthTextureSize, this.shadowDepthTextureSize);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.shadowDepthTexture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderBuffer);
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    this.scene = new Scene(this);
    var nowebgl = Document.getElementById("nowebgl");
    if(nowebgl != undefined)
    {
        Document.Body.removeChild(nowebgl);
    }

    ResourceManager.StartLoad();
}

CoreRender.prototype.mvPushMatrix = function()
{
    var copy = mat4.create();
    mat4.set(this.mvMatrix, copy);
    this.mvMatrixStack.push(copy);
}

CoreRender.prototype.mvPopMatrix = function()
{
    this.mvMatrix = this.mvMatrixStack.pop();
}

CoreRender.prototype.lightMVPushMatrix = function()
{
    var copy = mat4.create();
    mat4.set(this.lightMVMatrix, copy);
    this.lightMVMatrixStack.push(copy);
}

CoreRender.prototype.lightMVPopMatrix = function()
{
    this.lightMVMatrix = this.lightMVMatrixStack.pop();
}

CoreRender.prototype.GetScreenLocation = function(matrix, position)
{
    var screenPos = [position[0], position[1], position[2], 1];
    mat4.multiplyVec4(matrix, screenPos, screenPos);

    var aspectRatio = Window.Width / Window.Height;

    var x = ((screenPos[0] / screenPos[2]) / aspectRatio) * 0.9;
    var y = (screenPos[1] / screenPos[2]) * 0.9;

    x += 0.5;
    y += 0.5;

    if(screenPos[2] > 0)
    {
        x = -x;
        y = -y;
    }

    return [x, y];
}

// Events
CoreRender.prototype.OnResizeEvent = function()
{
    this.canvas.Resize(Window.Width, Window.Height);
    this.context.Resize(Window.Width, Window.Height);
    this.scene.OResize();
}

CoreRender.prototype.Render = function(delta)
{
    var gl = this.gl;
    this.gl.delta = delta;

    // Update
    var textOffset = 9.5;
    
    this.lightingDirection = [Math.cos(this.lightingRotation), Math.sin(this.lightingRotation), 0.8];

    var nearestSceneContainer = this.scene.GetNearestSceneContainer([-this.camera.position[0], -this.camera.position[1], -this.camera.position[2]]);
    this.nearestSceneContainer = nearestSceneContainer;
    if(nearestSceneContainer == undefined)
    {
        return;
    }

    this.shadowNextUpdate -= delta * 0.1;
    if(this.shadowNextUpdate < 0.0)
    {
        this.shadowNextUpdate = 1.0;

        // Shadow pass
        gl.viewport(0, 0, this.shadowDepthTextureSize, this.shadowDepthTextureSize);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.shadowFramebuffer);

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        var x1 = -nearestSceneContainer.shadowW + nearestSceneContainer.shadowX;
        var x2 = nearestSceneContainer.shadowW + nearestSceneContainer.shadowX;
        var y1 = -nearestSceneContainer.shadowH + nearestSceneContainer.shadowY;
        var y2 = nearestSceneContainer.shadowH + nearestSceneContainer.shadowY;

        mat4.ortho(x1, x2, y1, y2, 0.1, 1000, this.pMatrix);
        mat4.lookAt([0, 0.0, -100.0], [this.lightingDirection[0] * 5000.0, this.lightingDirection[1] * 5000.0, this.lightingDirection[2] * 5000], [0, 1, 0], this.mvMatrix);

        this.scene.RenderShadow(gl);
    }
    
    // Main pass
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    this.camera.StartRender(gl);
    
    var x1 = -nearestSceneContainer.shadowW + nearestSceneContainer.shadowX;
    var x2 = nearestSceneContainer.shadowW + nearestSceneContainer.shadowX;
    var y1 = -nearestSceneContainer.shadowH + nearestSceneContainer.shadowY;
    var y2 = nearestSceneContainer.shadowH + nearestSceneContainer.shadowY;

    mat4.ortho(x1, x2, y1, y2, 0.1, 1000, this.lightPMatrix);
    mat4.lookAt([0, 0.0, -100.0], [this.lightingDirection[0] * 5000.0, this.lightingDirection[1] * 5000.0, this.lightingDirection[2] * 5000], [0, 1, 0], this.lightMVMatrix);

    this.scene.Render(gl);

    this.camera.EndRender(gl);

    gl.disable(gl.DEPTH_TEST);
}
