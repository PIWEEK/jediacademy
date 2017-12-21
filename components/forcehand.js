AFRAME.registerComponent('forcehand', {
    schema: {
      default: '',
      parse: AFRAME.utils.styleParser.parse
    },

    init: function () {
      const data = this.data;
      const el = this.el;

      el.addEventListener("pointup", evt => {
        console.log("pointup")
        console.log(evt)


      });

      el.addEventListener("pointdown", evt => {
        console.log("pointdown")
        console.log(evt)


      });


      el.addEventListener("gripdown", evt => {
        console.log("gripdown");
        console.log(evt);
        if (evt.target.id == "leftHand"){
          document.querySelector("#single-lightsaber-blade-2").emit("gripdown");
        } else {
          document.querySelector("#single-lightsaber-blade-1").emit("gripdown");
          document.querySelector("#dual-lightsaber-blade").emit("gripdown");
          document.querySelector("#player-assault-rifle").emit("gripdown");
        }

      });

      el.addEventListener("gripup", evt => {
        console.log("gripup");
        console.log(evt);
        if (evt.target.id == "leftHand"){
          document.querySelector("#single-lightsaber-blade-2").emit("gripup");
        } else {
          document.querySelector("#single-lightsaber-blade-1").emit("gripup");
          document.querySelector("#dual-lightsaber-blade").emit("gripup");
          document.querySelector("#player-assault-rifle").emit("gripup");
        }

      });

      el.addEventListener("thumbup", evt => {
        console.log("thumbup")
      });

      el.addEventListener("thumbdown", evt => {
        console.log("thumbdown")
      });
      el.addEventListener("pointingstart", evt => {
        console.log("pointingstart")
      });

      el.addEventListener("pointingend", evt => {
        console.log("pointingend")
      });

      el.addEventListener("pistolstart", evt => {
        console.log("pistolstart");
        document.querySelector("#player-assault-rifle").emit("pistolstart");
      });

      el.addEventListener("pistolend", evt => {
        console.log("pistolend");
        document.querySelector("#player-assault-rifle").emit("pistolend");
      });

      el.addEventListener("click", evt => {
        console.log("click")
      });




    }
  });