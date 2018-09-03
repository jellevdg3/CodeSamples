ProjectVoxelRenderer = function(scene)
{
    this.scene = scene;

    this.id = "VoxelWorld";
    this.displayName = "Voxel World";
    this.previewID = 1;
    this.videoFile = "Videos/VoxelRenderer.mp4";
    this.screenshots = 7;
    this.projectCode = "";
    this.description = "I had created voxel engines before but never in an existing engine so I wanted to try out how it would perform with the use of Unreal Engine 4.\n\nIt works great, the shadows look cool, and the performance is a lot better than expected, though I had to do a few tricks to get there.";
    this.specifics = "Year: 2018\nDuration: 1 week\nRole: Programmer\nTools: Unreal Engine 4, C++\nType: Hobby project";
    this.previewPosition = [-4.1, 0.0, -2.5];
    this.nextProjectID = "Project2";

    this.container = this.scene.AddSceneContainer(this.id, -100, -200, [0, -8, 3.5], -0, 180);
    this.container.AddProjectView(this);

    // Decoration
    /*var treeLeaves = this.container.AddMeshRenderer(new Mesh("Models/MinecraftTreeLeaves.obj"), this.scene.defaultLitMaterial, [6.0, 2.0, -4.0/2], [0.005, 0.005, 0.005], [Util.DegToRad(270), 0, 0]);
    var treeTrunk = this.container.AddMeshRenderer(new Mesh("Models/MinecraftTreeTrunk.obj"), this.scene.defaultLitMaterial, [6.0, 2.0, -1.0/2], [0.005, 0.005, 0.005], [Util.DegToRad(270), 0, 0]);
    treeLeaves.shininess = 0.0;
    treeTrunk.shininess = 0.0;
    treeLeaves.texture = new Texture("Textures/MinecraftTreeLeaves.png");
    treeTrunk.texture = new Texture("Textures/MinecraftTreeTrunk.png");*/
}

Factory.Add(Factory.Projects, ProjectVoxelRenderer);
