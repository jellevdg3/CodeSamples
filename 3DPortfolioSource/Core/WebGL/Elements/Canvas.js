Canvas = function(parent)
{
    this.parent = parent;
    this.Create();
}

Canvas.prototype.GetDiv = function()
{
    return this.canvas;
}

Canvas.prototype.Resize = function(width, height)
{
    this.canvas.width = width * Window.devicePixelRatio;
    this.canvas.height = height * Window.devicePixelRatio;

    Style.SetSize(this.canvas, width, height);
    Style.SetPosition(this.canvas, 0, 0);
}

Canvas.prototype.Create = function()
{
    this.canvas = Document.CreateCanvas(this.parent);
    Style.MakeFixed(this.canvas);
    Style.SetPosition(this.canvas, 0, 0);

    //this.canvas.style.imageRendering = "crisp-edges";
    //this.canvas.style.mozImageRendering = "-moz-crisp-edges";
    //this.canvas.imageSmoothingEnabled = false;
}

Canvas.prototype.Remove = function()
{
    Document.RemoveElement(this.canvas);
}
