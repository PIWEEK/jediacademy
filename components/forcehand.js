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
        window.location.reload(false);
      });

      el.addEventListener("gripup", evt => {
        console.log("gripup");
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
        console.log("pistolstart")
      });

      el.addEventListener("pistolend", evt => {
        console.log("pistolend")
      });

      el.addEventListener("click", evt => {
        console.log("click")
      });




    }
  });