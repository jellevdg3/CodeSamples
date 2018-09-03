Startup = function()
{
    Startup.HasStarted = false;

    // Initialize the system components
    for (var i = 0; i < Factory.SystemComponents.length; i++)
    {
        Factory.SystemComponents[i].Initialize();
    }

    Document.CreateComment(Document.Body, " HTML and CSS Generated with JavaScript ");

    new Root();
    
    Window.OnURLChangeEvent(Window.location.href);
    Window.OnResizeEvent();
    Window.OnURLChangeEvent(Window.location.href);
    Window.OnResizeEvent();

    Startup.HasStarted = true;

    // Time taken to generate
    var deltaStartup = new Date().getTime() - loadStartTime;
    Logger.LogInfo("Startup time: " + deltaStartup + " milliseconds.");
}
