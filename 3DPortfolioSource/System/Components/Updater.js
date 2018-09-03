Updater = function() { }

// Register this object to the factory
Factory.Add(Factory.SystemComponents, Updater);

Updater.UpdateListeners = [];

Updater.Initialize = function()
{
    //Updater.lastFPSCount = Updater.GetTime();
    //Updater.curFPSCounter = 0;

    //Updater.InitializeAnimationFrame(Updater.fps);

    // Start update loop
    //Updater.Tick();
}

Updater.InitializeAnimationFrame = function(fps)
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

Updater.Tick = function()
{
    /*
    var curTime = Updater.GetTime();
    var renderDelta = curTime - Updater.lastRender;
    if(renderDelta > Updater.interval)
    {
        Updater.lastRender += Updater.interval;

        if(renderDelta > Updater.interval * 4)
        {
            Updater.lastRender = curTime - Updater.interval * 2;
        }

        // Render
        for(var i = 0; i < Updater.RenderListeners.length; i++)
        {
            Updater.RenderListeners[i].Render(renderDelta);
        }
    }
    
    Updater.lastUpdate = curTime;
    window.requestAnimationFrame(Updater.Tick);
    */
}
