const MAIN_URL = "https://neko-sama.fr/";
const IFRAME_URL = "https://www.pstream.net/";
const NEXT_BUTTON = document.querySelector("a.ui.button.small.with-svg-right");

let timeleft = 5;
let mouseMove = false;

if (document.location.href.includes(MAIN_URL)) neko_sama();
if (document.location.href.includes(IFRAME_URL)) iframe();

function neko_sama() {
   let alertFinVideo = false;


   var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
   var eventer = window[eventMethod];
   var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

   eventer(messageEvent,function (e) {
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
         default:
            break;
      }
   }

   function showTime() {
      if (!mouseMove) {
         const phrase = "Épisode suivants dans: ";
         
         var t = document.createElement('h2');
         t.innerHTML = phrase;
         t.id = "Timer";
         
        if (!document.querySelector('h2#Timer'))
            document.querySelectorAll('div.container')[1].insertBefore(t, document.querySelectorAll('div.container')[1].children[0]);
         //timer
         var NextTimer = setInterval(function () {
            if (timeleft <= 0) {
               clearInterval(NextTimer);
               NEXT_BUTTON.click();
            }
            document.querySelector('h2#Timer').innerHTML = phrase + timeleft;
            if (document.fullscreen) document.exitFullscreen();
            document.body.onmousemove = () => {
               console.log("TimerStop");
               t.hidden = true;
               mouseMove = true;
               document.body.onmousemove = ()=>{};
               clearInterval(NextTimer);
            }; //mousemove

            timeleft -= 1;

         }, 1000);
         //timer  end
      }//mousemove
   }//showTime
}

//---------------
function iframe() {
   let video = document.querySelector("video");
   video.addEventListener("loadeddata",function () {
         console.log("video load");
         setInterval(() => sendTime(), 5000);
         function sendTime() {
            console.log(
               "scan: ",
               video.currentTime,
               video.duration - (30 + timeleft)
            );
            if (video.ended) parent.postMessage("NEKO_SAMA-FIN", "*");
            if (video.currentTime >= video.duration - (30 + timeleft)) {
               parent.postMessage("NEKO_SAMA-TIMER", "*");

            } //end if
            /*
                    if (video.currentTime >= video.duration - 30 && !mouseMove)
                      parent.postMessage("NEKO_SAMA-NEXT", "*");*/

            parent.postMessage(`{NEKO_SAMA-VIDEO_cTIME: ${video.currentTime},NEKO_SAMA-VIDEO_DURATION:${video.duration} `,"*");
            //  `*` on any domain
         }
      },
      false
   );
   setTimeout(AntiAntiAdblock, 1500);
   setTimeout(() => {
      document.querySelector("div.jw-icon.jw-icon-display.jw-button-color.jw-reset").click();

      function openFullscreen() {
         document.addEventListener("click", fc);

         function fc() {
            if (!window.screenTop && !window.screenY && !document.fullscreen) {
               if (document.querySelector("div.jw-icon.jw-icon-inline.jw-button-color.jw-reset.jw-icon-fullscreen.jw-fullscreen-ima"))
                  document.querySelector("div.jw-icon.jw-icon-inline.jw-button-color.jw-reset.jw-icon-fullscreen.jw-fullscreen-ima").click();
            }
         }
      }
      openFullscreen();
   }, 3000);

   function AntiAntiAdblock() {
      document.querySelectorAll("div")[document.querySelectorAll("div").length - 1].remove();

      while (document.querySelector("a")) document.querySelector("a").remove();
   }
}