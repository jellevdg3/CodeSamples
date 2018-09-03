Document = document;

// Register this object to the factory
Factory.Add(Factory.SystemComponents, Document);

Document.Initialize = function()
{
    Document.Body = Document.body;
    Document.Head = Document.head;

    this.div = Document.Body;
    this.div.style = Document.Body.style;

    Document.Body.style.cursor = "default";
    Document.Body.style.overflow = "hidden";
    Document.Body.style.margin = "0px";
}

Document.CreateElement = function(type)
{
    var element = Document.createElement(type);
    element.style = element.style;

    return element;
}

Document.CreateDiv = function(parent)
{
    var div = Document.CreateElement("div");

    if (parent.div == undefined)
    {
        parent.appendChild(div);
    }
    else
    {
        parent.div.appendChild(div);
    }

    return div;
}

Document.CreateComment = function(parent, text)
{
    try
    {
        var comment = Document.createComment(text);
        parent.appendChild(comment);
        return comment;
    }
    catch(e)
    {
    }
    return undefined;
}

Document.CreateContainer = function(parent, x, y, w, h)
{
    var container = Document.CreateDiv(parent);
    Container.MakeContainer(container, x, y, w, h);
    return container;
}

Document.CreateSpan = function(parent)
{
    var span = Document.CreateElement("span");
    parent.appendChild(span);
    return span;
}

Document.CreateImage = function(parent)
{
    var img = Document.CreateElement("img");
    parent.appendChild(img);
    return img;
}

Document.CreateVideo = function(parent)
{
    var video = Document.CreateElement("video");
    parent.appendChild(video);
    return video;
}

Document.CreateCanvas = function(parent)
{
    var canvas = Document.CreateElement("canvas");
    parent.appendChild(canvas);
    return canvas;
}

Document.CreateIFrame = function(parent)
{
    var iframe = Document.CreateElement("iframe");
    parent.appendChild(iframe);
    return iframe;
}

Document.RemoveElement = function(element)
{
    element.parentNode.removeChild(element);
}
