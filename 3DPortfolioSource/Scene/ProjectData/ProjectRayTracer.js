ProjectRayTracer = function (scene)
{
    this.scene = scene;

    this.id = "RayTracer";
    this.displayName = "Real-time RayTracer";
    this.previewID = 4;
    this.videoFile = "Videos/Raytracer.mp4";
    this.screenshots = 7;
    this.projectCode = "";
    this.description = "During the summer I follow an extra course because I was curious about RayTracing. We worked in groups of 2 or 3, I worked together with Nathaniel Essenberg, and in 2 weeks time we created a RayTracer with the help of our teacher Jacco Bikker.\n\nWe implemented shadows, a BHV hierarchy, optimized with SIMD-AVX and ray packets. We received a price for best RayTracer of the class.";
    this.specifics = "Year: 2016\nDuration: 2 weeks\nRole: Programmer\nTools: C++, SIMD AVX\nType: Summer course";
    this.previewPosition = [4.1, 0.0, -2.5];
    this.nextProjectID = "VoxelWorld";

    this.container = this.scene.AddSceneContainer(this.id, 100, -200, [0, -8, 3.5], -0, 180);
    this.container.AddProjectView(this);

    // Decoration
    
}

Factory.Add(Factory.Projects, ProjectRayTracer);
