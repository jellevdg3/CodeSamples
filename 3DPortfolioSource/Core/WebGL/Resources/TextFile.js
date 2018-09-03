TextFile = function(path, priority)
{
    this.path = path;
    this.priority = priority;

    // Defaults
    this.isLoading = false;
    this.hasLoaded = false;
    this.hasFailed = false;
    this.onLoadEvent = undefined;
    this.onFailedEvent = undefined;

    this.loadStartTime = 0;
    ResourceManager.AddResource(this);
}

TextFile.prototype.Load = function()
{
    if(this.isLoading != false)
    {
        Logger.LogWarning("Loading already started for " + this.path + ".");
        return;
    }

    this.isLoading = true;
    this.hasLoaded = false;
    this.loadStartTime = Util.GetTime();

    this.xhttp = new XMLHttpRequest();
    this.xhttp.open("GET", this.path, true);
    this.xhttp.setRequestHeader("Content-type", "text/html; charset=utf-8");
    this.xhttp.responseType = "text";

    // Events
    this.xhttp.onreadystatechange = new Event(this, this.OnReadyStateChange);

    this.xhttp.addEventListener("load", new Event(this, this.OnSuccess));
    this.xhttp.addEventListener("error", new Event(this, this.OnFailed));
    this.xhttp.addEventListener("abort", new Event(this, this.OnAbort));

    // Connect
    this.xhttp.send();
}

TextFile.prototype.GetContents = function()
{
    return this.xhttp.responseText;
}

// Events
TextFile.prototype.OnReadyStateChange = function(e)
{
    if(this.xhttp.readyState == 4 && this.xhttp.status == 200)
    {
        if(this.hasLoaded === false)
        {
            this.hasLoaded = true;
            this.hasFailed = false;

            this.loadEndTime = Util.GetTime();
            Logger.LogInfo("File " + this.path + " loaded in " + (this.loadEndTime - this.loadStartTime) + " milliseconds.");

            if(this.onLoadEvent != undefined)
            {
                this.onLoadEvent();
            }
            ResourceManager.OnResourceLoad(this);
        }
    }
}

TextFile.prototype.OnSuccess = function(e)
{
    if(this.hasLoaded === false)
    {
        this.hasLoaded = true;
        this.hasFailed = false;

        this.loadEndTime = Util.GetTime();
        Logger.LogInfo("File " + this.path + " loaded in " + (this.loadEndTime - this.loadStartTime) + " milliseconds.");

        if(this.onLoadEvent != undefined)
        {
            this.onLoadEvent();
        }
        ResourceManager.OnResourceLoad(this);
    }
}

TextFile.prototype.OnFailed = function(e)
{
    if (this.hasFailed === false)
    {
        this.hasFailed = true;
        this.hasLoaded = false;

        Logger.LogInfo("File " + this.path + " load failed.");

        if(this.onFailedEvent != undefined)
        {
            this.onFailedEvent();
        }
        ResourceManager.OnResourceLoad(this);
    }
}

TextFile.prototype.OnAbort = function(e)
{
    if (this.hasFailed === false)
    {
        this.hasFailed = true;
        this.hasLoaded = false;

        Logger.LogInfo("File " + this.path + " load failed.");

        if (this.onFailedEvent != undefined)
        {
            this.onFailedEvent();
        }
        ResourceManager.OnResourceLoad(this);
    }
}
