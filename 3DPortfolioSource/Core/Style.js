Style = function() { }

Style.MakeAbsolute = function(div)
{
    div.style.position = "absolute";
}

Style.MakeFixed = function(div)
{
    div.style.position = "fixed";
}

Style.MakeRelative = function(div)
{
    div.style.position = "relative";
}

Style.MakeHidden = function(div)
{
    div.style.display = "none";
}

Style.MakeVisible = function (div)
{
    div.style.display = "";
}

Style.SetCursor = function(div, cursor)
{
    div.style.cursor = cursor;
}

Style.SetZIndex = function (div, zindex)
{
    div.style.zIndex = zindex;
}

Style.SetSize = function(div, w, h)
{
    div.style.width = w + "px";
    div.style.height = h + "px";
}

Style.SetSizePercent = function(div, w, h)
{
    div.style.width = w + "%";
    div.style.height = h + "%";
}

Style.SetPosition = function(div, x, y)
{
    div.style.left = x + "px";
    div.style.top = y + "px";
}

Style.SetBGColor = function(div, color)
{
    div.style.backgroundColor = color;
}

Style.SetTextColor = function(div, color)
{
    div.style.color = color;
}

Style.AddLink = function(link, displayLink)
{
    if (displayLink == undefined) displayLink = link;
    return "<a tabindex='-1' target='_blank' href='" + link + "'>" + displayLink + "</a>";
}

Style.NewLine = function()
{
    return "<br>";
}

Style.NewParag = function()
{
    return "<br><br>";
}

Style.SetLinkColor = function(div, color)
{
    var links = div.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++)
    {
        if (links[i].href)
        {
            links[i].style.color = color;
        }
    }
}

Style.SetElementFont = function(div, element, font)
{
    var divs = div.getElementsByTagName(element);
    for (var i = 0; i < divs.length; i++)
    {
        divs[i].style.fontFamily = font;
    }
}

Style.SetBGTexture = function(div, texture)
{
    var path = texture;
    if (texture.path != undefined)
    {
        path = texture.path;
    }

    div.style.backgroundImage = "url('" + path + "')";
    div.style.backgroundRepeat = "no-repeat";
    div.style.backgroundPosition = "center";
    div.style.backgroundSize = "100% 100%";
}

Style.AddTexture = function(div, texture)
{
    var imgdiv = Document.CreateImage(div);
    imgdiv.src = texture.path;
    Style.MakeAbsolute(imgdiv);
    imgdiv.width = "1920";
    imgdiv.height = "1080";
    imgdiv.style.width = "100%";
    imgdiv.style.height = "100%";
    imgdiv.style.left = "0px";
    imgdiv.style.top = "0px";
    imgdiv.style.right = "-100%";
    imgdiv.style.bottom = "-100%";
    return imgdiv;
}

Style.SetTransition = function(div, transition)
{
    if (div.style.transform == undefined || div.style.transform == "")
    {
        Style.SetTransform(div, "scale(1.0,1.0)"); // forward optimization hack
    }

    div.style.transition = transition;

    // Support for other browsers
    div.style.webkitTransition = transition;
    div.style.msTransition = transition;
    div.style.oTransition = transition;
    div.style.mozTransition = transition;
}

Style.SetTransform = function(div, transform)
{
    transform += " translateZ(0px)"; // Optimization to enable 3D hardware accelerated rendering

    div.style.transform = transform;

    // Support for other browsers
    div.style.webkitTransform = transform;
    div.style.msTransform = transform;
    div.style.oTransform = transform;
    div.style.mozTransform = transform;
}
