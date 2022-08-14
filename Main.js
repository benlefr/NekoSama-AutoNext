const MAIN_URL = "https://neko-sama.fr/";
const IFRAME_URL = "https://www.pstream.net/";
const NEXT_BUTTON = document.querySelector("a.ui.button.small.with-svg-right");
const FULL_SCREEN_ON = "fullscreenOn";
const FULL_SCREEN_OFF="fullscreenOff";

let timeleft = 5;
let mouseMove = false;
if (document.location.href.includes(MAIN_URL)) neko_sama();
if (document.location.href.includes(IFRAME_URL)) iframe();

function neko_sama() {
if(localStorage.getItem('fullscreen') === '1') fullscreenAutoPlay();
  //iframe fullscreen
  function fullscreenAutoPlay() {
   setTimeout(() => {
      
      document
         .querySelector("#un_episode")
         .setAttribute(
         "style",
         "overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:100%;width:100%;position:absolute;top:0px;left:0px;right:0px;bottom:0px"
         );
      document.body.insertBefore(
         document.querySelector("#un_episode"),
         document.body.firstChild
      );
      document.body.childNodes.forEach((e) => {
         if (e.id != "un_episode") e.hidden = true;
      });
   }, 500);
  }

  //end full screen

  let alertFinVideo = false;
  document.querySelector("iframe").allow = "autoplay";
document.querySelector("div#display-player").insertBefore( document.querySelector('iframe'),document.querySelector("div#display-player").children[0]);
  var eventMethod = window.addEventListener ? "addEventListener": "attachEvent";
  var eventer = window[eventMethod];
  var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

  eventer(
    messageEvent,
    function (e) {
      if (typeof e.data === "string") action(e.data);
    },
    false
  );

  function action(msg) {
    switch (msg) {
      case "NEKO_SAMA-NEXT":
        NEXT_BUTTON.click();
        break;
      case "NEKO_SAMA-TIMER":
        showTime();
        break;
      case "NEKO_SAMA-FIN":
        if (!alertFinVideo) {
          alert("fin de la video...");
          alertFinVideo = true;
        }
        break;
      case FULL_SCREEN_ON:
         localStorage.setItem('fullscreen', 1);
        break;
      case FULL_SCREEN_OFF:
         localStorage.setItem('fullscreen', 0);
        break;   
      case "reload":
         location.reload();
      break;    
      case "restaure":
        restaure();
      break;
      default:
        break;
    }
}

function restaure() {
  document.body.childNodes.forEach((e) => {
    if (e.id != "un_episode") e.hidden = false;
  });
  document.querySelector('iframe').style = "";
  if(!document.querySelector('div#display-player').hasChildNodes())
    document.querySelector('div#display-player').appendChild(document.querySelector('iframe'));
}
  function showTime() {
    if (!mouseMove) {
      const PHRASE = "Épisode suivants dans: ";
      var t = document.createElement("h2");
      t.innerHTML = PHRASE;
      t.id = "Timer";
      t.setAttribute("style","color: red; overflow:hidden;overflow-x:hidden;overflow-y:hidden;position:absolute;top:0px;left:50%;right:0px;bottom:0px;z-index: 1;");


      if (!document.querySelector("h2#Timer") ){
        if(localStorage.getItem('fullscreen') === '0') 
          document.querySelector("div#display-player").insertBefore(t,document.querySelector("div#display-player").children[0]);
        else  document.body.insertBefore(t, document.body.firstChild);
}
      //timer
      var NextTimer = setInterval(function () {
        if (timeleft <= 0) {
          NEXT_BUTTON.click();
          clearInterval(NextTimer);
        }
        document.querySelector("h2#Timer").innerHTML = PHRASE + timeleft;
        if (document.fullscreen){
             document.exitFullscreen();
         }
        document.body.onmousemove = () => {
          console.log("TimerStop");
          t.hidden = true;
          mouseMove = true;
          document.body.onmousemove = () => {}; //reset
          clearInterval(NextTimer);
        }; //mousemove

        timeleft -= 1;
      }, 1000);
      //timer  end
    } //mousemove
  } //showTime
}

//---------------
function iframe() {
  let autoExit = false;
  let video = document.querySelector("video");
  
  document.addEventListener("fullscreenchange", () => {
   if(document.fullscreen) sendMSG(FULL_SCREEN_ON);
   else if(!autoExit) sendMSG(FULL_SCREEN_OFF);
  });

  video.addEventListener("loadeddata",function () {
    console.log("video load");
    document.querySelector('div.jw-controlbar.jw-reset').lastChild.lastChild.addEventListener('click', ()=>{if(document.fullscreen) {autoExit = false; sendMSG('restaure')}});
    
    setInterval(() => sendTime(), 5000);
      function sendTime() {
      console.log(
          "scan: ",
          video.currentTime,
          video.duration - (30 + timeleft)
        );
        if (video.ended) sendMSG("NEKO_SAMA-FIN");
        if (video.currentTime >= video.duration - (30 + timeleft)) {
        if (document.fullscreen){
            document.exitFullscreen();
            autoExit = true;
         }
          sendMSG("NEKO_SAMA-TIMER");
        } //end if
        // sendMSG(`{"NEKO_SAMA-VIDEO_cTIME": ${video.currentTime},"NEKO_SAMA-VIDEO_DURATION":${video.duration}}`);
        //  `*` on any domain
      }
    },
    false
  );
  setTimeout(AntiAntiAdblock, 500);
  setTimeout(() => {
    document
      .querySelector("div.jw-icon.jw-icon-display.jw-button-color.jw-reset")//play button rouge
      .click();
  }, 3000);

  function AntiAntiAdblock() {
    document.querySelector("div.basic-display").remove(); // Un bloqueur de pub (AdBlock ou autre) empêche le chargement de vidéos et de sous-titres, essayer de le désactiver et recharger la page.

    document
      .querySelectorAll("div")
      [document.querySelectorAll("div").length - 1].remove();

    while (document.querySelector("a")) document.querySelector("a").remove();
  }
  function sendMSG(msg) {
    parent.postMessage(msg, "*");
  }
}
