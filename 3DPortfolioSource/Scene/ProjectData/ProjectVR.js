ProjectVR = function(scene)
{
    this.scene = scene;
    
    this.id = "Project1";
    this.displayName = "";
    this.previewID = 6;
    this.videoFile = "Videos/Project1.mp4";
    this.screenshots = 7;
    this.projectCode = "";
    this.description = "";
    this.specifics = "";
    this.previewPosition = [4.1, 0.0, -4.6];
    this.nextProjectID = "RayTracer";

    var code = "jNSxstnhdD4cqjnaR8Qo";
    if(code != undefined) { this.projectCode = code + "/"; }

    this.container = this.scene.AddSceneContainer(this.id, 75, -250, [0, -8, 3.5], -0, 180);
    this.container.AddProjectView(this);

    // Coded title
    this.titleTextFile = new TextFile(this.projectCode + "Title.txt");
    this.titleTextFile.onLoadEvent = new Event(this, this.onTitleTextLoad);

    // Coded description
    this.descriptionTextFile = new TextFile(this.projectCode + "Description.txt");
    this.descriptionTextFile.onLoadEvent = new Event(this, this.onDescriptionTextLoad);

    // Coded project specifics
    this.specificsTextFile = new TextFile(this.projectCode + "Specifics.txt");
    this.specificsTextFile.onLoadEvent = new Event(this, this.onSpecificsTextLoad);

    // Decoration
}

Factory.Add(Factory.Projects, ProjectVR);

ProjectVR.prototype.onTitleTextLoad = function()
{
    var title = this.titleTextFile.GetContents();
    if(title.indexOf("404 Not Found") == -1)
    {
        this.titleTextField.SetText(title);
    }
}

ProjectVR.prototype.onDescriptionTextLoad = function()
{
    var description = this.descriptionTextFile.GetContents();
    if(description.indexOf("404 Not Found") == -1)
    {
        this.descriptionTextField.SetText(description);
    }
}

ProjectVR.prototype.onSpecificsTextLoad = function()
{
    var specifics = this.specificsTextFile.GetContents();
    if(specifics.indexOf("404 Not Found") == -1)
    {
        this.specificsTextField.SetText(specifics);
    }
}
