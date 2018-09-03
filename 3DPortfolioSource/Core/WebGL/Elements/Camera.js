Camera = function(renderer)
{
    this.renderer = renderer;

    this.startPosition = [2.35386381907356856, -4.654561004778062, 2.37855909823252];
    this.gotoPosition = [2.35386381907356856, -4.654561004778062, 2.37855909823252];
    this.position = [2.35386381907356856, -4.654561004778062, 2.37855909823252];

    this.forwardVector = [0.0, 0.0, 0.0];

    this.startYaw = 22.5;
    this.gotoYaw = 22.5;
    this.yaw = 22.5;

    this.startPitch = 188.5;
    this.gotoPitch = 188.5;
    this.pitch = 188.5;

    this.movementAlpha = 0.0;

    //this.pitch = 200.0;
    //this.yaw = 30.0;
    this.zoom = 100.0;

    this.lastMouseDown = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.lastScroll = Window.ScrollPosition;

    this.shouldSyncPosition = false;
    this.syncCooldown = 0;

    this.orbit = false;
}

Camera.prototype.SetViewMatrix = function(matrix, position, yaw, pitch)
{
    var pitchRad = Util.DegToRad(90 - pitch);
    var yawRad = Util.DegToRad(yaw);
    
    // Perspective
    var width = Window.Width;
    var height = Window.Height;
    var flip = false;
    var aspectRatio = width / height;
    if(width < height)
    {
        flip = true;

        width = Window.Height;
        height = Window.Width;
        aspectRatio = height / width;
    }

    mat4.identity(matrix);
    if(flip == true)
    {
        mat4.rotate(matrix, Util.DegToRad(90), [0, 1, 0]);
        mat4.rotate(matrix, pitchRad + Util.DegToRad(90), [0, -1, 0]);
        mat4.rotate(matrix, yawRad - Util.DegToRad(90), [0, 0, -1]);
    }
    else
    {
        mat4.rotate(matrix, pitchRad, [-1, 0, 0]);
        mat4.rotate(matrix, yawRad, [0, 0, -1]);
    }

    mat4.translate(matrix, position);
}

Camera.prototype.GetForward = function(yaw, pitch)
{
    var pitchRad = Util.DegToRad(90 - pitch);
    var yawRad = Util.DegToRad(yaw);
    
    var xForward = Math.sin(yawRad) * Math.sin(pitchRad);
    var yForward = -(Math.cos(yawRad) * Math.sin(pitchRad));
    var zForward = Math.cos(pitchRad);

    return [xForward, yForward, zForward];
}

Camera.prototype.StartRender = function(gl)
{
    this.movementAlpha += gl.delta / 1000.0 * 1.75;
    if (this.movementAlpha > 1.0) this.movementAlpha = 1.0;
    if (this.movementAlpha < 0.0) this.movementAlpha = 0.0;

    if(this.lastMouseDown != Window.LeftMouseDown)
    {
        this.lastMouseX = Window.MouseX;
        this.lastMouseY = Window.MouseY;

        this.lastMouseDown = Window.LeftMouseDown;
    }

    if(Window.LeftMouseDown === true && Window.cancelNextMouseMovement == 0)
    {
        var deltaX = Window.MouseX - this.lastMouseX;
        var deltaY = Window.MouseY - this.lastMouseY;

        if(Window.IsMobileBrowser() == true)
        {
            // Reverse on touch
            deltaX = -deltaX;
            deltaY = -deltaY;
        }

        if(Window.Width < Window.Height)
        {
            this.gotoYaw -= deltaY * 0.25;
            this.gotoPitch += deltaX * 0.25;
        }
        else
        {
            this.gotoYaw += deltaX * 0.25;
            this.gotoPitch += deltaY * 0.25;
        }

        if(deltaX != 0 || deltaY != 0)
        {
            this.shouldSyncPosition = true;
        }
    }
    
    if(this.orbit == true)
    {
        if(this.pitch < 180.2)
        {
            this.pitch = 180.2;
        }
    }

    if(this.pitch > 269)
    {
        this.pitch = 269.0;
    }

    this.lastMouseX = Window.MouseX;
    this.lastMouseY = Window.MouseY;

    this.zoom *= 1.0 - (this.lastScroll - Window.ScrollPosition) * 0.25;
    this.lastScroll = Window.ScrollPosition;

    /*
    if(this.position[2] > -5.0)
    {
        this.position[2] = -5.0;
    }

    if(this.position[2] < -5000.0)
    {
        this.position[2] = -5000.0;
    }
    */

    this.yaw = Interpolation.LerpEase(this.startYaw, this.gotoYaw, this.movementAlpha);
    this.pitch = Interpolation.LerpEase(this.startPitch, this.gotoPitch, this.movementAlpha);

    var pitchRad = Util.DegToRad(90 - this.pitch);
    var yawRad = Util.DegToRad(this.yaw);

    var absoluteX = -Math.sin(yawRad);
    var absoluteY = -Math.cos(yawRad);

    var xForward = Math.sin(yawRad) * Math.sin(pitchRad);
    var yForward = -(Math.cos(yawRad) * Math.sin(pitchRad));
    var zForward = Math.cos(pitchRad);
    
    this.renderer.forwardVector = [xForward, yForward, zForward];
    this.renderer.upVector = [yForward, xForward, zForward];
    this.renderer.rightVector = [absoluteY, absoluteX, 0.0];

    if (Window.keys[50] === true)
    {
        Logger.LogInfo("X: " + this.gotoPosition[0] + "; Y: " + this.gotoPosition[1] + "; Z: " + this.gotoPosition[2] + "; Yaw: " + this.yaw + "; Pitch: " + this.pitch + ".");
    }

    var speed = 0.4;

    if(Window.keys[87] === true)
    {
        this.gotoPosition[0] += this.renderer.forwardVector[0] * speed;
        this.gotoPosition[1] += this.renderer.forwardVector[1] * speed;
        this.gotoPosition[2] += this.renderer.forwardVector[2] * speed;

        this.orbit = false;
        this.shouldSyncPosition = true;
    }

    if(Window.keys[83] === true)
    {
        this.gotoPosition[0] -= this.renderer.forwardVector[0] * speed;
        this.gotoPosition[1] -= this.renderer.forwardVector[1] * speed;
        this.gotoPosition[2] -= this.renderer.forwardVector[2] * speed;

        this.orbit = false;
        this.shouldSyncPosition = true;
    }

    if(Window.keys[68] === true)
    {
        this.gotoPosition[0] += this.renderer.rightVector[0] * speed;
        this.gotoPosition[1] += this.renderer.rightVector[1] * speed;
        this.gotoPosition[2] += this.renderer.rightVector[2] * speed;

        this.orbit = false;
        this.shouldSyncPosition = true;
    }

    if(Window.keys[65] === true)
    {
        this.gotoPosition[0] -= this.renderer.rightVector[0] * speed;
        this.gotoPosition[1] -= this.renderer.rightVector[1] * speed;
        this.gotoPosition[2] -= this.renderer.rightVector[2] * speed;

        this.orbit = false;
        this.shouldSyncPosition = true;
    }
    
    this.position = Interpolation.LerpEase3(this.startPosition, this.gotoPosition, this.movementAlpha);
    this.renderer.positionVector = this.position;
    
    this.syncCooldown -= gl.delta / 1000.0;
    if(this.syncCooldown < 0 && this.shouldSyncPosition)
    {
        this.shouldSyncPosition = false;
        this.syncCooldown = 0.1;
        Analytics.Queue("CamPos", "" + this.gotoPosition[0] + "," + this.gotoPosition[1] + "," + this.gotoPosition[2] + "," + this.gotoYaw + "," + this.gotoPitch);
    }

    var width = Window.Width;
    var height = Window.Height;
    var flip = false;
    var aspectRatio = width / height;
    if(width < height)
    {
        flip = true;

        width = Window.Height;
        height = Window.Width;
        aspectRatio = height / width;
    }

    gl.viewport(0, 0, gl.width, gl.height);
    mat4.perspective(60, aspectRatio, 0.1, 10000.0, this.renderer.pMatrix);
    this.SetViewMatrix(this.renderer.mvMatrix, this.position, this.yaw, this.pitch);
}

Camera.prototype.EndRender = function(gl)
{
    mat4.identity(this.renderer.mvMatrix);
}
