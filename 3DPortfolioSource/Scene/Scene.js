Scene = function(core)
{
    this.core = core;

    this.InitializeResources();
    
    this.sceneContainers = [];
    this.selectedContainer = undefined;

    this.fullscreenDiv = undefined;

    // Loading
    this.loading = Document.CreateDiv(Document.Body);
    Style.MakeVisible(this.loading);
    Style.MakeAbsolute(this.loading);
    Style.SetBGTexture(this.loading, "Textures/Loading.png");
    this.loading.style.opacity = 0.75;
    Style.SetZIndex(this.loading, 5);
    Style.SetSize(this.loading, Window.Height / 10 * 2.4, Window.Height / 10);

    this.imagePreviewFullscreen = Document.CreateDiv(Document.Body);
    Style.MakeHidden(this.imagePreviewFullscreen);
    
    // Arrows
    this.imagePreviewFullscreenArrowLeft = Document.CreateDiv(this.imagePreviewFullscreen);
    Style.MakeAbsolute(this.imagePreviewFullscreenArrowLeft);
    Style.SetSizePercent(this.imagePreviewFullscreenArrowLeft, 7, 30);
    Style.SetBGTexture(this.imagePreviewFullscreenArrowLeft, "Textures/ArrowLeft.png");
    this.imagePreviewFullscreenArrowLeft.style.top = "35%";
    this.imagePreviewFullscreenArrowLeft.style.opacity = 0.75;
    this.imagePreviewFullscreenArrowLeft.style.left = "2%";
    
    this.imagePreviewFullscreenArrowRight = Document.CreateDiv(this.imagePreviewFullscreen);
    Style.MakeAbsolute(this.imagePreviewFullscreenArrowRight);
    Style.SetSizePercent(this.imagePreviewFullscreenArrowRight, 7, 30);
    Style.SetBGTexture(this.imagePreviewFullscreenArrowRight, "Textures/ArrowRight.png");
    this.imagePreviewFullscreenArrowRight.style.top = "35%";
    this.imagePreviewFullscreenArrowRight.style.right = "2%";
    this.imagePreviewFullscreenArrowRight.style.opacity = 0.75;

    // Close
    this.closeButton = Document.CreateDiv(Document.Body);
    Style.MakeHidden(this.closeButton);
    Style.MakeAbsolute(this.closeButton);
    Style.SetBGTexture(this.closeButton, "Textures/Close.png");
    this.closeButton.style.opacity = 0.75;
    Style.SetZIndex(this.closeButton, 5);
    this.closeButton.style.cursor = "pointer";
    
    // Environment container
    this.environmentContainer = this.AddSceneContainer("Environment", 0, 0);
    this.environmentContainer.CreateSkyBox("Textures/Sky2/SkyTop.jpg", "Textures/Sky2/SkyBottom.jpg", "Textures/Sky2/SkyFront.jpg", "Textures/Sky2/SkyBack.jpg", "Textures/Sky2/SkyRight.jpg", "Textures/Sky2/SkyLeft.jpg");
    this.environmentContainer.canBeNearest = false;
    this.floor = this.environmentContainer.AddMeshRenderer(this.planeMesh, this.defaultLitMaterial, [0.0, 0.0, 0.0], [1000.0, 0.0, 1000.0], [-Util.DegToRad(90), 0.0, 0.0]);
    this.floor.texture = this.grassTexture;
    this.floor.uvScale = [110.0, 110.0];
    this.floor.shininess = 0.0;
    this.floor.SetColor(1.0, 1.0, 1.0, 1.0, 0);
    this.floor.castShadow = false;

    // Home container
    this.homeContainer = this.AddSceneContainer("Home", 0, 0, [2.4, -4.6, 1.5], 22.5, 188.5);
    this.homeContainer.AddText3DSimple("Portfolio", 0.0, 0.0, -3.0, 10);
    this.homeContainer.AddText3DSimple("Jelle van der Gulik - Game Programmer", 0.0, 0.0, -2.2, 2.5);

    this.homeContainer.AddText3DSimple("Custom written website in 3D, using WebGL and JavaScript", 0.0, 1.0, -0.08, 1.0);

    this.homeContainer.AddButtonSimple("AboutMe", [-3, -0.0, -1.0], [2.0, 1.0, 1.0], new Event(this, this.OnAboutMeButtonClick));
    this.homeContainer.AddButtonSimple("Projects", [0, 0.0, -1.0], [3.0, 1.5, 1.5], new Event(this, this.OnProjectsButtonClick));
    this.homeContainer.AddButtonSimple("Contact", [3, 0.0, -1.0], [2.0, 1.0, 1.0], new Event(this, this.OnContactButtonClick));

    this.homeContainer.AddBoundingBox([4, 0, -0.1]);
    this.homeContainer.AddBoundingBox([-4, 0, -0.1]);
    this.homeContainer.AddBoundingBox([4, 0, -3.3]);
    this.homeContainer.AddBoundingBox([-4, 0, -3.3]);

    // Project container
    this.projectContainer = this.AddSceneContainer("Projects", 0, -100, [0.0, -7.4, 3.5], 0, 180);
    this.projectContainer.AddText3DSimple("Projects", 0, 0, -6.6, 10);
    this.projectContainer.AddButtonSimple("Back", [0, 0.0, -0.55], [2.0, 1.0, 1.0], new Event(this, this.OnProjectsBackButtonClick));

    this.projectContainer.AddBoundingBox([6.5, 0, -0.1]);
    this.projectContainer.AddBoundingBox([-6.5, 0, -0.1]);
    this.projectContainer.AddBoundingBox([6.5, 0, -7.3]);
    this.projectContainer.AddBoundingBox([-6.5, 0, -7.3]);

    // Contact container
    this.contactContainer = this.AddSceneContainer("Contact", 100, -100, [4, -5, 2.2], 34, 180);
    this.contactTitle = this.contactContainer.AddText3DSimple("Contact", 0, 0, -4.3, 10);

    var contactButton = undefined;
    contactButton = this.contactContainer.AddButtonCustom("", [-3.0, 0.0, -3.0], [1.2, 1.2, 1.2], new Event(this, this.OnContactGotoMail), new Mesh("Models/Social/Gmail.obj"));
    contactButton.onHoveredChange = new Event(this, this.OnContactGotoMailHovered);
    contactButton = this.contactContainer.AddButtonCustom("", [-1.5, 0.0, -3.0], [1.0, 1.0, 1.0], new Event(this, this.OnContactGotoSteam), new Mesh("Models/Social/Steam.obj"));
    contactButton.onHoveredChange = new Event(this, this.OnContactGotoSteamHovered);
    contactButton = this.contactContainer.AddButtonCustom("", [0.0, 0.0, -3.0], [1.0, 1.0, 1.0], new Event(this, this.OnContactGotoTelegram), new Mesh("Models/Social/Telegram.obj"));
    contactButton.onHoveredChange = new Event(this, this.OnContactGotoTelegramHovered);
    contactButton = this.contactContainer.AddButtonCustom("", [1.5, 0.0, -3.0], [1.0, 1.0, 1.0], new Event(this, this.OnContactGotoDiscord), new Mesh("Models/Social/Discord.obj"));
    contactButton.onHoveredChange = new Event(this, this.OnContactGotoDiscordHovered);
    contactButton = this.contactContainer.AddButtonCustom("", [3.0, 0.0, -3.0], [1.0, 1.0, 1.0], new Event(this, this.OnContactGotoLinkedIn), new Mesh("Models/Social/LinkedIn.obj"));
    contactButton.onHoveredChange = new Event(this, this.OnContactGotoLinkedInHovered);
    this.contactContainer.AddButtonSimple("Back", [0, 0.0, -1.0], [2.0, 1.0, 1.0], new Event(this, this.OnProjectsBackButtonClick));

    this.contactContainer.AddBoundingBox([4, 0, -0.1]);
    this.contactContainer.AddBoundingBox([-4, 0, -0.1]);
    this.contactContainer.AddBoundingBox([4, 0, -4.8]);
    this.contactContainer.AddBoundingBox([-4, 0, -4.8]);

    // About me
    this.aboutMeContainer = this.AddSceneContainer("AboutMe", -100, -100, [-4, -5, 3.5], -14, 180);
    this.aboutMeContainer.AddBackgroundSimple([0, -0.51, -3.3], [8.5, 1.0, 3.0], [1.0, 1.0, 1.0, 1.0]);
    this.aboutMeContainer.AddButtonSimple("", [-2.9, 0.0, -3.3], [2.0, 0.1, 2.0], undefined, new Texture("Textures/ProfilePic.png"));
    this.aboutMeContainer.AddText3DSimple("About Me", 0, 0, -5.7, 10);
    this.aboutMeContainer.AddText2DBounds("Hi, my name is Jelle van der Gulik, I am a 24 year old Game Programmer and I live in the Netherlands.\n\nI love to read books, play games, watch movies, or go for a jog.\n\nMy passion lies in programming, such as: games, tools, networking, rendering, applications, or web.", 1.2, 0, -3.3, 3, [0, 0, 0, 1], 2, this.descriptionFont);
    this.aboutMeContainer.AddButtonSimple("Back", [0, 0.0, -1.0], [2.0, 1.0, 1.0], new Event(this, this.OnProjectsBackButtonClick));

    this.aboutMeContainer.AddBoundingBox([4.5, 0, -0.1]);
    this.aboutMeContainer.AddBoundingBox([-4.5, 0, -0.1]);
    this.aboutMeContainer.AddBoundingBox([4.5, 0, -6.5]);
    this.aboutMeContainer.AddBoundingBox([-4.5, 0, -6.5]);

    // Projects settings
    this.projectDescriptionBackgroundTexture = undefined;
    this.projectDescriptionBackgroundColor = [1.0, 1.0, 1.0, 1.0];
    this.projectDescriptionTextColor = [0.0, 0.0, 0.0, 1.0];

    // Projects
    this.projects = [];
    for (var i = 0; i < Factory.Projects.length; i++)
    {
        this.projects[i] = new Factory.Projects[i](this);
    }

    // Set up next button links
    for(var i = 0; i < this.projects.length; i++)
    {
        if(this.projects[i].nextButton != undefined)
        {
            var nextProject = this.GetProjectData(this.projects[i].nextProjectID);
            if(nextProject != undefined)
            {
                //this.projects[i].nextButton.SetTexture(nextProject.previewButton.texture);
                this.projects[i].nextButton.gotoContainer = nextProject.container;
            }
        }
    }

    // Final
    this.tempMat4 = mat4.create();
    this.GotoSceneContainer(this.homeContainer);

    Analytics.curScene = this;
    Window.AddClickListener(this);
}

Scene.prototype.InitializeResources = function()
{
    this.defaultTexture = new Texture();

    // Materials
    this.defaultUnlitMaterial = new Material("DefaultUnlitMaterial.glsl", 1);
    this.defaultLitMaterial = new Material("DefaultLitMaterial.glsl", 1);
    this.shadowPassMaterial = new Material("ShadowPassMaterial.glsl", 1);

    this.buttonMaterial = new Material("ButtonMaterial.glsl", 1);
    this.skyBoxMaterial = new Material("SkyBox.glsl", 1);

    // Meshes
    this.planeMesh = new Mesh("Models/Plane.obj", 1);
    this.cubeMesh = new Mesh("Models/Cube.obj", 1);
    this.fontMesh = new Mesh("Models/CalibriFont.obj", 4);
    //this.buttonMesh = new Mesh("Models/Dodeca.obj");

    // Textures
    this.crateTexture = new Texture("Textures/Crate.jpg", 1);
    this.grassTexture = new Texture("Textures/Grass2.jpg", 1);
    //this.tvCaseTexture = new Texture("Textures/TV_Set_Diff.png");
    //this.textBackgroundTexture = new Texture("Textures/TextboxBackground.jpg");

    // Fonts
    this.testFont2D = new Font2D("Fonts/Coolvetica_Rg_36_Bold", 1);
    this.testFont2D.mesh = this.fontMesh;

    this.descriptionFont = new Font2D("Fonts/Open_Sans_30_Bold", 2);

    //this.tvVideo = new TextureVideo("Videos/AI_1.mp4");
}

Scene.prototype.GetProjectData = function(id)
{
    for(var i = 0; i < this.projects.length; i++)
    {
        if(this.projects[i].id == id)
        {
            return this.projects[i];
        }
    }

    return undefined;
}

Scene.prototype.AddSceneContainer = function(name, x, y, camPosition, camYaw, camPitch)
{
    var sceneContainer = new SceneContainer(name, this, x, y, camPosition, camYaw, camPitch);

    this.sceneContainers.push(sceneContainer);
    return sceneContainer;
}

Scene.prototype.GetNearestSceneContainer = function(position)
{
    var result = undefined;
    var resultDistance = 0.0;
    for(var i = 0; i < this.sceneContainers.length; i++)
    {
        var deltaX = position[0] - this.sceneContainers[i].x;
        var deltaY = position[1] - this.sceneContainers[i].y;
        if(this.sceneContainers[i].canBeNearest === true && result == undefined || deltaX * deltaX + deltaY * deltaY < resultDistance)
        {
            result = this.sceneContainers[i];
            resultDistance = deltaX * deltaX + deltaY * deltaY;
        }
    }
    return result;
}

Scene.prototype.GotoSceneContainer = function(sceneContainer)
{
    this.selectedContainer = sceneContainer;

    this.core.camera.startPosition = [this.core.camera.position[0], this.core.camera.position[1], this.core.camera.position[2]];
    this.core.camera.startYaw = this.core.camera.yaw;
    this.core.camera.startPitch = this.core.camera.pitch;

    this.core.camera.gotoPosition = [-sceneContainer.x, -sceneContainer.y, sceneContainer.camPosition[2]];
    this.core.camera.gotoYaw = sceneContainer.camYaw;
    this.core.camera.gotoPitch = sceneContainer.camPitch;
    this.core.camera.movementAlpha = 0;

    // Calculate bounding
    for(var j = 0; j < 10000; j++)
    {
        var result = true;
        for(var i = 0; i < this.selectedContainer.boundingBoxes.length; i++)
        {
            this.core.camera.SetViewMatrix(this.tempMat4, this.core.camera.gotoPosition, this.core.camera.gotoYaw, this.core.camera.gotoPitch);
            var screenPos = this.core.GetScreenLocation(this.tempMat4, this.selectedContainer.boundingBoxes[i]);
            if(screenPos[0] < 0.0 || screenPos[0] > 1.0 || screenPos[1] < 0.0 || screenPos[1] > 1.0)
            {
                result = false;
                var forward = this.core.camera.GetForward(this.core.camera.gotoYaw, this.core.camera.gotoPitch);
                this.core.camera.gotoPosition[0] -= forward[0] * 0.1;
                this.core.camera.gotoPosition[1] -= forward[1] * 0.1;
                this.core.camera.gotoPosition[2] -= forward[2] * 0.1;
            }
        }
        if(result == true) break;
    }
}

Scene.prototype.UpdateRaycaster = function(hover)
{
    var nearestButton = undefined;
    var nearestButtonDistance = 0;

    for(var i = 0; i < this.sceneContainers.length; i++)
    {
        for(var j = 0; j < this.sceneContainers[i].buttons.length; j++)
        {
            var button = this.sceneContainers[i].buttons[j];
            button.hovered = false;
            var bmin = [button.position[0] - button.scale[0] * 0.5, button.position[1] - button.scale[1] * 0.5, button.position[2] - button.scale[2] * 0.5];
            var bmax = [button.position[0] + button.scale[0] * 0.5, button.position[1] + button.scale[1] * 0.5, button.position[2] + button.scale[2] * 0.5];

            var hit = [0, 0, 0];
            if(this.core.BoxRay(bmin, bmax, this.core.startMouseRay, this.core.endMouseRay, hit))
            {
                var distanceX = hit[0] - this.core.startMouseRay[0];
                var distanceY = hit[1] - this.core.startMouseRay[1];
                var distanceZ = hit[2] - this.core.startMouseRay[2];
                var distance = distanceX * distanceX + distanceY * distanceY + distanceZ * distanceZ;
                if(nearestButton == undefined || distance < nearestButtonDistance)
                {
                    nearestButton = button;
                    nearestButtonDistance = distance;
                }
            }
        }
    }

    // Static gl
    var gl = Renderer.gl;

    if(nearestButton == undefined && hover == true)
    {
        gl.parentCanvas.canvas.style.cursor = "default";
    }

    if(nearestButton != undefined && hover == true)
    {
        nearestButton.hovered = true;
        gl.parentCanvas.canvas.style.cursor = nearestButton.mousePointer;
    }
    return nearestButton;
}

Scene.prototype.RenderShadow = function(gl)
{
    // Obtain nearest scene container
    if(this.fullscreenDiv == undefined)
    {
        if(this.core.nearestSceneContainer != undefined)
        {
            this.core.nearestSceneContainer.RenderShadow(gl);
        }
    }
}

Scene.prototype.UpdateFullscreenDiv = function()
{
    if(this.fullscreenDiv != undefined)
    {
        Style.SetSize(this.closeButton, Window.Height / 15, Window.Height / 15);
        Style.MakeVisible(this.closeButton);
        if(Window.Width < Window.Height)
        {
            var width = Window.Height;
            var height = Window.Width;

            var mouseX = width - Window.MouseY;
            var mouseY = Window.MouseX;

            Style.SetTransform(this.fullscreenDiv, "rotate(-90deg) translate3D(" + ((height / 2) - (width / 2)) + "px, " + ((height / 2) - (width / 2)) + "px, 0px)");
            Style.SetSize(this.fullscreenDiv, width, height);
            Style.SetPosition(this.closeButton, height / 50, height / 50);

            Style.SetTransform(this.imagePreviewFullscreenArrowLeft, "scale(1.0, 1.0)");
            Style.SetTransform(this.imagePreviewFullscreenArrowRight, "scale(1.0, 1.0)");
            Style.SetTransform(this.closeButton, "scale(1.0, 1.0)");

            var scale = 1.3;

            if(mouseX > width - (height / 7) && mouseY < (height / 7))
            {
                this.fullscreenDiv.style.cursor = "pointer";
                Style.SetTransform(this.closeButton, "scale(" + scale + ", " + scale + ")");
            }
            else if(mouseX < width / 10)
            {
                this.fullscreenDiv.style.cursor = "pointer";
                Style.SetTransform(this.imagePreviewFullscreenArrowLeft, "scale(" + scale + ", " + scale + ")");
            }
            else if(mouseX > width - (width / 10))
            {
                this.fullscreenDiv.style.cursor = "pointer";
                Style.SetTransform(this.imagePreviewFullscreenArrowRight, "scale(" + scale + ", " + scale + ")");
            }
            else
            {
                this.fullscreenDiv.style.cursor = "default";
            }
        }
        else
        {
            var mouseX = Window.MouseX;
            var mouseY = Window.MouseY;

            var width = Window.Width;
            var height = Window.Height;

            Style.SetTransform(this.fullscreenDiv, "");
            Style.SetSize(this.fullscreenDiv, width, height);
            Style.SetPosition(this.closeButton, width - (height / 50) - (height / 15), height / 50);

            Style.SetTransform(this.imagePreviewFullscreenArrowLeft, "scale(1.0, 1.0)");
            Style.SetTransform(this.imagePreviewFullscreenArrowRight, "scale(1.0, 1.0)");
            Style.SetTransform(this.closeButton, "scale(1.0, 1.0)");

            var scale = 1.3;

            if(mouseX > width - (height / 7) && mouseY < (height / 7))
            {
                this.fullscreenDiv.style.cursor = "pointer";
                Style.SetTransform(this.closeButton, "scale(" + scale + ", " + scale + ")");
            }
            else if(mouseX < width / 10)
            {
                this.fullscreenDiv.style.cursor = "pointer";
                Style.SetTransform(this.imagePreviewFullscreenArrowLeft, "scale(" + scale + ", " + scale + ")");
            }
            else if(mouseX > width - (width / 10))
            {
                this.fullscreenDiv.style.cursor = "pointer";
                Style.SetTransform(this.imagePreviewFullscreenArrowRight, "scale(" + scale + ", " + scale + ")");
            }
            else
            {
                this.fullscreenDiv.style.cursor = "default";
            }
        }
    }
}

Scene.prototype.Render = function(gl)
{
    Style.MakeHidden(this.closeButton);

    if(ResourceManager.hasFinishedLoading == false)
    {
        Style.SetSize(this.loading, Window.Height / 12 * 2.4, Window.Height / 12);
    }
    else
    {
        Style.MakeHidden(this.loading);
    }

    if(this.fullscreenDiv != undefined)
    {
        this.UpdateFullscreenDiv();
    }

    if(this.fullscreenDiv == undefined)
    {
        if(Window.isTouch == false)
        {
            this.UpdateRaycaster(true);
        }
        for(var i = 0; i < this.sceneContainers.length; i++)
        {
            this.sceneContainers[i].Render(gl);
        }
    }
}

/// --- Events --- ///
Scene.prototype.OResize = function()
{
    this.GotoSceneContainer(this.selectedContainer);
}

Scene.prototype.OnClickEvent = function(e)
{
    if (Window.MouseTravelDistance > 50)
    {
        return;
    }
    if (Util.GetTime() - Window.MouseDownPressTime > 500)
    {
        return;
    }

    if (this.fullscreenDiv == undefined)
    {
        var button = this.UpdateRaycaster(false);
        if (button != undefined && button.onClick != undefined)
        {
            Analytics.Queue("Button", button.name + ";");
            button.onClick(button);
        }
    }
    else
    {
        var width = Window.Width;
        var height = Window.Height;

        var mouseX = Window.MouseX;
        var mouseY = Window.MouseY;
        if(Window.Width < Window.Height)
        {
            width = Window.Height;
            height = Window.Width;

            mouseX = width - Window.MouseY;
            mouseY = Window.MouseX;
        }

        if(mouseX > width - (height / 7) && mouseY < (height / 7))
        {
            // Close
            Style.MakeHidden(this.fullscreenDiv);
            this.fullscreenDiv = undefined;

            Analytics.Queue("CloseFullscreen", "");
        }
        else if(mouseX < width / 10)
        {
            // Previous
            Analytics.Queue("NextScreenshot", "");

            this.screenShotIndex++;
            if(this.screenShotIndex < 1) { this.screenShotIndex = 7; }
            if(this.screenShotIndex > 7) { this.screenShotIndex = 1; }
            Style.SetBGTexture(this.imagePreviewFullscreen, this.screenShotLink + (this.screenShotIndex) + ".jpg");
        }
        else if(mouseX > width - (width / 10))
        {
            // Next
            Analytics.Queue("PreviousScreenshot", "");
            this.screenShotIndex--;
            if(this.screenShotIndex < 1) { this.screenShotIndex = 7; }
            if(this.screenShotIndex > 7) { this.screenShotIndex = 1; }
            Style.SetBGTexture(this.imagePreviewFullscreen, this.screenShotLink + (this.screenShotIndex) + ".jpg");
        }
    }
}

// Home
Scene.prototype.OnProjectsButtonClick = function()
{
    this.GotoSceneContainer(this.projectContainer);
}

Scene.prototype.OnContactButtonClick = function()
{
    this.GotoSceneContainer(this.contactContainer);
}

Scene.prototype.OnAboutMeButtonClick = function()
{
    this.GotoSceneContainer(this.aboutMeContainer);
}

// Projects
Scene.prototype.OnProjectsBackButtonClick = function()
{
    this.GotoSceneContainer(this.homeContainer);
}

// Contact
Scene.prototype.OnContactGotoMail = function()
{
    Window.OpenTab("mailto:jellevdg3@email.com");
}
Scene.prototype.OnContactGotoMailHovered = function(hovered)
{
    if(hovered)
        this.contactTitle.SetText("Email");
    else
        this.contactTitle.SetTextIf("Contact", "Email");
}

Scene.prototype.OnContactGotoSteam = function()
{
    Window.OpenTab("https://steamcommunity.com/profiles/76561198002954001");
}
Scene.prototype.OnContactGotoSteamHovered = function(hovered)
{
    if(hovered)
        this.contactTitle.SetText("Steam");
    else
        this.contactTitle.SetTextIf("Contact", "Steam");
}

Scene.prototype.OnContactGotoTelegram = function()
{
    Window.OpenTab("https://t.me/jellevdg3");
}
Scene.prototype.OnContactGotoTelegramHovered = function(hovered)
{
    if(hovered)
        this.contactTitle.SetText("Telegram");
    else
        this.contactTitle.SetTextIf("Contact", "Telegram");
}

Scene.prototype.OnContactGotoDiscord = function()
{
    Window.OpenTab("https://discord.gg/E8G3gNR");
}
Scene.prototype.OnContactGotoDiscordHovered = function(hovered)
{
    if(hovered)
        this.contactTitle.SetText("Discord");
    else
        this.contactTitle.SetTextIf("Contact", "Discord");
}

Scene.prototype.OnContactGotoLinkedIn = function()
{
    Window.OpenTab("https://www.linkedin.com/in/JelleVanDerGulik/");
}
Scene.prototype.OnContactGotoLinkedInHovered = function(hovered)
{
    if(hovered)
        this.contactTitle.SetText("LinkedIn");
    else
        this.contactTitle.SetTextIf("Contact", "LinkedIn");
}
