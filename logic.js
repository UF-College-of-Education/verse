let pathMap;
const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));
let originalPathMap;
document.addEventListener("DOMContentLoaded", () => {
  fetch("./pathMap.json")
    .then((response) => response.json())
    .then((data) => {

      pathMap = data;
      originalPathMap = deepCopy(pathMap);

    });
});


//Move all of our elements to global variables

const sleep = async (milliseconds) => {
  await new Promise((resolve) => {
    return setTimeout(resolve, milliseconds);
  });
};


function handleVideoEnd(nextScene) {


  if (pathMap[nextScene].hasOwnProperty("option1")) {

    populateButtons(nextScene);
    if (
      pathMap[nextScene].hasOwnProperty("numLoop") &&
      pathMap[nextScene]["numLoop"] >= 2
    ) {

      handleChoice("option2");
    }
  } else {

    if (pathMap[nextScene].hasOwnProperty("endScene")) {
      location.reload();
    }
    handleChoice("option1");
  }
}

function beginExperience() {
  let myVideo = document.getElementById("scene0a");
  document.getElementById("startButton").setAttribute("visible", "false");
  document.getElementById("playPlane").removeAttribute("data-clickable");
  let videoSphere = document.getElementById("videoSphere");
  let firstVideoEnded = function () {

    myVideo.removeEventListener("ended", firstVideoEnded);
    videoSphere.setAttribute("src", "#scene0b");
    let scene0b = document.getElementById("scene0b");
    let secondVideoEnded = function () {
      scene0b.removeEventListener("ended", secondVideoEnded);
      videoSphere.setAttribute("src", "#scene1a");
      let scene1a = document.getElementById("scene1a");
      let thirdVideoEnded = function () {
        scene1a.removeEventListener("ended", thirdVideoEnded);
        videoSphere.setAttribute("src", "#scene2");
        let scene2 = document.getElementById("scene2");
        scene2.addEventListener("ended", function () {

          scene2.removeEventListener("ended", arguments.callee);
          document
            .getElementById("enterButton")
            .setAttribute("visible", "true");
          document
            .getElementById("enterPlane")
            .setAttribute("data-clickable", "true");
        });
        scene2.play();
      };
      scene1a.addEventListener("ended", thirdVideoEnded);
      scene1a.play();
    };
    scene0b.addEventListener("ended", secondVideoEnded);
    scene0b.play();
  };
  myVideo.addEventListener("ended", firstVideoEnded);
  myVideo.play();
}
/**
 * @param {string} choiceID - the ID
 */
function handleChoice(choiceID) {

  let videoSphere = document.getElementById("videoSphere");
  //set current option buttons to invisible
  let option1 = document.getElementById("option1");
  let option2 = document.getElementById("option2");
  let option1Plane = document.getElementById("option1Plane");
  let option2Plane = document.getElementById("option2Plane");
  let flavorText = document.getElementById("flavorText");
  let flavorTextPlane = document.getElementById("flavorTextPlane");
  let flavorTextBool = true;
  option1Plane.removeAttribute("data-clickable");
  option2Plane.removeAttribute("data-clickable");
  option1.setAttribute("visible", "false");
  option2.setAttribute("visible", "false");
  //get the current scene and remove the id tag.
  let currentScene = videoSphere.getAttribute("src").substring(1);
  let option1Next = pathMap[currentScene]["option1Next"];
  let option2Next = pathMap[currentScene]["option2Next"];

  if (choiceID == "option1") {

    let nextScene = pathMap[currentScene]["option1Next"];


    let nextID = pathMap[nextScene]["id"];
    if (pathMap[nextScene].hasOwnProperty("flavorText")) {

      flavorText.setAttribute("value", pathMap[nextScene]["flavorText"]);
      flavorTextBool = true;
      flavorTextPlane.setAttribute("visible", "true");
      flavorText.setAttribute("visible", "true");
    }
    if (pathMap[nextScene].hasOwnProperty("numLoop")) {

      pathMap[nextScene]["numLoop"]++;
    }
    let nextVideo = document.querySelector(nextID);
    videoSphere.setAttribute("src", nextID);

    nextVideo.addEventListener("ended", function videoEnded() {
      console.log("Video ended");
      this.removeEventListener("ended", videoEnded);

      if (pathMap[nextScene].hasOwnProperty("option1")) {

        populateButtons(nextScene);
        if (
          pathMap[nextScene].hasOwnProperty("numLoop") &&
          pathMap[nextScene]["numLoop"] >= 2
        ) {

          handleChoice("option2");
        }
      } else {

        if (pathMap[nextScene].hasOwnProperty("endScene")) {
          location.reload();
        }
        handleChoice("option1");
        //nextScene = videPathMap[nextScene]["option1Next"];
        //nextID = pathMap[nextScene]["id"];
        //videoSphere.setAttribute("src", nextID);
      }
    });

    nextVideo.play();

    setTimeout(() => {
      flavorText.setAttribute("visible", "false");
      flavorTextPlane.setAttribute("visible", "false");
      flavorTextBool = false;
    }, 4000);
  } else {


    let nextScene = pathMap[currentScene]["option2Next"];


    if (pathMap[nextScene].hasOwnProperty("flavorText")) {

      flavorText.setAttribute("value", pathMap[nextScene]["flavorText"]);
      flavorTextBool = true;
      flavorTextPlane.setAttribute("visible", "true");
      flavorText.setAttribute("visible", "true");
    }
    if (pathMap[nextScene].hasOwnProperty("numLoop")) {
      pathMap[nextScene]["numLoop"]++;
    }
    let nextID = pathMap[nextScene]["id"];
    let nextVideo = document.querySelector(nextID);
    videoSphere.setAttribute("src", nextID);
    document.querySelector("#" + currentScene).pause();
    nextVideo.addEventListener("ended", function videoEnded2() {
      console.log("video ended");
      this.removeEventListener("ended", videoEnded2);

      if (pathMap[nextScene].hasOwnProperty("option1")) {

        populateButtons(nextScene);
        if (
          pathMap[nextScene].hasOwnProperty("numLoop") &&
          pathMap[nextScene]["numLoop"] >= 2
        ) {
          handleChoice("option2");
        }
      } else {

        if (pathMap[nextScene].hasOwnProperty("endScene")) {
          location.reload();
        }
        handleChoice("option1");
      }
    });
    document.querySelector(nextID).play();
    setTimeout(() => {
      flavorText.setAttribute("visible", "false");
      flavorTextPlane.setAttribute("visible", "false");
      flavorTextBool = false;
    }, 4000);
  }
}

function populateButtons(scene) {
  let videoSphere = document.getElementById("videoSphere");
  //get the current scene and remove the id tag.
  let currentScene = videoSphere.getAttribute("src").substring(1);
  let option1Plane = document.getElementById("option1Plane");
  let option2Plane = document.getElementById("option2Plane");
  if (pathMap[currentScene].hasOwnProperty("option1")) {

  } else {

    //play current video, then move to next scene
    videoSphere.setAttribute("src", pathMap[currentScene]["id"]);
    currentScene = pathMap[currentScene]["option1Next"];

    handleChoice("option1");
  }
  let option1 = pathMap[currentScene].option1;
  let option2 = pathMap[currentScene].option2;
  let option1Next = pathMap[scene].option1Next;
  let option2Next = pathMap[scene].option2Next;
  let option1Button = document.getElementById("option1");
  let option2Button = document.getElementById("option2");
  option1Button.setAttribute("value", option1);
  option2Button.setAttribute("value", option2);
  option1Button.setAttribute("onclick", "handleChoice('option1')");
  option2Button.setAttribute("onclick", "handleChoice('option2')");
  option1Button.setAttribute("visible", "true");
  option2Button.setAttribute("visible", "true");
  option1Plane.setAttribute("data-clickable");
  option2Plane.setAttribute("data-clickable");
}

function enterRestaurant() {
  let videoSphere = document.getElementById("videoSphere");
  let option1 = document.getElementById("option1");
  let option1Plane = document.getElementById("option1Plane");
  let option2 = document.getElementById("option2");
  let option2Plane = document.getElementById("option2Plane");
  let myVideo = document.querySelector("#scene3a");
  let enterButton = document.getElementById("enterButton");
  let scene3a = document.getElementById("scene3a");
  videoSphere.setAttribute("src", "#scene3a");
  videoSphere.setAttribute("loop", false);
  enterButton.setAttribute("visible", "false");
  document.getElementById("enterPlane").removeAttribute("data-clickable");

  //option1.setAttribute("visible", "false");
  //option1Plane.removeAttribute("data-clickable");
  //option2.setAttribute("visible", "false");
  //option2Plane.removeAttribute("data-clickable");

  scene3a.addEventListener("ended", function () {
    // option1.setAttribute("visible", "true");
    // option1Plane.setAttribute("data-clickable");
    // option2.setAttribute("visible", "true");
    // option2Plane.setAttribute("data-clickable");
    populateButtons("scene3a");
  });
  myVideo.play();
}
