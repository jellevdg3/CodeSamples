ResourceManager = function() { }

ResourceManager.recourseList = [];
ResourceManager.recourseListMaxPriority = 0;
ResourceManager.resourceCount = 0;
ResourceManager.resourceLoadListIndex = 0;
ResourceManager.resourceLoadCount = 0;
ResourceManager.resourceGotoLoadCount = 0;

ResourceManager.hasStartedLoading = false;
ResourceManager.hasFinishedLoading = false;

ResourceManager.AddResource = function(res)
{
    if(res.priority == undefined) { res.priority = 99; }

    if(res.priority > ResourceManager.recourseListMaxPriority)
    {
        ResourceManager.recourseListMaxPriority = res.priority;
    }

    // Load instantly
    if(ResourceManager.hasStartedLoading == true)
    {
        res.Load();
    }
    else
    {
        if(ResourceManager.recourseList[res.priority] == undefined) { ResourceManager.recourseList[res.priority] = []; }
        ResourceManager.recourseList[res.priority].push(res);
        ResourceManager.resourceCount++;
        res._shouldResLoad = true;
    }
}

ResourceManager.OnResourceLoad = function(res)
{
    if(res._shouldResLoad === true)
    {
        res._shouldResLoad = false;
        
        ResourceManager.resourceLoadCount++;
        if(ResourceManager.resourceLoadCount == ResourceManager.resourceGotoLoadCount)
        {
            ResourceManager.InitializeNextPriorityList();
        }
    }
}

ResourceManager.StartLoad = function()
{
    ResourceManager.hasStartedLoading = true;
    ResourceManager.InitializeNextPriorityList();
}

ResourceManager.InitializeNextPriorityList = function()
{
    while(true)
    {
        ResourceManager.resourceLoadCount = 0;
        ResourceManager.resourceLoadListIndex++;
        var loadList = ResourceManager.recourseList[ResourceManager.resourceLoadListIndex];
        if(loadList != undefined)
        {
            ResourceManager.resourceGotoLoadCount = loadList.length;
            for(var i = 0; i < loadList.length; i++)
            {
                loadList[i].Load();
            }
            break;
        }

        if(ResourceManager.resourceLoadListIndex > ResourceManager.recourseListMaxPriority)
        {
            Logger.LogInfo("Done loading.");
            ResourceManager.hasFinishedLoading = true;
            break;
        }
    }
}
