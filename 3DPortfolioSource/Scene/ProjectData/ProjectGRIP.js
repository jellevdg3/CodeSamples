ProjectRaceGame = function(scene)
{
    this.scene = scene;
    
    this.id = "Project2";
    this.displayName = "";
    this.previewID = 5;
    this.videoFile = "Videos/Project2.mp4";
    this.screenshots = 7;
    this.projectCode = "";
    this.description = "";
    this.specifics = "";
    this.previewPosition = [-4.1, 0.0, -4.6];
    this.nextProjectID = "RacingAI";

    var code = "Gf84a1Oua40wjzW8IMDF";
    if(code != undefined) { this.projectCode = code + "/"; }

    this.container = this.scene.AddSceneContainer(this.id, -75, -250, [0, -8, 3.5], -0, 180);
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

Factory.Add(Factory.Projects, ProjectRaceGame);

ProjectRaceGame.prototype.onTitleTextLoad = function()
{
    var title = this.titleTextFile.GetContents();
    if(title.indexOf("404 Not Found") == -1)
    {
        this.titleTextField.SetText(title);
    }
}

ProjectRaceGame.prototype.onDescriptionTextLoad = function()
{
    var description = this.descriptionTextFile.GetContents();
    if(description.indexOf("404 Not Found") == -1)
    {
        this.descriptionTextField.SetText(description);
    }
}

ProjectRaceGame.prototype.onSpecificsTextLoad = function()
{
    var specifics = this.specificsTextFile.GetContents();
    if(specifics.indexOf("404 Not Found") == -1)
    {
        this.specificsTextField.SetText(specifics);
    }
}
