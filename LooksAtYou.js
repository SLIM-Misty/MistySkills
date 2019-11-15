misty.Debug("Looking at you skill is starting!")

//misty.Debug("Centering Head");
//misty.MoveHeadDegrees(-20, 0, 0, 100);
//misty.MoveArmPosition("left", 0, 45);
//misty.MoveArmPosition("right", 0, 45);

//after 3 seconds, call timeout
misty.RegisterTimerEvent("FaceRecognitionTimeout", 3000);

// Returns a random integer between min and max
function getRandomInt(min, max) {
   	return Math.floor(Math.random() * (max - min + 1)) + min;
}

misty.RegisterEvent("FaceRecognition", "FaceRecognition", 250);
//misty.RegisterTimerEvent("look_around", getRandomInt(5, 10) * 1000, false);


//not using this, function to make misty look around randomly repeatedly
function _look_around(repeat = true) {

    // Moves Misty's head to a random position. Adjust the min/max
    // values passed into getRandomInt() to change Misty's range of
    // motion when she calls this method.
    misty.MoveHeadDegrees(
        getRandomInt(-40, 20), // Random pitch position between -40 and 20
        getRandomInt(-30, 30), // Random roll position between -30 and 30
        getRandomInt(-40, 40), // Random yaw position between -40 and 40
        30); // Head movement velocity. Can increase up to 100.

        // If repeat is set to true, re-registers for the look_around
        // timer event, and Misty moves her head until the skill ends.
        if (repeat) misty.RegisterTimerEvent(
        "look_around",
       getRandomInt(5, 10) * 1000,
        false);
	
}

//waves Misty's right arm
function waveRightArm() {
    	misty.MoveArmDegrees("right", -80, 30); // Right arm up to wave
    	misty.Pause(2000); // Pause with arm up for 2 seconds
    	misty.MoveArmDegrees("both", 80, 30); // Both arms down
}



/**********************************************************************
Using Face Recognition
This code has Misty start attempting to detect and recognize faces. If
you've trained Misty on your own face, then Misty waves when she sees
you. If Misty sees a person she doesn't know, she raises her eyebrows
and plays a sound.
If you haven't already trained Misty to recognize your face, use the
Command Center to do so before running the code in this section.
**********************************************************************/

// Invoke this function to start Misty recognizing faces.
function _registerFaceRec() {
	misty.DisplayImage("e_DefaultContent.jpg"); //display default face image
	misty.RegisterTimerEvent("FaceRecognitionTimeout", 3000); //time out after 3 seconds
  	// Cancels any face recognition that's currently underway
    	misty.StopFaceRecognition();
    	// Starts face recognition
    	misty.StartFaceRecognition();

    	// If a FaceRecognition event includes a "PersonName" property,
    	// then Misty invokes the _FaceRec callback function.
    	misty.AddPropertyTest("FaceRec", "PersonName", "exists", "", "string");
    	// Registers for FaceRecognition events. Sets eventName to FaceRec,
    	// debounceMs to 1000, and keepAlive to false.
   	misty.RegisterEvent("FaceRec", "FaceRecognition", 1000, false);
}

// FaceRec events invoke this callback function.
function _FaceRec(data) {

	misty.Debug("FaceRec event function is starting!")
	misty.Stop(); //stop her from moving
    	// Stores the value of the detected face
    	var faceDetected = data.PropertyTestResults[0].PropertyValue;
    	// Logs a debug message with the label of the detected face
    	misty.Debug("Misty sees " + faceDetected);

   	// Use the Command Center to train Misty to recognize your face. 
	//Then, replace <Your-Name> below with your own name! 
	//If Misty sees and recognizes you, she waves and looks happy.

   	//if (faceDetected == "<Your-Name>") {
        //	misty.DisplayImage("e_Joy.jpg");
        //	misty.PlayAudio("s_Joy3.wav");
        //	waveRightArm();
    	//}
	
	if (faceDetected == "Sarah") {
        	misty.DisplayImage("e_Joy.jpg");
        	misty.PlayAudio("s_Joy3.wav");
        	waveRightArm();
    	}
    	// If misty sees someone she doesn't know, she raises her eyebrow
    	// and plays a different sound.
    	else if (faceDetected == "unknown person") {
        	misty.DisplayImage("e_Contempt.jpg");
       		misty.PlayAudio("s_DisorientedConfused4.wav");
    	};

    	// Register for a timer event to invoke the _registerFaceRec
   	// callback function loop through the _registerFaceRec() again after 3000 milliseconds pass.
    	misty.RegisterTimerEvent("registerFaceRec", 3000, false);
}

// FaceDetectionTimeout callback
function _FaceRecognitionTimeout() {
    	misty.Debug("face detection timeout called, it's taking too long...");
	
	//turn to the right
	misty.DriveTime(0, 30, 5000);
	misty.Pause(3000);

	//misty.DriveTime(0, -30, 5000);
	//misty.Pause(3000);
	misty.Stop();
    	// Change LED to black
    	misty.ChangeLED(0, 0, 0);
	_registerFaceRec();
  
	// Register for a timer event to invoke the _registerFaceRec
    	// callback function loop through the _registerFaceRec() again
    	// after 3000 milliseconds pass.
    	misty.RegisterTimerEvent("registerFaceRec", 3000, false);
};

// Starts Misty recognizing faces!
_registerFaceRec();