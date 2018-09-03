Window = window;

// Register this object to the factory
Factory.Add(Factory.SystemComponents, Window);

Window.Initialize = function()
{
    Window.ObtainWindowSize();

    Window.CurURL = "";
    Window.ResizeListeners = [];
    Window.URLListeners = [];
    Window.ClickListeners = [];
    Window.Focused = true;

    Window.LastMouseX = 0;
    Window.LastMouseY = 0;

    Window.MouseX = 0;
    Window.MouseY = 0;
    Window.ScrollPosition = 0;

    Window.isTouch = false;
    Window.downCount = 0;
    Window.cancelNextMouseMovement = 0;

    Window.SyncedMouseTravelDistance = 0;

    Window.LeftMouseDown = false;
    Window.MiddleMouseDown = false;
    Window.RightMouseDown = false;

    Window.MouseDownPressTime = 0;
    Window.MouseTravelDistance = 0;

    Window.keys = [];

    Window.touches = [];

    // Register native events
    Window.onresize = new Event(this, this.OnResizeEvent);
    Window.onclick = new Event(this, this.OnClickEvent);

    Window.onfocus = new Event(this, this.FocusEvent);
    Window.onblur = new Event(this, this.BlurEvent);

    Window.onmousedown = new Event(this, this.OnMouseDown);
    Window.onmouseup = new Event(this, this.OnMouseUp);
    Window.onmousemove = new Event(this, this.OnMouseMove);

    Window.onkeydown = new Event(this, this.OnKeyDown);
    Window.onkeyup = new Event(this, this.OnKeyUp);

    Window.onscroll = new Event(this, this.OnMouseScroll);
    Window.onwheel = new Event(this, this.OnMouseScroll);
    Window.wheel = new Event(this, this.OnMouseScroll);
    Window.mousewheel = new Event(this, this.OnMouseScroll);
    Window.onmousewheel = new Event(this, this.OnMouseScroll);
    Window.DOMMouseScroll = new Event(this, this.OnMouseScroll);
    Window.onDOMMouseScroll = new Event(this, this.OnMouseScroll);
    
    Window.ontouchstart = new Event(this, this.OnTouchStart);
    Window.ontouchmove = new Event(this, this.OnTouchMove);
    Window.ontouchcancel = new Event(this, this.OnTouchCancel);
    Window.ontouchend = new Event(this, this.OnTouchEnd);
}

Window.IsMobileBrowser = function ()
{
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

Window.AddResizeListener = function(listener)
{
    Window.ResizeListeners.push(listener);
}

Window.AddURLListener = function(listener)
{
    Window.URLListeners.push(listener);
}

Window.AddClickListener = function(listener)
{
    Window.ClickListeners.push(listener);
}

Window.SetURLBar = function(url)
{
    window.history.pushState("", "", url);

    Window.OnURLChangeEvent(url);
}

Window.OpenTab = function(url)
{
    Window.open(url, "_blank");
}

Window.ObtainWindowSize = function()
{
    // Mobile
    var is_touch_device = 'ontouchstart' in document.documentElement;
    if(is_touch_device == true)
    {
        //var ratio = window.devicePixelRatio || 1;

        var screen_width = Math.max(Window.innerWidth,
            //document.body.clientWidth, document.body.offsetWidth/*, document.body.scrollWidth*/,
            document.documentElement.clientWidth/*, document.documentElement.offsetWidth*//*, document.documentElement.scrollWidth*/);

        var screen_height = Math.max(Window.innerHeight,
            //document.body.clientHeight, document.body.offsetHeight/*, document.body.scrollHeight*/,
            document.documentElement.clientHeight/*, document.documentElement.offsetHeight*//*, document.documentElement.scrollHeight*/);

        Window.Width = screen_width;
        Window.Height = screen_height;
    }
    else

    // PC
    {
        Window.Width = Window.innerWidth;
        Window.Height = Window.innerHeight;
    }
}

// Events
Window.OnLoad = function(event)
{
    new Event(Startup, Startup)();
}

Window.OnResizeEvent = function(event)
{
    Window.ObtainWindowSize();

    Logger.LogInfo("Window resized to " + Window.Width + "w; " + Window.Height + "h.");

    for(var i = 0; i < Window.ResizeListeners.length; i++)
    {
        Window.ResizeListeners[i].OnResizeEvent(event);
    }

    Renderer.isDirty = true;
}

Window.OnURLChangeEvent = function(url)
{
    if (Window.URLListeners != undefined)
    {
        Window.CurURL = url;
        for (var i = 0; i < Window.URLListeners.length; i++)
        {
            Window.URLListeners[i].OnURLChangeEvent(url);
        }

        Analytics.Queue("URLChange", url);
    }
}

Window.FocusEvent = function(event)
{
    Window.Focused = true;

    Analytics.Queue("Focus", "");
}

Window.BlurEvent = function(event)
{
    Window.Focused = false;

    for(var i = 0; i < 300; i++)
    {
        if(Window.keys[i] === true)
        {
            Window.keys[i] = false;
        }
    }

    Analytics.Queue("Blur", "");
}

// Mouse events
Window.OnClickEvent = function(event)
{
    event.preventDefault();

    if(Analytics.playing != true)
    {
        for(var i = 0; i < Window.ClickListeners.length; i++)
        {
            Window.ClickListeners[i].OnClickEvent(event);
        }
    }
}

Window.OnMouseDown = function(event)
{
    event.preventDefault();

    if(Analytics.playing != true)
    {
        Window.MouseX = event.clientX;
        Window.MouseY = event.clientY;

        Window.LastMouseX = Window.MouseX;
        Window.LastMouseY = Window.MouseY;

        Window.LeftMouseDown = true;
        Window.isTouch = false;

        Window.MouseDownPressTime = Util.GetTime();
        Window.MouseTravelDistance = 0;
    }
}

Window.OnMouseUp = function(event)
{
    event.preventDefault();

    if(Analytics.playing != true)
    {
        Window.MouseX = event.clientX;
        Window.MouseY = event.clientY;

        Window.LastMouseX = Window.MouseX;
        Window.LastMouseY = Window.MouseY;

        Window.LeftMouseDown = false;
        Window.isTouch = false;
    }
}

Window.OnMouseMove = function(event)
{
    event.preventDefault();

    if(Analytics.playing != true)
    {
        Window.MouseX = event.clientX;
        Window.MouseY = event.clientY;

        var delta = ((Window.LastMouseX - Window.MouseX) * (Window.LastMouseX - Window.MouseX)) + ((Window.LastMouseY - Window.MouseY) * (Window.LastMouseY - Window.MouseY));
        Window.MouseTravelDistance += delta;

        Window.LastMouseX = Window.MouseX;
        Window.LastMouseY = Window.MouseY;

        Window.SyncedMouseTravelDistance += delta;
        if(Window.SyncedMouseTravelDistance > 500)
        {
            Window.SyncedMouseTravelDistance = 0;
            Analytics.Queue("MousePosition", "X: " + Window.MouseX + "; Y: " + Window.MouseY);
        }
    }
}

Window.OnMouseScroll = function(event)
{
    event.preventDefault();

    if(Analytics.playing != true)
    {
        if(event.deltaY > 0 || event.detail > 0 || event.wheelDelta < 0)
        {
            Window.ScrollPosition += 1;
            Analytics.Queue("MouseScroll", "+1");
        }
        if(event.deltaY < 0 || event.detail < 0 || event.wheelDelta > 0)
        {
            Window.ScrollPosition -= 1;
            Analytics.Queue("MouseScroll", "-1");
        }
    }
}

// Key events
Window.OnKeyDown = function(event)
{
    if(Analytics.playing != true)
    {
        if(Window.keys[event.keyCode] != true)
        {
            Window.keys[event.keyCode] = true;

            Analytics.Queue("KeyDown", event.keyCode);
        }
    }
}

Window.OnKeyUp = function(event)
{
    if(Analytics.playing != true)
    {
        if(Window.keys[event.keyCode] != false)
        {
            Window.keys[event.keyCode] = false;

            Analytics.Queue("KeyUp", event.keyCode);
        }
    }
}

// Touch events
Window.OnTouchStart = function(event)
{
    event.preventDefault();

    if(Analytics.playing != true)
    {
        Window.downCount++;

        var touches = event.changedTouches;
        if(touches.length != 1 || Window.downCount != 1)
        {
            Window.cancelNextMouseMovement = 2;
            return;
        }

        Window.MouseX = touches[0].pageX;
        Window.MouseY = touches[0].pageY;

        Window.LastMouseX = Window.MouseX;
        Window.LastMouseY = Window.MouseY;

        Window.LeftMouseDown = true;
        Window.isTouch = true;

        Window.MouseDownPressTime = Util.GetTime();
        Window.MouseTravelDistance = 0;
    }
}

Window.OnTouchMove = function(event)
{
    event.preventDefault();

    if(Analytics.playing != true)
    {
        var touches = event.changedTouches;
        if(touches.length != 1 || Window.downCount != 1) return;

        Window.MouseX = touches[0].pageX;
        Window.MouseY = touches[0].pageY;

        var delta = ((Window.LastMouseX - Window.MouseX) * (Window.LastMouseX - Window.MouseX)) + ((Window.LastMouseY - Window.MouseY) * (Window.LastMouseY - Window.MouseY));
        Window.MouseTravelDistance += delta;

        Window.LastMouseX = Window.MouseX;
        Window.LastMouseY = Window.MouseY;

        Window.LeftMouseDown = true;
        Window.isTouch = true;

        if(Window.cancelNextMouseMovement > 0)
        {
            Window.cancelNextMouseMovement--;
        }
    }
}

Window.OnTouchCancel = function(event)
{
    event.preventDefault();

    Window.downCount--;

    if(Analytics.playing != true)
    {
        Window.LeftMouseDown = false;
        Window.isTouch = true;
    }
}

Window.OnTouchEnd = function(event)
{
    event.preventDefault();

    if(Analytics.playing != true)
    {
        Window.downCount--;
        
        if(Window.downCount != 0) { Window.cancelNextMouseMovement = 2; return; }

        Window.LeftMouseDown = false;
        Window.isTouch = true;

        for(var i = 0; i < Window.ClickListeners.length; i++)
        {
            Window.ClickListeners[i].OnClickEvent(event);
        }
    }
}

Window.SetInterval = function(funct, timeout)
{
    Window.setInterval(funct, timeout);
}

// Native events
Window.onload = Window.OnLoad;
