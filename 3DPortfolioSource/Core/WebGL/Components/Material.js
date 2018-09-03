Material = function(shaderPath, priority)
{
    this.shaderPath = shaderPath;
    this.priority = priority;

    this.vertexLocation = 0;

    this.isLoaded = false;

    this.shader = new Shader(shaderPath, this.priority);
    this.shader.onLoadEvent = new Event(this, this.OnLoadEvent);
}

Material.prototype.GetShaderProgram = function()
{
    return this.shader.shaderProgram;
}

Material.prototype.GetVertexAttributePosition = function()
{
    return this.shader.vertexPositionAttribute;
}

Material.prototype.GetNormalAttributePosition = function()
{
    return this.shader.vertexNormalAttribute;
}

Material.prototype.GetUVsAttributePosition = function()
{
    return this.shader.vertexUVsAttribute;
}

Material.prototype.GetpMatrixUniform = function()
{
    return this.shader.pMatrixUniform;
}

Material.prototype.GetmvMatrixUniform = function()
{
    return this.shader.mvMatrixUniform;
}

Material.prototype.GetnMatrixUniform = function()
{
    return this.shader.nMatrixUniform;
}

// Events
Material.prototype.OnLoadEvent = function()
{
    this.isLoaded = true;
}
