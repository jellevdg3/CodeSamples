function Event(instance, func)
{
    return function()
    {
        try
        {
            func.apply(instance, arguments);
        }
        catch (exception)
        {
            Logger.LogError(exception);
            if (Analytics.DoLogError == true)
            {
                Analytics.Queue("Error", exception.stack || exception);
            }
            document.write(exception.stack || exception);
        }
    };
};
