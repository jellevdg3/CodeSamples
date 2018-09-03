Analytics = function() { }

Analytics.DoLogError = true;

// Register this object to the factory
Factory.Add(Factory.SystemComponents, Analytics);

Analytics.Initialize = function()
{
    Analytics.msgQueueCount = 0;
    Analytics.msgQueue = "";
    Analytics.isValidSession = false;
    Analytics.id = loadStartTime;

    Analytics.bin = new BinaryFile("", false);

    Window.SetInterval(Analytics.Update, 1000);

    Analytics.initializedPlayer = false;
    Analytics.playing = false;

    Analytics.Queue("Agent", navigator.userAgent);
}

// Register this object to the factory
Factory.Add(Factory.SystemComponents, Analytics);

Analytics.Queue = function(topic, msg)
{
    //var timeString = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "1");
    var timeString = new Date().getTime();

    if (Analytics.isValidSession == false && topic == "Button")
    {
        Analytics.isValidSession = true;
    }

    Analytics.msgQueue += "[" + timeString + " " + topic + "]: " + msg + "\n";
    Analytics.msgQueueCount++;
}

Analytics.Update = function()
{
    if (Analytics.initializedPlayer == false)
    {
        Analytics.initializedPlayer = true;
        Analytics.InitPlayer(URLValidator.GetArgument("Play"));
    }

    if (Analytics.msgQueueCount > 0 && Analytics.isValidSession == true && Analytics.playing == false)
    {
        Analytics.msgQueueCount = 0;

        Analytics.bin.CreateBuffer(Analytics.msgQueue.length);
        for (var i = 0; i < Analytics.msgQueue.length; i++)
        {
            Analytics.bin.WriteByte(256 - Analytics.msgQueue.charCodeAt(i));
        }

        Analytics.bin.Save("Info.php?id=" + Analytics.id);
        Analytics.msgQueue = "";
    }
}

/// PLAYER ///
Analytics.InitPlayer = function(play)
{
    Analytics.play = play;
    if(Analytics.play != undefined)
    {
        Analytics.playing = true;
        Analytics.lineIndex = 0;
        Analytics.startTime = Util.GetTime();

        Analytics.WindowSizeW = 1;
        Analytics.WindowSizeH = 1;

        // Create mouse cursor
        Analytics.mouseDiv = Document.CreateDiv(Document.Body);
        Style.MakeAbsolute(Analytics.mouseDiv);
        Style.SetSize(Analytics.mouseDiv, 32, 32);
        Style.SetPosition(Analytics.mouseDiv, 0, 0);
        Style.SetBGTexture(Analytics.mouseDiv, "Textures/Cursor.png");

        // Load file data
        Analytics.playerData = new TextFile("Visits/" + Analytics.play);
        Analytics.playerData.onLoadEvent = Analytics.OnPlayerDataLoad;

        Window.SetInterval(Analytics.PlayerUpdate, 50);
    }
}

Analytics.OnPlayerDataLoad = function()
{
    var blob = Analytics.playerData.GetContents();
    Analytics.dataLines = blob.split(/\r?\n/);
}

Analytics.PlayerUpdate = function()
{
    if(Analytics.dataLines != undefined)
    {
        // obtain current line
        while (true)
        {
            var scanLine = Analytics.dataLines[Analytics.lineIndex];
            if (scanLine != undefined)
            {
                var topicSeparator = scanLine.indexOf(' ');
                var topicEndSeparator = scanLine.indexOf(']');
                var time = scanLine.substring(1, topicSeparator);
                var topic = scanLine.substring(topicSeparator + 1, topicEndSeparator);

                // Time
                if (Analytics.playerStartTime == undefined)
                {
                    Analytics.playerStartTime = parseInt(time);
                }
                if (parseInt(time) - Analytics.playerStartTime < Util.GetTime() - Analytics.startTime)
                {
                    Analytics.lineIndex++;

                    var data = scanLine.substring(topicEndSeparator + 2);
                    
                    // Mouse position
                    if (topic == "MousePosition")
                    {
                        var otherMouseX = parseInt(data.substring(data.indexOf("X: ") + 3, data.indexOf(";")));
                        var otherMouseY = parseInt(data.substring(data.indexOf("Y: ") + 3));

                        var mouseX = (Window.Width / 2) - (((Analytics.WindowSizeW / 2.0) - otherMouseX)) / (Analytics.WindowSizeH / Window.Height);
                        var mouseY = (Window.Height / 2) - (((Analytics.WindowSizeH / 2.0) - otherMouseY)) / (Analytics.WindowSizeH / Window.Height);

                        if (Window.Width < Window.Height)
                        {
                            var prevX = mouseX;
                            mouseX = mouseY;
                            mouseY = Window.Height - prevX;
                        }

                        Window.MouseX = mouseX;
                        Window.MouseY = mouseY;

                        Style.SetPosition(Analytics.mouseDiv, parseInt(mouseX), parseInt(mouseY));
                    }

                    // Camera position
                    if(topic == "CamPos")
                    {
                        var xyzyp = data.split(",");
                        if(xyzyp.length == 5)
                        {
                            if(Analytics.curScene != undefined)
                            {
                                var x = parseFloat(xyzyp[0]);
                                var y = parseFloat(xyzyp[1]);
                                var z = parseFloat(xyzyp[2]);
                                var yaw = parseFloat(xyzyp[3]);
                                var p = parseFloat(xyzyp[4]);
                                
                                Analytics.curScene.core.camera.gotoPosition = [x, y, z];
                                Analytics.curScene.core.camera.gotoYaw = yaw;
                                Analytics.curScene.core.camera.gotoPitch = p;
                            }
                        }
                    }

                    // Window size
                    var windowResizeIndex;
                    if (windowResizeIndex = data.indexOf("Window resized to ") != -1)
                    {
                        var windowData = data.substring(windowResizeIndex + "Window resized to ".length);
                        var windowSizeW = windowData.substring(0, windowData.indexOf('w'));
                        var windowSizeH = windowData.substring(windowData.indexOf(';') + 2, windowData.indexOf('h'));
                        
                        Analytics.WindowSizeW = windowSizeW;
                        Analytics.WindowSizeH = windowSizeH;
                    }

                    // Button
                    if (topic == "Button")
                    {
                        var buttonText = data.substring(1, data.indexOf(';'));
                        Logger.LogInfo("Button text: " + buttonText);

                        if (Analytics.curScene != undefined)
                        {
                            for (var i = 0; i < Analytics.curScene.sceneContainers.length; i++)
                            {
                                for (var j = 0; j < Analytics.curScene.sceneContainers[i].buttons.length; j++)
                                {
                                    var button = Analytics.curScene.sceneContainers[i].buttons[j];
                                    if (button.name == buttonText)
                                    {
                                        button.onClick(button);
                                    }
                                }
                            }
                        }
                    }

                    // CloseFullscreen
                    if (topic == "CloseFullscreen")
                    {
                        if (Analytics.curScene.fullscreenDiv != undefined)
                        {
                            Style.MakeHidden(Analytics.curScene.fullscreenDiv);
                            Analytics.curScene.fullscreenDiv = undefined;
                        }
                    }

                    // Next Screenshot
                    if(topic == "NextScreenshot")
                    {
                        if(Analytics.curScene.fullscreenDiv != undefined)
                        {
                            Analytics.curScene.screenShotIndex++;
                            if(Analytics.curScene.screenShotIndex < 1) { Analytics.curScene.screenShotIndex = 7; }
                            if(Analytics.curScene.screenShotIndex > 7) { Analytics.curScene.screenShotIndex = 1; }
                            Style.SetBGTexture(Analytics.curScene.imagePreviewFullscreen, Analytics.curScene.screenShotLink + (Analytics.curScene.screenShotIndex) + ".jpg");
                        }
                    }

                    // Previous Screenshot
                    if(topic == "PreviousScreenshot")
                    {
                        if(Analytics.curScene.fullscreenDiv != undefined)
                        {
                            Analytics.curScene.screenShotIndex--;
                            if(Analytics.curScene.screenShotIndex < 1) { Analytics.curScene.screenShotIndex = 7; }
                            if(Analytics.curScene.screenShotIndex > 7) { Analytics.curScene.screenShotIndex = 1; }
                            Style.SetBGTexture(Analytics.curScene.imagePreviewFullscreen, Analytics.curScene.screenShotLink + (Analytics.curScene.screenShotIndex) + ".jpg");
                        }
                    }
                }
                else
                {
                    return;
                }
            }
        }
    }
}
