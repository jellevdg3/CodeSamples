Util = function() { }

// Register this object to the factory
Factory.Add(Factory.SystemComponents, Util);

Util.Initialize = function()
{
}

Util.StartsWith = function(str, needle)
{
    return str.lastIndexOf(needle, 0) === 0;
}

Util.GetTime = function()
{
    return new Date().getTime();
}

Util.DegToRad = function(deg)
{
    return deg * Math.PI / 180.0;
}

Util.RadToDeg = function(rad)
{
    return rad / Math.PI * 180.0;
}
