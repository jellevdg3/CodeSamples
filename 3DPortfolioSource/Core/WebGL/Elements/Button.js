Button = function (sceneContainer, position, scale, text, texture, onClick)
{
    this.sceneContainer = sceneContainer;
    this.position = position;
    this.scale = scale;
    this.text = text;
    this.texture = texture;
    this.onClick = onClick;

    this.scene = this.sceneContainer.scene;
    this.renderer = this.scene.core;

    this.mousePointer = "pointer";

    // Add cube renderer
    var core = this.scene.core;
    var cubeMesh = this.scene.cubeMesh;
    this.cubeRenderer = sceneContainer.AddMeshRenderer(cubeMesh, this.scene.defaultLitMaterial);
    this.cubeRenderer.position = position;
    this.cubeRenderer.scale = scale;
    this.cubeRenderer.uvScale = [1.0, 1.0];
    this.cubeRenderer.shininess = 0.0;
    this.cubeRenderer.texture = this.texture;
    this.cubeRenderer.SetColor(1, 1, 1, 1);
    this.cubeRenderer.visible = true;

    this.meshScale = [1.0, 1.0, 1.0];

    this.cubeRenderer.uvScale = [1.0 - (2.0 / 512), 1.0 - (2.0 / 512)];
    this.cubeRenderer.uvOffset = [1.0 / 512, 1.0 / 512];

    if(text != undefined && text != "")
    {
        //this.textRenderer = new FontRenderer(core, this.scene.testFont2D, this.scene.defaultUnlitMaterial);
        this.textRenderer = new FontRenderer(sceneContainer, this.cubeRenderer, this.scene.testFont2D, this.scene.buttonMaterial);
        this.textRenderer.dimensional = 3;
        this.textRenderer.SetText(this.text);
        this.textRenderer.SetColor([1, 1, 1, 1]);
        this.textRenderer.castShadow = false;
        //this.textRenderer.SetScale([1.5, 3, 3]);

        this.textRenderer.SetScale([3 / scale[0], 3 / scale[1], 3 / scale[2]]);
    }

    this.scaleAlpha = 0.0;
    this.hovered = false;
    this.lastHovered = false;
    this.onHoveredChange = undefined;
}

Button.prototype.SetText = function(text)
{
    this.text = text;
    this.textRenderer.SetText(this.text);
}

Button.prototype.SetTexture = function(texture)
{
    this.texture = texture;

    this.cubeRenderer.texture = this.texture;
}

Button.prototype.Render = function(gl)
{
    this.toScale = [this.scale[0] * 1.2, this.scale[1] * 1.2, this.scale[2] * 1.2];
    
    this.cubeRenderer.scale = this.scale;
    if(this.hovered == true)
    {
        this.scaleAlpha += gl.delta / 1000.0 * 8.0;
        if(this.lastHovered == false)
        {
            this.lastHovered = true;
            if(this.onHoveredChange != undefined)
            {
                this.onHoveredChange(true);
            }
        }
    }
    else
    {
        this.scaleAlpha -= gl.delta / 1000.0 * 8.0;
        if(this.lastHovered == true)
        {
            this.lastHovered = false;
            if (this.onHoveredChange != undefined)
            {
                this.onHoveredChange(false);
            }
        }
    }
    if (this.scaleAlpha < 0) this.scaleAlpha = 0;
    if (this.scaleAlpha > 1) this.scaleAlpha = 1;

    var scaleResult = Interpolation.LerpEase3(this.scale, this.toScale, this.scaleAlpha);
    this.cubeRenderer.scale = [scaleResult[0] * this.meshScale[0], scaleResult[1] * this.meshScale[1], scaleResult[2] * this.meshScale[2]];
    if(this.textRenderer != undefined)
    {
        this.textRenderer.SetPosition([0, (this.cubeRenderer.scale[1] / (this.scale[1] * 2)), 0]);
    }
}
