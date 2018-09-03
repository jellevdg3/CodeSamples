URLValidator = function() { }

// Register this object to the factory
Factory.Add(Factory.SystemComponents, URLValidator);

URLValidator.Initialize = function()
{
    Window.setInterval(URLValidator.OnUpdate, 50);

    URLValidator.Arguments = [];
    URLValidator.ArgumentsCache = [];

    URLValidator.OnUpdate();
}

URLValidator.GetArgument = function(argument)
{
    return URLValidator.ArgumentsCache[argument];
}

URLValidator.OnUpdate = function()
{
    var url = Window.location.href;
    if (Window.CurURL != url)
    {
        URLValidator.Arguments = [];
        if (url.indexOf('?') != -1)
        {
            var a = url.substr(url.indexOf('?') + 1);

            if (a.indexOf('&') == -1)
            {
                URLValidator.Arguments = [a];
            }
            else
            {
                URLValidator.Arguments = a.split('&');
            }

            for(var i = 0; i < URLValidator.Arguments.length; i++)
            {
                var seperator = URLValidator.Arguments[i].indexOf('=');
                if (seperator == -1) seperator = URLValidator.Arguments[i].length;
                var name = URLValidator.Arguments[i].substr(0, seperator);
                var value = URLValidator.Arguments[i].substr(seperator + 1);

                URLValidator.ArgumentsCache[name] = value || true;
            }
        }

        Window.OnURLChangeEvent(url);
    }
}
