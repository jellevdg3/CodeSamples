Root = function()
{
    this.div = Document.CreateDiv(Document.Body);
    Document.title = "Jelle van der Gulik - Portfolio";

    new CoreRender(this.div);
}
