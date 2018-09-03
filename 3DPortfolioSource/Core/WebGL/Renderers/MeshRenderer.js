MeshRenderer = function(sceneContainer, mesh, material)
{
    this.sceneContainer = sceneContainer;
    this.mesh = mesh;
    this.material = material;
    
    this.scene = this.sceneContainer.scene;
    this.renderer = this.scene.core;

    this.texture = this.scene.defaultTexture;

    this.position = [0.0, 0.0, 0.0];
    this.scale = [1.0, 1.0, 1.0];
    this.rotation = [0.0, 0.0, 0.0];
    this.uvScale = [1.0, 1.0];
    this.uvOffset = [0.0, 0.0];

    this.colors = [];
    this.SetColor(1.0, 1.0, 1.0, 1.0);

    this.shininess = 1.0;

    this.fadeIn = -0.1;

    this.visible = true;
    this.castShadow = true;

    this.align = Align.CENTER;

    this.transparency = false;

    this.parent = undefined;
    this.childeren = [];

    this.modelMatrix = mat4.create();
}

MeshRenderer.prototype.SetColor = function(r, g, b, a, materialIndex)
{
    if(materialIndex == undefined) materialIndex = 0;

    this.colors[materialIndex] = [r, g, b, a];
}

// SHADOWS //
MeshRenderer.prototype.RenderShadow = function(gl)
{
    if(this.mesh.isLoaded === true && this.scene.shadowPassMaterial.isLoaded === true && this.castShadow === true)
    {
        if(this.visible === false) return;

        this.renderer.mvPushMatrix();

        // Martices
        mat4.translate(this.renderer.mvMatrix, this.position);
        mat4.rotate(this.renderer.mvMatrix, this.rotation[0], [1, 0, 0]);
        mat4.rotate(this.renderer.mvMatrix, this.rotation[1], [0, 1, 0]);
        mat4.rotate(this.renderer.mvMatrix, this.rotation[2], [0, 0, 1]);
        mat4.scale(this.renderer.mvMatrix, this.scale);
        if(this.align == Align.LEFT)
        {
            mat4.translate(this.renderer.mvMatrix, [-this.mesh.boundsMinX, -this.mesh.boundsMinY, -this.mesh.boundsMinZ]);
        }
        if(this.align == Align.CENTER)
        {
            mat4.translate(this.renderer.mvMatrix, [-this.mesh.centerX, -this.mesh.centerY, -this.mesh.centerZ]);
        }
        if(this.align == Align.RIGHT)
        {
            mat4.translate(this.renderer.mvMatrix, [-this.mesh.boundsMaxX, -this.mesh.boundsMaxY, -this.mesh.boundsMaxZ]);
        }

        // Bind shader
        gl.useProgram(this.scene.shadowPassMaterial.GetShaderProgram());

        // Bind vertex
        gl.enableVertexAttribArray(this.scene.shadowPassMaterial.GetVertexAttributePosition());
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
        gl.vertexAttribPointer(this.scene.shadowPassMaterial.GetVertexAttributePosition(), 3, gl.FLOAT, false, 0, 0);
        
        // Bind indices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);

        // Matrices
        gl.uniformMatrix4fv(this.scene.shadowPassMaterial.shader.pMatrixUniform, false, this.renderer.pMatrix);
        gl.uniformMatrix4fv(this.scene.shadowPassMaterial.shader.mvMatrixUniform, false, this.renderer.mvMatrix);
        
        // Draw
        //gl.drawElements(gl.TRIANGLES, this.mesh.obj.meshOffsets[this.mesh.obj.meshOffsets.length - 1], gl.UNSIGNED_SHORT, 0);
        
        var index = 0;
        for (var i = 0; i < this.mesh.obj.meshOffsets.length; i++)
        {
            gl.drawArrays(gl.TRIANGLES, index, this.mesh.obj.meshOffsets[i] - index);
            index = this.mesh.obj.meshOffsets[i];
        }
        
        for(var i = 0; i < this.childeren.length; i++)
        {
            if(this.childeren[i].castShadow === true)
            {
                this.childeren[i].parent = this;
                this.childeren[i].RenderShadow(gl);
            }
        }
        
        this.renderer.mvPopMatrix();
    }
}

// RENDER //
MeshRenderer.prototype.Render = function(gl)
{
    if(this.mesh.isLoaded === true && this.material.isLoaded === true)
    {
        if(this.visible === false) return;

        this.renderer.mvPushMatrix();
        this.renderer.lightMVPushMatrix();
        
        // Martices
        mat4.translate(this.renderer.mvMatrix, this.position);
        mat4.rotate(this.renderer.mvMatrix, this.rotation[0], [1, 0, 0]);
        mat4.rotate(this.renderer.mvMatrix, this.rotation[1], [0, 1, 0]);
        mat4.rotate(this.renderer.mvMatrix, this.rotation[2], [0, 0, 1]);
        mat4.scale(this.renderer.mvMatrix, this.scale);

        if(this.align == Align.LEFT)
        {
            mat4.translate(this.renderer.mvMatrix, [-this.mesh.boundsMinX, -this.mesh.boundsMinY, -this.mesh.boundsMinZ]);
        }
        if(this.align == Align.CENTER)
        {
            mat4.translate(this.renderer.mvMatrix, [-this.mesh.centerX, -this.mesh.centerY, -this.mesh.centerZ]);
        }
        if(this.align == Align.RIGHT)
        {
            mat4.translate(this.renderer.mvMatrix, [-this.mesh.boundsMaxX, -this.mesh.boundsMaxY, -this.mesh.boundsMaxZ]);
        }
        
        mat4.translate(this.renderer.lightMVMatrix, this.position);
        mat4.rotate(this.renderer.lightMVMatrix, this.rotation[0], [1, 0, 0]);
        mat4.rotate(this.renderer.lightMVMatrix, this.rotation[1], [0, 1, 0]);
        mat4.rotate(this.renderer.lightMVMatrix, this.rotation[2], [0, 0, 1]);
        mat4.scale(this.renderer.lightMVMatrix, this.scale);

        if(this.align == Align.LEFT)
        {
            mat4.translate(this.renderer.lightMVMatrix, [-this.mesh.boundsMinX, -this.mesh.boundsMinY, -this.mesh.boundsMinZ]);
        }
        if(this.align == Align.CENTER)
        {
            mat4.translate(this.renderer.lightMVMatrix, [-this.mesh.centerX, -this.mesh.centerY, -this.mesh.centerZ]);
        }
        if(this.align == Align.RIGHT)
        {
            mat4.translate(this.renderer.lightMVMatrix, [-this.mesh.boundsMaxX, -this.mesh.boundsMaxY, -this.mesh.boundsMaxZ]);
        }
        
        // Model matrix
        if(this.parent == undefined)
        {
            mat4.identity(this.modelMatrix);
        }
        else
        {
            this.modelMatrix = this.parent.modelMatrix;
        }

        //mat4.scale(this.modelMatrix, this.scale);
        mat4.rotate(this.modelMatrix, this.rotation[0], [1, 0, 0]);
        mat4.rotate(this.modelMatrix, this.rotation[1], [0, 1, 0]);
        mat4.rotate(this.modelMatrix, this.rotation[2], [0, 0, 1]);
        
        mat4.toInverseMat3(this.modelMatrix, this.renderer.nMatrix);
        mat3.transpose(this.renderer.nMatrix);
        //mat4.scale(this.modelMatrix, this.scale);

        // Bind shader
        gl.useProgram(this.material.GetShaderProgram());

        if (this.transparency === true)
        {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            //gl.disable(gl.DEPTH_TEST);
        }

        // Bind vertex
        gl.enableVertexAttribArray(this.material.GetVertexAttributePosition());
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
        gl.vertexAttribPointer(this.material.GetVertexAttributePosition(), 3, gl.FLOAT, false, 0, 0);

        // Bind normals
        if(this.material.GetNormalAttributePosition() != -1)
        {
            gl.enableVertexAttribArray(this.material.GetNormalAttributePosition());
            gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.normalBuffer);
            gl.vertexAttribPointer(this.material.GetNormalAttributePosition(), 3, gl.FLOAT, false, 0, 0);
        }

        // Bind uvs
        gl.enableVertexAttribArray(this.material.GetUVsAttributePosition());
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.uvsBuffer);
        gl.vertexAttribPointer(this.material.GetUVsAttributePosition(), 2, gl.FLOAT, false, 0, 0);

        // Bind indices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);

        // Matrices
        gl.uniformMatrix4fv(this.material.shader.pMatrixUniform, false, this.renderer.pMatrix);
        gl.uniformMatrix4fv(this.material.shader.mvMatrixUniform, false, this.renderer.mvMatrix);
        gl.uniformMatrix3fv(this.material.shader.nMatrixUniform, false, this.renderer.nMatrix);

        gl.uniformMatrix4fv(this.material.shader.lightPMatrixUniform, false, this.renderer.lightPMatrix);
        gl.uniformMatrix4fv(this.material.shader.lightMVMatrixUniform, false, this.renderer.lightMVMatrix);

        // Uniforms
        gl.uniform3fv(this.material.shader.cameraForwardUniform, this.renderer.forwardVector);
        gl.uniform3fv(this.material.shader.cameraPositiondUniform, this.renderer.positionVector);
        gl.uniform2fv(this.material.shader.uvScaleUniform, this.uvScale);
        gl.uniform2fv(this.material.shader.uvOffsetUniform, this.uvOffset);
        gl.uniform1f(this.material.shader.uShininessUniform, this.shininess);

        // Ambient color
        gl.uniform3f(this.material.shader.ambientColorUniform, 0.3, 0.3, 0.3);

        // Lighting direction
        var adjustedLD = vec3.create();
        vec3.normalize(this.renderer.lightingDirection, adjustedLD);
        vec3.scale(adjustedLD, -1);
        gl.uniform3fv(this.material.shader.lightingDirectionUniform, adjustedLD);

        // Lighitng color
        gl.uniform3f(this.material.shader.directionalColorUniform, 1.0, 1.0, 1.0);
        
        // Texture
        if(this.texture.isLoaded == true)
        {
            if(this.texture.OnVideoUpdate)
            {
                this.texture.OnVideoUpdate();
            }

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture.textureSource);
            gl.uniform1i(this.material.shader.samplerDiffuseUniform, 0);
        }
        else
        {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.scene.defaultTexture.textureSource);
            gl.uniform1i(this.material.shader.samplerDiffuseUniform, 0);
        }

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.renderer.shadowDepthTexture);
        gl.uniform1i(this.material.shader.samplerShadowUniform, 1);

        // Draw
        //var elementCount = this.mesh.obj.meshOffsets[this.mesh.obj.meshOffsets.length];
        //gl.drawElements(gl.TRIANGLES, elementCount, gl.UNSIGNED_SHORT, 0);
        
        var index = 0;
        var colorIndex = 0;
        for(var i = 0; i < this.mesh.obj.meshOffsets.length; i++)
        {
            colorIndex = i;
            if(i >= this.colors.length)
            {
                colorIndex = 0;
            }

            if(this.fadeIn < 1.0)
            {
                gl.uniform4fv(this.material.shader.colorUniform, [this.colors[colorIndex][0] * this.fadeIn, this.colors[colorIndex][1] * this.fadeIn, this.colors[colorIndex][2] * this.fadeIn, this.colors[colorIndex][3]]);
            }
            else
            {
                gl.uniform4fv(this.material.shader.colorUniform, this.colors[colorIndex]);
            }
            
            gl.drawArrays(gl.TRIANGLES, index, this.mesh.obj.meshOffsets[i] - index);

            index = this.mesh.obj.meshOffsets[i];
        }

        if(this.fadeIn < 1.0)
        {
            if(this.texture.isLoaded == true)
            {
                this.fadeIn += gl.delta / 1000.0;
            }
        }
        
        if(this.material.GetNormalAttributePosition() != -1)
        {
            //gl.disableVertexAttribArray(this.material.GetNormalAttributePosition());
        }

        for(var i = 0; i < this.childeren.length; i++)
        {
            this.childeren[i].parent = this;
            this.childeren[i].Render(gl);
        }

        if (this.transparency === true)
        {
            gl.disable(gl.BLEND);
            //gl.enable(gl.DEPTH_TEST);
        }

        mat4.rotate(this.modelMatrix, -this.rotation[0], [1, 0, 0]);
        mat4.rotate(this.modelMatrix, -this.rotation[1], [0, 1, 0]);
        mat4.rotate(this.modelMatrix, -this.rotation[2], [0, 0, 1]);

        this.renderer.mvPopMatrix();
        this.renderer.lightMVPopMatrix();
    }
}
