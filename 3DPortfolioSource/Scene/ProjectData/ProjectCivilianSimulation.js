ProjectCivilianSimulation = function(scene)
{
    this.scene = scene;

    this.id = "CivilianSim";
    this.displayName = "Civilian Sim";
    this.previewID = 3;
    this.videoFile = "Videos/CivilianSimulation.mp4";
    this.screenshots = 7;
    this.projectCode = "";
    this.description = "For my graduation I wanted to work on technical aspects such as Terrain Generation, AI, and Vertex Animations, in Unreal Engine 4. The terrain is dynamically generated during runtime.\nI can simulate and render tens of thousands civilians walking around, cutting trees, and placing houses.\n\nFor the project I received a 9 as a grade."; // For my graduation project I decided to create a civilian simulator in Unreal Engine 4.\nMy focus was:\n- Create an optimized vertex animation rendering system.\n- Create a dynamic terrain generator on runtime since Unreal only supports static terrain.
    this.specifics = "Year: 2018\nDuration: 5 months\nRole: Programmer\nTools: Unreal Engine 4, C++\nType: Graduation project";
    this.previewPosition = [0.0, 0.0, -4.6];
    this.nextProjectID = "Project1";

    this.container = this.scene.AddSceneContainer(this.id, 20, -250, [0, -8, 3.5], -0, 180);
    this.container.AddProjectView(this);

    // Decoration
    var civilan = this.container.AddMeshRenderer(new Mesh("Models/Civilian.obj"), this.scene.defaultLitMaterial, [5.0, 0.0, -1.13/2], [0.005, 0.005, 0.005], [Util.DegToRad(270), -Util.DegToRad(-45), 0]);
    civilan.SetColor(1, 0, 0, 1);
    civilan.shininess = 0.0;
    civilan.castShadow = false;
    var tree = this.container.AddMeshRenderer(new Mesh("Models/Tree.obj"), this.scene.defaultLitMaterial, [6.0, 1.0, -2.26/2], [0.01, 0.01, 0.01], [Util.DegToRad(270), -Util.DegToRad(15), 0]);
    tree.SetColor(0, 0.3, 0, 1);
}

Factory.Add(Factory.Projects, ProjectCivilianSimulation);
