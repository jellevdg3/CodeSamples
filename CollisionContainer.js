/*
 * CollisionContainer - Written by Jelle van der Gulik.
 * Used for box collision handling. Supports multiple boxes in a single container.
 * 
 * Example usage:
 * var container = new CollisionContainer();
 * container.AddBox(0, 0, 100, 100);
 * container.onCollideEvent = function(otherObject) {console.log("Colliding with: " + otherObject);}
 * container.CollisionCheck(worldObjectList);
 */

CollisionContainer = function()
{
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;

    this.boxes = [];

    this.isColliding = false;
    
    this.onCollideEvent = undefined;
};

// Add a collision box to this collision container based on: x, y, width, height.
CollisionContainer.prototype.AddBox = function(x, y, width, height)
{
    var box = new CollisionBox(x, y, width, height);
    box.container = this;
    this.boxes.push(box);
};

// Check if this container is colliding with another container.
CollisionContainer.prototype.IsCollidingWith = function(checkContainer)
{
    var tx1 = this.owner.x + this.x;
    var ty1 = this.owner.y + this.y;
    var tx2 = tx1 + this.width;
    var ty2 = ty1 + this.height;

    var cx1 = checkContainer.owner.x + checkContainer.x;
    var cy1 = checkContainer.owner.y + checkContainer.y;
    var cx2 = cx1 + checkContainer.width;
    var cy2 = cy1 + checkContainer.height;

    // AABB collision check
    return CollisionUtil.CheckCollision(tx1, ty1, tx2, ty2, cx1, cy1, cx2, cy2);
};

// Check if this container is colliding with a list of game objects.
CollisionContainer.prototype.CollisionCheck = function(gameObjects)
{
    for(var i = 0; i < gameObjects.length; i++)
    {
        var otherCollisionContainer = gameObjects[i].collisionContainer;
        if(otherCollisionContainer.IsCollidingWith(this))
        {
            if(otherCollisionContainer.boxes.length == 1 && this.boxes.length == 1)
            {
                otherCollisionContainer.onCollideEvent(this.owner);
            }
            else
            {
                var checkBoxes = otherCollisionContainer.boxes;
                for(var j = 0; j < this.boxes.length; j++)
                {
                    for (var k = 0; k < checkBoxes.length; k++)
                    {
                        if (checkBoxes[k].IsCollidingWith(this.boxes[j]) && otherCollisionContainer.onCollideEvent != undefined)
                        {
                            otherCollisionContainer.onCollideEvent(this.owner);
                        }
                    }
                }
            }
        }
    }
};

// Draw collision boxes in debug draw. Useful when checking bounding boxes of objects.
CollisionContainer.prototype.DebugDraw = function(gfx)
{
    for(var i = 0; i < this.boxes.length; i++)
    {
        this.boxes[i].DebugDraw(gfx);
    }
};
