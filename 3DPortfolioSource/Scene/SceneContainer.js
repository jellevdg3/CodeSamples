SceneContainer = function(name, scene, x, y, camPosition, camYaw, camPitch)
{
    this.name = name;
    this.scene = scene;
    this.x = x;
    this.y = y;
    if(camPosition != undefined) this.camPosition = [camPosition[0] - x, camPosition[1] - y, camPosition[2]];
    this.camYaw = camYaw;
    this.camPitch = camPitch;

    this.renderers = [];
    this.buttons = [];
    this.projectView = undefined;

    this.canBeNearest = true;

    this.selectedButton = undefined;
    this.selectedButtonDistance = -1;

    // Shadow box
    this.shadowX = (-this.x);
    this.shadowY = (this.y / 1.55) + 76;
    this.shadowW = 8;
    this.shadowH = 6;

    this.renderBoundingBoxes = true;

    // Bounding boxs
    this.boundingBoxes = [];
    this.boundingMeshBoxes = [];

    //this.boundingBoxes.push(this.AddMeshRenderer(this.scene.cubeMesh, this.scene.defaultLitMaterial, [5.0, 0.0, -0.1], [0.1, 0.1, 0.1]));
    //this.boundingBoxes.push(this.AddMeshRenderer(this.scene.cubeMesh, this.scene.defaultLitMaterial, [-5.0, 0.0, -0.1], [0.1, 0.1, 0.1]));
    //this.boundingBoxes.push(this.AddMeshRenderer(this.scene.cubeMesh, this.scene.defaultLitMaterial, [5.0, 0.0, -4.1], [0.1, 0.1, 0.1]));
    //this.boundingBoxes.push(this.AddMeshRenderer(this.scene.cubeMesh, this.scene.defaultLitMaterial, [-5.0, 0.0, -4.1], [0.1, 0.1, 0.1]));
}

SceneContainer.prototype.AddMeshRenderer = function(mesh, material, position, scale, rotation)
{
    if(position == undefined) position = [0.0, 0.0, 0.0];
    if(scale == undefined) scale = [1.0, 1.0, 1.0];
    if(rotation == undefined) rotation = [0.0, 0.0, 0.0];

    position[0] += this.x;
    position[1] += this.y;

    var renderer = new MeshRenderer(this, mesh, material);
    renderer.position = position;
    renderer.scale = scale;
    renderer.rotation = rotation;

    this.renderers.push(renderer);

    return renderer;
}

SceneContainer.prototype.AddMeshRendererChild = function(parent, mesh, material, position, scale, rotation)
{
    if(position == undefined) position = [0.0, 0.0, 0.0];
    if(scale == undefined) scale = [1.0, 1.0, 1.0];
    if(rotation == undefined) rotation = [0.0, 0.0, 0.0];

    var renderer = new MeshRenderer(this, mesh, material);
    renderer.position = position;
    renderer.scale = scale;
    renderer.rotation = rotation;

    parent.childeren.push(renderer);

    return renderer;
}

SceneContainer.prototype.AddBackgroundSimple = function(position, scale, color, texture)
{
    if(position == undefined) position = [0.0, 0.0, 0.0];
    if(scale == undefined) scale = [1.0, 1.0, 1.0];
    if(color == undefined) color = [1.0, 1.0, 1.0, 1.0];

    var background = this.AddMeshRenderer(this.scene.cubeMesh, this.scene.defaultLitMaterial, position, scale);
    background.SetColor(color[0], color[1], color[2], color[3], 0);
    if(texture != undefined)
    {
        background.texture = texture;
    }
}

SceneContainer.prototype.AddBoundingBox = function(position)
{
    this.boundingBoxes.push([position[0] + this.x, position[1] + this.y, position[2]]);

    if(this.renderBoundingBoxes == true)
    {
        this.boundingMeshBoxes.push(this.AddMeshRenderer(this.scene.cubeMesh, this.scene.defaultLitMaterial, [position[0], position[1], position[2]], [0.1, 0.1, 0.1]));
    }
}

SceneContainer.prototype.AddButtonSimple = function(text, position, scale, onButtonClick, texture)
{
    if(texture == undefined) { texture = this.scene.crateTexture };

    position[0] += this.x;
    position[1] += this.y;

    var button = new Button(this, position, scale, text, texture, onButtonClick);
    button.name = this.name + "/" + text + "/" + texture.path;
    this.buttons.push(button);

    return button;
}

SceneContainer.prototype.AddButtonCustom = function(text, position, scale, onButtonClick, mesh, texture)
{
    if(texture == undefined) { texture = this.scene.defaultTexture };

    position[0] += this.x;
    position[1] += this.y;

    var button = new Button(this, position, scale, text, texture, onButtonClick);
    button.cubeRenderer.mesh = mesh;
    button.cubeRenderer.SetColor(0, 0, 0, 1, 0);
    button.cubeRenderer.SetColor(5, 5, 5, 5, 1);
    button.cubeRenderer.rotation = [Util.DegToRad(-90), 0, 0];
    button.meshScale = [0.07, 0.07, 0.3];
    this.buttons.push(button);
    button.name = this.name + "/" + text + "/" + texture.path + "/" + mesh.objPath;

    return button;
}

SceneContainer.prototype.AddButtonSimpleTransparent = function(text, position, scale, onButtonClick, texture)
{
    if(texture == undefined) { texture = this.scene.crateTexture };

    position[0] += this.x;
    position[1] += this.y;

    var button = new Button(this, position, scale, text, texture, onButtonClick);
    button.cubeRenderer.transparency = true;
    button.cubeRenderer.material = this.scene.defaultUnlitMaterial;
    this.buttons.push(button);

    return button;
}

SceneContainer.prototype.CreateSkyBox = function(top, bottom, front, back, right, left)
{
    this.skyPlaneTop = this.AddMeshRenderer(this.scene.planeMesh, this.scene.skyBoxMaterial, [0.0, 0.0, -5000.0], [10000, 10000, 10000], [Util.DegToRad(90), Util.DegToRad(0), 0]);
    this.skyPlaneTop.texture = new Texture(top, 7);
    this.skyPlaneTop.uvScale = [1.0 - (2.0 / 1024), 1.0 - (2.0 / 1024)];
    this.skyPlaneTop.uvOffset = [1.0 / 1024, 1.0 / 1024];

    this.skyPlaneBottom = this.AddMeshRenderer(this.scene.planeMesh, this.scene.skyBoxMaterial, [0, 0, 5000], [10000, 10000, 10000], [Util.DegToRad(270), Util.DegToRad(0), 0]);
    this.skyPlaneBottom.texture = new Texture(bottom, 7);
    this.skyPlaneBottom.uvScale = [1.0 - (2.0 / 1024), 1.0 - (2.0 / 1024)];
    this.skyPlaneBottom.uvOffset = [1.0 / 1024, 1.0 / 1024];

    this.skyPlaneFront = this.AddMeshRenderer(this.scene.planeMesh, this.scene.skyBoxMaterial, [0, -5000, 0], [10000, 10000, 10000], [0, 0, 0]);
    this.skyPlaneFront.texture = new Texture(front, 7);
    this.skyPlaneFront.uvScale = [1.0 - (2.0 / 1024), 1.0 - (2.0 / 1024)];
    this.skyPlaneFront.uvOffset = [1.0 / 1024, 1.0 / 1024];

    this.skyPlaneBack = this.AddMeshRenderer(this.scene.planeMesh, this.scene.skyBoxMaterial, [0, 5000, 0], [10000, 10000, 10000], [0, 0, Util.DegToRad(180)]);
    this.skyPlaneBack.texture = new Texture(back, 7);
    this.skyPlaneBack.uvScale = [1.0 - (2.0 / 1024), 1.0 - (2.0 / 1024)];
    this.skyPlaneBack.uvOffset = [1.0 / 1024, 1.0 / 1024];

    this.skyPlaneRight = this.AddMeshRenderer(this.scene.planeMesh, this.scene.skyBoxMaterial, [5000, 0, 0], [10000, 10000, 10000], [0, 0, Util.DegToRad(90)]);
    this.skyPlaneRight.texture = new Texture(right, 7);
    this.skyPlaneRight.uvScale = [1.0 - (2.0 / 1024), 1.0 - (2.0 / 1024)];
    this.skyPlaneRight.uvOffset = [1.0 / 1024, 1.0 / 1024];

    this.skyPlaneLeft = this.AddMeshRenderer(this.scene.planeMesh, this.scene.skyBoxMaterial, [-5000, 0, 0], [10000, 10000, 10000], [0, 0, Util.DegToRad(270)]);
    this.skyPlaneLeft.texture = new Texture(left, 7);
    this.skyPlaneLeft.uvScale = [1.0 - (2.0 / 1024), 1.0 - (2.0 / 1024)];
    this.skyPlaneLeft.uvOffset = [1.0 / 1024, 1.0 / 1024];
}

SceneContainer.prototype.CreateSkyBox2 = function(container)
{
    var texture = new Texture(container);

    this.skyPlaneTop = this.AddMeshRenderer(this.scene.planeMesh, this.scene.defaultUnlitMaterial);
    this.skyPlaneTop.position = [0, 0, -5000];
    this.skyPlaneTop.scale = [10000, 10000, 10000];
    //this.skyPlaneTop.rotation = [Util.DegToRad(90), Util.DegToRad(270), 0];
    this.skyPlaneTop.rotation = [Util.DegToRad(90), Util.DegToRad(0), 0];
    this.skyPlaneTop.texture = texture;
    this.skyPlaneTop.uvScale = [0.25, 0.25];
    this.skyPlaneTop.uvOffset = [0.25, 0];

    this.skyPlaneBottom = this.AddMeshRenderer(this.scene.planeMesh, this.scene.defaultUnlitMaterial);
    this.skyPlaneBottom.position = [0, 0, 5000];
    this.skyPlaneBottom.scale = [10000, 10000, 10000];
    //this.skyPlaneBottom.rotation = [Util.DegToRad(270), Util.DegToRad(270), 0];
    this.skyPlaneBottom.rotation = [Util.DegToRad(270), Util.DegToRad(0), 0];
    this.skyPlaneBottom.texture = texture;
    this.skyPlaneBottom.uvScale = [0.25, 0.25];
    this.skyPlaneBottom.uvOffset = [0.25, 0.75];

    this.skyPlaneFront = this.AddMeshRenderer(this.scene.planeMesh, this.scene.defaultUnlitMaterial);
    this.skyPlaneFront.position = [0, -5000, 0];
    this.skyPlaneFront.scale = [10000, 10000, 10000];
    this.skyPlaneFront.rotation = [0, 0, 0];
    this.skyPlaneFront.texture = texture;
    this.skyPlaneFront.uvScale = [0.25, 0.25];
    this.skyPlaneFront.uvOffset = [0.25, 0];

    this.skyPlaneBack = this.AddMeshRenderer(this.scene.planeMesh, this.scene.defaultUnlitMaterial);
    this.skyPlaneBack.position = [0, 5000, 0];
    this.skyPlaneBack.scale = [10000, 10000, 10000];
    this.skyPlaneBack.rotation = [0, 0, Util.DegToRad(180)];
    this.skyPlaneBack.texture = texture;
    this.skyPlaneBack.uvScale = [0.75, 0.25];
    this.skyPlaneBack.uvOffset = [0.25, 0];

    this.skyPlaneRight = this.AddMeshRenderer(this.scene.planeMesh, this.scene.defaultUnlitMaterial);
    this.skyPlaneRight.position = [5000, 0, 0];
    this.skyPlaneRight.scale = [10000, 10000, 10000];
    this.skyPlaneRight.rotation = [0, 0, Util.DegToRad(90)];
    this.skyPlaneRight.texture = texture;
    this.skyPlaneRight.uvScale = [0.5, 0.25];
    this.skyPlaneRight.uvOffset = [0.25, 0];

    this.skyPlaneLeft = this.AddMeshRenderer(this.scene.planeMesh, this.scene.defaultUnlitMaterial);
    this.skyPlaneLeft.position = [-5000, 0, 0];
    this.skyPlaneLeft.scale = [10000, 10000, 10000];
    this.skyPlaneLeft.rotation = [0, 0, Util.DegToRad(270)];
    this.skyPlaneLeft.texture = texture;
    this.skyPlaneLeft.uvScale = [0, 0.25];
    this.skyPlaneLeft.uvOffset = [0.25, 0];
}

SceneContainer.prototype.AddText2DSimple = function(text, x, y, z, scale, color, font)
{
    x += this.x;
    y += this.y;

    if (font == undefined) { font = this.scene.testFont2D; }

    if(color == undefined) { color = [0, 0, 0, 1]; }
    var textRenderer = new FontRenderer(this, undefined, font, this.scene.defaultUnlitMaterial);
    textRenderer.dimensional = 2;
    textRenderer.SetText(text);
    textRenderer.SetPosition([x, y, z]);
    textRenderer.SetScale([scale, scale, scale]);
    textRenderer.SetColor(color);

    return textRenderer;
}

SceneContainer.prototype.AddText2DBounds = function(text, x, y, z, scale, color, boundX, font)
{
    var textField = this.AddText2DSimple(text, x, y, z, scale, color, font);
    textField.hasBounds = true;
    textField.boundX = boundX;
    return textField;
}

SceneContainer.prototype.AddText3DSimple = function(text, x, y, z, scale, color)
{
    x += this.x;
    y += this.y;

    if(color == undefined) { color = [1, 1, 1, 1]; }
    var textRenderer = new FontRenderer(this, undefined, this.scene.testFont2D, this.scene.buttonMaterial);
    textRenderer.SetText(text);
    textRenderer.SetPosition([x, y, z]);
    textRenderer.SetScale([scale, scale, scale]);
    textRenderer.SetColor(color);

    return textRenderer;
}

SceneContainer.prototype.AddProjectPreview = function()
{

}

SceneContainer.prototype.AddProjectView = function(projectData)
{
    if(projectData != undefined)
    {
        this.projectData = projectData;

        // Video
        if(projectData.videoFile != undefined)
        {
            projectData.video = new TextureVideo(projectData.projectCode + projectData.videoFile, 111);
            projectData.vidButton = projectData.container.AddButtonSimple("", [-3.55, 0.0, -4.15], [5.15, 0.1, 2.76], new Event(this, this.OnVideoClick), projectData.video);
            projectData.vidButton.mousePointer = "zoom-in";
            projectData.vidButton.projectData = projectData;
        }

        // Title
        projectData.titleTextField = projectData.container.AddText3DSimple(projectData.displayName, 0, 0, -6.3, 10);

        // Back button
        projectData.container.AddButtonSimple("Back", [5.5, -0.45, -2.165], [2, 1.0, 0.7], new Event(this, this.OnProjectViewBackClick));

        // Next button
        if(projectData.nextProjectID != undefined)
        {
            projectData.nextButton = projectData.container.AddButtonSimple("Next", [5.5, -0.45, -3.08], [2, 1.0, 1.0], new Event(this, this.OnProjectViewNextClick));
        }

        projectData.container.AddBackgroundSimple([3, -0.45, -4.645], [7.5, 1.0, 1.77], this.scene.projectDescriptionBackgroundColor, this.scene.projectDescriptionBackgroundTexture);
        projectData.container.AddBackgroundSimple([1.75, -0.45, -2.7], [5, 1.0, 1.77], this.scene.projectDescriptionBackgroundColor, this.scene.projectDescriptionBackgroundTexture);

        projectData.descriptionTextField = projectData.container.AddText2DBounds(projectData.description, -0.5, 0.06, -5.245, 2.2, this.scene.projectDescriptionTextColor, 3.2, this.scene.descriptionFont);
        projectData.descriptionTextField.SetAlignment(Align.LEFT);
        projectData.specificsTextField = projectData.container.AddText2DBounds(projectData.specifics, -0.5, 0.06, -3.3, 3.2, this.scene.projectDescriptionTextColor, 3.3, this.scene.descriptionFont);
        projectData.specificsTextField.SetAlignment(Align.LEFT);

        // Preview
        projectData.previewButton = this.scene.projectContainer.AddButtonSimple("", projectData.previewPosition, [4.0, 1.0, 2.0], new Event(this, this.OnPreviewClick), new Texture(projectData.projectCode + "Textures/Preview/Slide" + projectData.previewID + ".JPG", 6));
        projectData.previewButton.gotoContainer = this;

        // Screenshots
        this.AddScreenshots(projectData.projectCode, projectData.screenshots);

        // Bounding boxes
        projectData.container.AddBoundingBox([6.5, 0, -1.8]);
        projectData.container.AddBoundingBox([-7.8, 0, -1.8]);
        projectData.container.AddBoundingBox([6.5, 0, -6.5]);
        projectData.container.AddBoundingBox([-7.8, 0, -6.5]);
    }
}

SceneContainer.prototype.AddScreenshots = function(code, screenshotAmount)
{
    var posX = -1.8;
    var posZ = -2.25;
    for(var i = 0; i < screenshotAmount; i++)
    {
        var texture = new Texture(code + "Textures/Screenshots/" + this.name + "/Screenshot" + (i + 1) + ".jpg", 110);
        texture.Clamp();

        var button = this.AddButtonSimple("", [posX, 0.0, posZ], [1.7, 0.1, 0.9], undefined, texture);
        button.mousePointer = "zoom-in";
        button.onClick = new Event(this, this.OnScreenshotClick);
        button.index = i;

        if (i < 3)
        {
            posX -= 1.75;
        }
        else
        {
            posZ -= 0.95;
        }
    }
}

SceneContainer.prototype.RenderShadow = function(gl)
{
    for(var i = 0; i < this.renderers.length; i++)
    {
        this.renderers[i].RenderShadow(gl);
    }
}

SceneContainer.prototype.Render = function(gl)
{
    if(this.renderBoundingBoxes == true)
    {
        for(var i = 0; i < this.boundingMeshBoxes.length; i++)
        {
            var screenPos = this.scene.core.GetScreenLocation(this.scene.core.mvMatrix, this.boundingMeshBoxes[i].position);
            if(screenPos[0] < 0.0 || screenPos[0] > 1.0 || screenPos[1] < 0.0 || screenPos[1] > 1.0)
            {
                this.boundingMeshBoxes[i].SetColor(255, 0, 0);
            }
            else
            {
                this.boundingMeshBoxes[i].SetColor(255, 255, 255);
            }
        }
    }
    
    for(var i = 0; i < this.buttons.length; i++)
    {
        this.buttons[i].Render(gl);
    }

    for(var i = 0; i < this.renderers.length; i++)
    {
        this.renderers[i].Render(gl);
    }
}

// Events
SceneContainer.prototype.OnPreviewClick = function(button)
{
    if(button.gotoContainer != undefined && button.gotoContainer.projectData.video != undefined)
    {
        button.gotoContainer.projectData.video.Play();
    }

    if(button.gotoContainer != undefined)
    {
        this.scene.GotoSceneContainer(button.gotoContainer);
    }
}

SceneContainer.prototype.OnProjectViewNextClick = function(button)
{
    if(button.sceneContainer.projectData != undefined && button.sceneContainer.projectData.video != undefined)
    {
        button.sceneContainer.projectData.video.Pause();
    }

    if(button.gotoContainer != undefined)
    {
        button.gotoContainer.projectData.video.Play();
        this.scene.GotoSceneContainer(button.gotoContainer);
    }
}

SceneContainer.prototype.OnProjectViewBackClick = function(button)
{
    if(button.sceneContainer.projectData != undefined && button.sceneContainer.projectData.video != undefined)
    {
        button.sceneContainer.projectData.video.Pause();
    }
    this.scene.GotoSceneContainer(this.scene.projectContainer);
}

SceneContainer.prototype.OnScreenshotClick = function(button)
{
    if(this.scene.fullscreenDiv == undefined && button != undefined)
    {
        Style.MakeVisible(this.scene.imagePreviewFullscreen);
        Style.MakeAbsolute(this.scene.imagePreviewFullscreen);
        Style.SetPosition(this.scene.imagePreviewFullscreen, 0, 0);
        Style.SetSizePercent(this.scene.imagePreviewFullscreen, 100, 100);
        Style.SetBGColor(this.scene.imagePreviewFullscreen, "#000000");
        //Style.SetCursor(this.scene.imagePreviewFullscreen, "zoom-out");
        this.scene.screenShotLink = this.projectData.projectCode + "Textures/Screenshots/" + this.projectData.id + "/Screenshot";
        this.scene.screenShotIndex = button.index + 1;
        Style.SetBGTexture(this.scene.imagePreviewFullscreen, this.scene.screenShotLink + (this.scene.screenShotIndex) + ".jpg");
        
        this.scene.fullscreenDiv = this.scene.imagePreviewFullscreen;
        this.scene.UpdateFullscreenDiv();
    }
}

SceneContainer.prototype.OnVideoClick = function(button)
{
    if(button != undefined && button.projectData != undefined)
    {
        var video = button.projectData.video;

        if(video != undefined && video.videoDiv != undefined)
        {
            video.Play();
            Style.MakeVisible(video.videoDiv);
            Style.MakeAbsolute(video.videoDiv);
            Style.SetPosition(video.videoDiv, 0, 0);
            Style.SetSizePercent(video.videoDiv, 100, 100);
            Style.SetBGColor(video.videoDiv, "#000000");
            Style.SetCursor(video.videoDiv, "zoom-out");

            this.scene.fullscreenDiv = video.videoDiv;
            this.scene.UpdateFullscreenDiv();
        }
    }
}
