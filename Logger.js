/*
 * Logger - Written by Jelle van der Gulik.
 * Used as a wrapper class to pass messages from the application to the browser console.
 * 
 * Example usage:
 * Logger.LogInfo("Hello world.");
 *
 * try
 * {
 *    // Some error
 * }
 * catch(e)
 * {
 *    Logger.LogError(e);
 * }
 */

Logger = function() { }

// Enum LogLevel.
LogLevel =
{
    ALL: 9999,
    NONE: 0,
    ERROR: 1,
    WARNING: 2,
    INFO: 3,
    DEBUG: 4
}

// Default log level.
Logger.logLevel = INFO;

// Log a message without any prefix.
Logger.Log = function(text)
{
    // Source: http://stackoverflow.com/a/12612778
    var timeString = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, String.fromCharCode(36) + "1");
    console.log("[" + timeString + "]" + text);
}

// Log an exception message. (Uses console.error if possible)
Logger.Exception = function(text, e)
{
    // Source: http://stackoverflow.com/a/12612778
    var timeString = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, String.fromCharCode(36) + "1");

    if (console.error)
    {
        console.error(e.stack || e);
    }
    else
    {
        console.log(timeString + text + (e.stack || e));
    }
	
	// Pass the error along to the application.
	Application.Error(e);
}

// Log an error message with ERROR prefix. Used when something goes very wrong. It is considered application-breaking and an error will appear on screen.
Logger.LogError = function(text)
{
    // Log error
    if(this.logLevel >= LogLevel.ERROR)
    {
        Logger.Exception("[ERROR]: ", text);
    }
}

// Log a warning message with WARNING prefix. Used when something goes wrong but is not considered application-breaking, so we will try to continue running the code.
Logger.LogWarning = function(text)
{
    // Log error
    if(this.logLevel >= LogLevel.WARNING)
    {
        Logger.Log("[WARNING]: " + text);
    }
}

// Log an info message with INFO prefix. Used to give info to the developer about important information.
Logger.LogInfo = function(text)
{
    // Log error
    if(this.logLevel >= LogLevel.INFO)
    {
        Logger.Log("[INFO]: " + text);
    }
}

// Log a debug message with DEBUG prefix. Not often used, except when debugging, will result in a large amount of debugging messages.
Logger.LogDebug = function(text)
{
    // Log error
    if(this.logLevel >= LogLevel.DEBUG)
    {
        Logger.Log("[DEBUG]: " + text);
    }
}
