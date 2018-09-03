ProjectRaceAI = function(scene)
{
    this.scene = scene;

    this.id = "RacingAI";
    this.displayName = "Racing AI";
    this.previewID = 2;
    this.videoFile = "Videos/RacingAI.mp4";
    this.screenshots = 7;
    this.projectCode = "";
    this.description = "During my vacation I worked on a racing AI for fun. The settings for the racing AI is dynamically generated using evolution and mutation algorithms.\n\nFor rendering I use OpenGL and I simulate 10.000 cars simultaneously without collision to find the best results as quickly as possible.";
    this.specifics = "Year: 2018\nDuration: 2 weeks\nRole: Programmer\nTools: OpenGL, C++\nType: Hobby project";
    this.previewPosition = [0.0, 0.0, -2.5];
    this.nextProjectID = "CivilianSim";

    this.container = this.scene.AddSceneContainer(this.id, -20, -200, [0, -8, 3.5], -0, 180);
    this.container.AddProjectView(this);

    // Decoration
    this.carBodyMesh = new Mesh("Models/CarBody.obj");
    this.carWheelMesh = new Mesh("Models/CarWheel.obj");

    // Test car
    this.carBodyRenderer = this.container.AddMeshRenderer(this.carBodyMesh, this.scene.defaultLitMaterial, [5.0, 1, -3.3 * 2.5 / 10], [0.5, 0.5, 0.5]);
    this.carBodyRenderer.rotation = [-Util.DegToRad(90), Util.DegToRad(-50.0), 0.0];
    this.carBodyRenderer.SetColor(0.7, 0.1, 0.1, 1.0, 1);
    this.carBodyRenderer.SetColor(1.0, 1.0, 1.0, 1.0, 0);
    this.carBodyRenderer.visible = true;

    // Test wheels
    var wheel;
    var wheelColor1 = [0.5, 0.5, 0.5, 1.0];
    var wheelColor2 = [0.0, 0.0, 0.0, 1.0];

    // Right front
    wheel = this.container.AddMeshRendererChild(this.carBodyRenderer, this.carWheelMesh, this.scene.defaultLitMaterial);
    wheel.position = [-2.1, 0.7, 3.2];
    wheel.SetColor(wheelColor1[0], wheelColor1[1], wheelColor1[2], wheelColor1[3], 0);
    wheel.SetColor(wheelColor2[0], wheelColor2[1], wheelColor2[2], wheelColor2[3], 1);

    // Left front
    wheel = this.container.AddMeshRendererChild(this.carBodyRenderer, this.carWheelMesh, this.scene.defaultLitMaterial);
    wheel.position = [2.1, 0.7, 3.2];
    wheel.rotation = [0.0, Util.DegToRad(180), 0.0];
    wheel.SetColor(wheelColor1[0], wheelColor1[1], wheelColor1[2], wheelColor1[3], 0);
    wheel.SetColor(wheelColor2[0], wheelColor2[1], wheelColor2[2], wheelColor2[3], 1);

    // Right back
    wheel = this.container.AddMeshRendererChild(this.carBodyRenderer, this.carWheelMesh, this.scene.defaultLitMaterial);
    wheel.position = [-2.1, 0.7, -3.7];
    wheel.SetColor(wheelColor1[0], wheelColor1[1], wheelColor1[2], wheelColor1[3], 0);
    wheel.SetColor(wheelColor2[0], wheelColor2[1], wheelColor2[2], wheelColor2[3], 1);

    // Left back
    wheel = this.container.AddMeshRendererChild(this.carBodyRenderer, this.carWheelMesh, this.scene.defaultLitMaterial);
    wheel.position = [2.1, 0.7, -3.7];
    wheel.rotation = [0.0, Util.DegToRad(180), 0.0];
    wheel.SetColor(wheelColor1[0], wheelColor1[1], wheelColor1[2], wheelColor1[3], 0);
    wheel.SetColor(wheelColor2[0], wheelColor2[1], wheelColor2[2], wheelColor2[3], 1);
}

Factory.Add(Factory.Projects, ProjectRaceAI);
