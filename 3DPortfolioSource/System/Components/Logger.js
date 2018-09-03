Logger = function() { }

// Register this object to the factory
Factory.Add(Factory.SystemComponents, Logger);

// Enum LogLevel
LogLevel =
{
    ALL: 9999,
    NONE: 0,
    ERROR: 1,
    WARNING: 2,
    INFO: 3,
    DEBUG: 4
}

Logger.Initialize = function()
{
    this.logLevel = LogLevel.ALL;

    Logger.LogInfo("Logger initialized.");
}

Logger.Log = function(text)
{
    // Source: http://stackoverflow.com/a/12612778
    var timeString = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, String.fromCharCode(36) + "1");
    console.log("[" + timeString + "]" + text);
}

Logger.Exception = function(text, e)
{
    // Source: http://stackoverflow.com/a/12612778
    var timeString = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, String.fromCharCode(36) + "1");

    if (console.error)
    {
        console.error(e.stack || e);
        //console.error(timeString + text + e.stack);
    }
    else
    {
        console.log(timeString + text + (e.stack || e));
    }
    //document.write(timeString + text + e.stack);
}

Logger.LogError = function(text)
{
    // Log error
    if(this.logLevel >= LogLevel.ERROR)
    {
        Logger.Exception("[ERROR]: ", text);
    }
    Analytics.Queue("LogError", text);
}

Logger.LogWarning = function(text)
{
    // Log error
    if(this.logLevel >= LogLevel.WARNING)
    {
        Logger.Log("[WARNING]: " + text);
    }
    Analytics.Queue("LogWarning", text);
}

Logger.LogInfo = function(text)
{
    // Log error
    if(this.logLevel >= LogLevel.INFO)
    {
        Logger.Log("[INFO]: " + text);
    }
    Analytics.Queue("LogInfo", text);
}

Logger.LogDebug = function(text)
{
    // Log error
    if(this.logLevel >= LogLevel.DEBUG)
    {
        Logger.Log("[DEBUG]: " + text);
    }
    Analytics.Queue("LogDebug", text);
}
