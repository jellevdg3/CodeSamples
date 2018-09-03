Renderer = function() { }

// Register this object to the factory
Factory.Add(Factory.SystemComponents, Renderer);

Renderer.RenderListeners = [];

Renderer.Initialize = function()
{
    Renderer.fps = 60.0;
    Renderer.interval = 1000.0 / (Renderer.fps);
    Renderer.lastUpdate = Util.GetTime();
    Renderer.lastRender = Util.GetTime();

    Renderer.deltaRender = 0;

    Renderer.isDirty = true;

    // FPS
    Renderer.lastFPSTime = 0;
    Renderer.curFrameCount = 0;
    Renderer.frameCount = 0;

    // Static gl
    Renderer.gl = undefined;

    //Renderer.lastFPSCount = Util.GetTime();
    //Renderer.curFPSCounter = 0;

    Renderer.InitializeAnimationFrame(Renderer.fps);

    // Start update loop
    Renderer.Render();
}

Renderer.AddRender = function(render)
{
    Renderer.RenderListeners.push(render);
}

Renderer.InitializeAnimationFrame = function(fps)
{
    if(!window.requestAnimationFrame)
    {
        window.requestAnimationFrame = (function()
        {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(callback, element)
                {
                    window.setTimeout(callback, 1000.0 / fps);
                };
        })();
    }
}

Renderer.Render = function()
{
    var curTime = Util.GetTime();
    var deltaTime = curTime - Renderer.lastUpdate;
    var renderDelta = curTime - Renderer.lastRender;
    Renderer.deltaRender += deltaTime;
    if (Renderer.deltaRender >= Renderer.interval || Renderer.isDirty === true)
    {
        Renderer.lastRender = curTime;
        Renderer.deltaRender -= Renderer.interval;

        if (Renderer.deltaRender > Renderer.interval * 3)
        {
            Renderer.deltaRender = 0;
        }

        //if(renderDelta > Renderer.interval * 4)
        {
            //Renderer.lastRender = curTime - Renderer.interval * 2;
        }

        // Render
        if (Window.Focused === true || Renderer.isDirty === true)
        {
            for(var i = 0; i < Renderer.RenderListeners.length; i++)
            {
                Renderer.RenderListeners[i].Render(renderDelta);
            }

            Renderer.curFrameCount++;
        }

        Renderer.isDirty = false;
    }

    Renderer.lastFPSTime += deltaTime;
    if (Renderer.lastFPSTime >= 1000)
    {
        Renderer.lastFPSTime = 0;
        Renderer.frameCount = Renderer.curFrameCount;
        Renderer.curFrameCount = 0;
        Logger.LogInfo("FPS: " + Renderer.frameCount);
    }
    
    Renderer.lastUpdate = curTime;
    window.requestAnimationFrame(Renderer.Render);
}
