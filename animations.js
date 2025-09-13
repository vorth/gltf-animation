class AnimationViewer
{
   static run (browser)
   {
      this .viewer = new AnimationViewer( browser );
   }

   constructor (browser)
   {
      browser .setBrowserOption( "ColorSpace", "LINEAR" );

      this .browser      = browser;

      browser .addBrowserCallback( "init", X3D .X3DConstants .INITIALIZED_EVENT, this .addAnimations.bind(this) );
   }

   get scene ()
   {
      return this .browser .currentScene;
   }

   async addAnimations ()
   {
      await this .browser .nextFrame ();

      if (!this .browser .activeViewpoint ?.description)
         this .browser .viewAll (0);

      const animations = this .scene .getExportedNode ("Animations");

      if (!animations)
         return;

      const options = document .createElement( "div" );
      options .classList .add ("gltf-options");
      this.browser .element .parentNode .appendChild( options );

      const animationsElem = document .createElement( "div" );
      animationsElem .classList .add ("gltf-animations");
      options .appendChild( animationsElem );
      const title = document .createElement( "h3" );
      title .textContent = "Animations";
      animationsElem .appendChild( title );

      for (const [i, group] of animations .children .entries ())
      {
         const timeSensor = group .children [0];

         const onclick = () =>
         {
            // group .toggleClass (["fa-circle", "fa-circle-dot", "selected"]);
            // group .toggleClass ("selected");

            for (const kids of animations .children)
               kids .children [0] .stopTime = Date .now () / 1000;

            // if (!group .hasClass ( "fa-circle-dot"))
            //    return;

            // $("#animations i") .each ((_, element) =>
            // {
            //    if (element === $(`#animation${i}`) .get (0))
            //       return;

            //    $(element) .removeClass (["fa-circle-dot", "selected"]) .addClass ("fa-circle");
            //    $(`[for=${$(element) .attr ("id")}]`) .removeClass ("selected");
            // });

            timeSensor .loop      = false;
            timeSensor .startTime = Date .now () / 1000;
         };

         const button = document .createElement ("button");
         button .classList .add ("check");
         button .setAttribute ("for", `animation${i}`);
         button .textContent = group .children [0] .description;
         button .addEventListener ("click", onclick);
         animationsElem .appendChild (button);

         const icon = document .createElement ("i");
         icon .classList .add ("fa-regular", "fa-circle");
         icon .setAttribute ("id", `animation${i}`);
         button .prepend (icon);
      }

      // $("#animations") .show () .find ("button") .first () .trigger ("click");
   }

}

AnimationViewer .run( X3D .getBrowser() );

