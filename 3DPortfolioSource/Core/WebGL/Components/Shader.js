var VERTEX_PREFIX = "#VERTEX_SHADER";
var FRAGMENT_PREFIX = "#FRAGMENT_SHADER";

Shader = function(path, priority)
{
    this.path = "Shaders/" + path;
    this.priority = priority;
    
    this.file = new TextFile(this.path, this.priority);
    this.file.onLoadEvent = new Event(this, this.Parse);

    this.onLoadEvent = undefined;
}

Shader.prototype.Parse = function()
{
    var blob = this.file.GetContents();

    // Shaders
    var shaders = blob.split("#END_SHADER");

    for(var i = 0; i < shaders.length; i++)
    {
        var shader = shaders[i];

        // Vertex shader
        var vertexIndex = shader.indexOf(VERTEX_PREFIX);
        if(vertexIndex != -1)
        {
            this.vertexCode = shader.substring(vertexIndex + VERTEX_PREFIX.length);
        }

        // Fragment shader
        var fragmentIndex = shader.indexOf(FRAGMENT_PREFIX);
        if(fragmentIndex != -1)
        {
            this.fragmentCode = shader.substring(fragmentIndex + FRAGMENT_PREFIX.length);
        }
    }

    // Compile
    if(this.Compile("highp", false) === false)
    {
        if(this.Compile("mediump", false) === false)
        {
            this.Compile("lowp", true);
        }
    }
    this.ObtainPositions();

    if(this.onLoadEvent != undefined)
    {
        this.onLoadEvent();
    }
}

Shader.prototype.Compile = function(precision, logError)
{
    // Static gl
    var gl = Renderer.gl;

    this.shaderProgram = gl.createProgram();

    // Vertex shader
    if(this.vertexCode != undefined && this.vertexCode != "")
    {
        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, this.vertexCode);
        gl.compileShader(vertexShader);

        if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
        {
            // Failed
            if(logError == true)
            {
                Logger.LogWarning("Vertex shader " + this.path + " error: " + gl.getShaderInfoLog(vertexShader));
                document.write("Vertex shader " + this.path + " error: " + gl.getShaderInfoLog(vertexShader) + "<br/>");
            }
            return false;
        }
        else
        {
            // Success
            gl.attachShader(this.shaderProgram, vertexShader);
        }
    }

    // Fragment shader
    if(this.fragmentCode != undefined && this.fragmentCode != "")
    {
        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, "\n\r precision " + precision + " float;\n\r\n\r" + this.fragmentCode);
        gl.compileShader(fragmentShader);

        if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
        {
            // Failed
            if(logError == true)
            {
                Logger.LogWarning("Fragment shader " + this.path + " error: " + gl.getShaderInfoLog(fragmentShader));
                document.write("Fragment shader " + this.path + " error: " + gl.getShaderInfoLog(fragmentShader) + "<br/>");
            }
            return false;
        }
        else
        {
            // Success
            gl.attachShader(this.shaderProgram, fragmentShader);
        }
    }

    // Linking
    gl.linkProgram(this.shaderProgram);
    if(!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS))
    {
        if(logError == true)
        {
            Logger.LogWarning("Link program " + this.path + " error: " + gl.getProgramInfoLog(this.shaderProgram));
            document.write("Link program " + this.path + " error: " + gl.getProgramInfoLog(this.shaderProgram) + "<br/>");
        }

        return false;
    }

    return true;
}

Shader.prototype.ObtainPositions = function()
{
    // Static gl
    var gl = Renderer.gl;

    gl.useProgram(this.shaderProgram);

    this.vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
    this.vertexNormalAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexNormal");
    this.vertexUVsAttribute = gl.getAttribLocation(this.shaderProgram, "aTextureCoord");

    // Matrices
    this.pMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uPMatrix");
    this.mvMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
    this.nMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uNMatrix");

    this.lightPMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uLightProjectionMatrix");
    this.lightMVMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uLightMViewMatrix");

    // Uniforms
    this.colorUniform = gl.getUniformLocation(this.shaderProgram, "uColor");
    this.cameraForwardUniform = gl.getUniformLocation(this.shaderProgram, "uCameraForward");
    this.cameraPositiondUniform = gl.getUniformLocation(this.shaderProgram, "uCameraPosition");
    this.uvScaleUniform = gl.getUniformLocation(this.shaderProgram, "uUVScale");
    this.uvOffsetUniform = gl.getUniformLocation(this.shaderProgram, "uUVOffset");

    this.uShininessUniform = gl.getUniformLocation(this.shaderProgram, "uShininess");

    // Textures
    this.samplerDiffuseUniform = gl.getUniformLocation(this.shaderProgram, "uDiffuseSampler");
    this.samplerShadowUniform = gl.getUniformLocation(this.shaderProgram, "uShadowSampler");

    // Lighting
    this.ambientColorUniform = gl.getUniformLocation(this.shaderProgram, "uAmbientColor");
    this.lightingDirectionUniform = gl.getUniformLocation(this.shaderProgram, "uLightingDirection");
    this.directionalColorUniform = gl.getUniformLocation(this.shaderProgram, "uDirectionalColor");
}
