/*!
 * previewfile - jQuery Plugin
 * version: 1.0.2 
 * @requires jQuery 
 *
 *
 */

 /*

    Initialize with options.
    $( ".preview-link" ).previewfile({linkattr:'data-link'});


 */

// Insert the gmaps plugin
$( document ).ready(function() {
    var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' +
          'callback=initialize';
  document.body.appendChild(script);
});




function initialize(){

}

 (function ( $ ) {
 
    $.fn.previewfile = function( options ) {
 
        var IE =  navigator.userAgent.match(/msie/i),
            settings = $.extend({
            // These are the defaults.

            //
            linkattr: 'href', // attr with the URL of where we will get the file to preview
            minheight: 380,
            minwidth: 600,
            screenpercentage: 0.7, 
            killunavailable: false,
            docsviewer : 'google',

            // Templates
            tpl: {
                overlay  : '<div class="previewfile-overlay"></div>',
                wrap     : '<div class="previewfile-wrap"><div class="previewfile-content"></div</div>',
                image    : '<img id="filepreviewing" class="previewfile-image" src="{href}" alt=""/>',
                video    : '<video id="filepreviewing" controls>  <source src="{href}" type="video/mp4"></video>',
                gmaps    : '<div id="previewfile-gmaps" style="width:{w}px; height:{h}px;"></div>',
                iframe   : '<iframe id="previewfile-frame" name="previewfile-frame" style="width:600px; height:380px;" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' + (IE ? ' allowtransparency="true"' : '') + '></iframe>',
                docviewer: '<iframe id="previewfile-frame" src="{href}" name="previewfile-frame" style="width:{w}px; height:{h}px;" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' + (IE ? ' allowtransparency="true"' : '') + '></iframe>',
                closeBtn : '<div class="previewfile-close" >X</div>',
                googledocs : 'https://docs.google.com/viewer?url=http://',
		    offieviewer : 'https://view.officeapps.live.com/op/view.aspx?src=http://'
            },

            extensions: {
                img      : [ 'png', 'jpg', 'jpeg', 'gif' ],
                pdf      : ['pdf' ],
                gmaps    : [ 'kml', 'kmz' ],
                office    : [ 'doc', 'docx', 'xls', 'xlsx', 'pdf', 'pptx', 'ppt' ],
                video    : [ 'mp4' ] 
            }

        }, options );

        // Delete the unsupirted
        //settings.killunavailable = true;
        if (settings.killunavailable == true) {
            //console.log("kill");
            links = document.querySelectorAll(".preview-link");

                            $.each(links, function (i, val) {
                                dl = $(val).attr(settings.linkattr);
                                var ext = dl.split('.').pop().toLowerCase();
                                //console.log(ext);
                                if ((jQuery.inArray( ext, settings.extensions.img ) == -1) && 
                                    (jQuery.inArray( ext, settings.extensions.pdf ) == -1) && 
                                    (jQuery.inArray( ext, settings.extensions.gmaps ) == -1) && 
                                    (jQuery.inArray( ext, settings.extensions.office ) == -1) &&
                                    (jQuery.inArray( ext, settings.extensions.video ) == -1)){
                                    $(val).remove();
                                    //console.log(val+"12");
                                }

                            });
        }

        // Closes window on background click
        $('body').on("click", '.previewfile-overlay, .previewfile-close', function(){

            $('.previewfile-overlay, .previewfile-wrap').remove();

        });

        // ESC Keypress closes window (27 = esc)
        $(document).on('keyup',function(e){
             if(e.keyCode==27){ $('.previewfile-overlay').click(); }
         });

        $(document).on('keyup',function(e){
             if(e.keyCode==37){ 
                if ($(".previewfile-overlay").length > 0){
                    alert("izq");
                }
             }
         });

        $(document).on('keyup',function(e){
             if(e.keyCode==39){ 
                if ($(".previewfile-overlay").length > 0){
                    alert("der");
                }
             }
         });

        

        function TemplateOutput(template, event) {

            event.preventDefault();
            event.stopPropagation();

            basewidth = $(window).width() * settings.screenpercentage;
            baseheight = $(window).height() * settings.screenpercentage;
            
            //console.log(template);
            $(settings.tpl.overlay).appendTo('body'); //Crea Overlay (fondo negro)
            $(settings.tpl.wrap).appendTo('body'); //Crea Contenedor
            $('.previewfile-wrap').height(baseheight).width(basewidth); // Ajustar tamaño
            $(settings.tpl.closeBtn).appendTo('.previewfile-wrap'); // Crea boton de cerrar el contenedor
            $(template).appendTo('.previewfile-content');

        }


        function initialize(hreflink) { //http://www.carlosgz.com/Censo.kml    //  time-stamp-point.prepoint.test.kmz

                  //var href = 'http://www.carlosgz.com/Censo.kml';
                  var href = window.location.origin + hreflink;

                  var mapOptions = {
                    zoom: 11,
                    center: new google.maps.LatLng(29.70841863735922, -112.1596015811261)
                  }

                  var map = new google.maps.Map(document.getElementById('previewfile-gmaps'), mapOptions);

                  var layer = new google.maps.KmlLayer({
                        url: href }); // Cambiar por href
                  layer.setMap(map);

        }  

        function resize(href, type){ // procesa atributos del preview (width & height) antes del resizefinal


            if ( type== "image" ){ // resize para imagenes

                var imgLoad = $("<img />"); // inicializa imagen antes de descargarla para ver atributos (tamaño)
                imgLoad.attr("src", href);
                imgLoad.unbind("load");
                imgLoad.bind("load", function () { // Sete atributos de imagen obtenidos al wrap.
                    resizefinal(this.width, this.height);
                });

            }else if (type== "video"){ // resize para videos

                 $("#filepreviewing").bind("loadedmetadata", function () {
                    resizefinal(this.videoWidth, this.videoHeight);
                });

            }

           
        }

        function resizefinal (fwidth, fheight) { // Solo para imagenes y videos

                    windowwidth = $(window).width();
                    windowheight = $(window).height();

                    percentagea = Math.round((windowwidth / fwidth) * 100);
                    percentageb = Math.round((windowheight / fheight) * 100);

                    if ((windowwidth * settings.screenpercentage) < fwidth ) { var newwidth = windowwidth * settings.screenpercentage; var newheight = fheight * (newwidth / fwidth); }
                    else if ((windowheight * settings.screenpercentage) < fheight ) {  var newheight = windowheight * settings.screenpercentage; var newwidth = fwidth * (newheight / fheight); }
                    else { var newheight = fheight; var newwidth = fwidth; }

                    $(".previewfile-wrap").width(newwidth);
                    $(".previewfile-wrap").height(newheight);
                    //console.log(fwidth + " - " + fheight + " and " + newwidth + " - " + newheight + " %" + percentagea);

        }
 
        
        return this.click(function (event) { // http://127.0.0.1/companyprojects/edit/29?CompanyId=3&s=b
                        
            var href = $(this).attr(settings.linkattr),
                template = "";
             // Previene el funcionamiento normal del elemento (si es anchor no linkea)

            var link_extension = href.split('.').pop().toLowerCase();

            if (jQuery.inArray( link_extension, settings.extensions.img ) != -1) { // Busca si la extension es de imagen
                template = settings.tpl.image.replace('{href}', href);
                TemplateOutput(template, event);
                resize(href, type = "image");
                
            }else if (jQuery.inArray( link_extension, settings.extensions.video ) != -1){ // Video
                template = settings.tpl.video.replace('{href}', href);
                TemplateOutput(template, event);
                resize(href, type = "video");

            }else if (jQuery.inArray( link_extension, settings.extensions.gmaps ) != -1){ // Gmaps
                template = settings.tpl.gmaps.replace('{href}', href);
                template = template.replace('{w}', ($(window).width() * settings.screenpercentage));
                template = template.replace('{h}', ($(window).height() * settings.screenpercentage));
                TemplateOutput(template, event);
                initialize(href);

                console.log(($(window).height() * settings.screenpercentage) + " - " + $(window).width() * settings.screenpercentage );

            }else if (jQuery.inArray( link_extension, settings.extensions.office ) != -1){ // Office
                //href = 'https://docs.google.com/viewer?url=' + 'http://opessa.dyndns.org/companyprojectsfiles/118/Campana.xls' + '&embedded=true';
                
		    if (link_extension == 'pdf'){
			href = 'http://' + document.location.host + href;
		    }else if (settings.docsviewer == 'office'){
			href = settings.tpl.offieviewer + document.location.host + href;
		    }else if (settings.docsviewer == 'google'){ 
			href = settings.tpl.googledocs + document.location.host + href + '&embedded=true';
                }
                template = settings.tpl.docviewer.replace('{href}', href);
                template = template.replace('{w}', $(window).width() * settings.screenpercentage);
                template = template.replace('{h}', $(window).height() * settings.screenpercentage);
                TemplateOutput(template, event);
            } 

            // Link para el iframe del gdocs: (no aggara los nuevos docx )
            // https://docs.google.com/viewer?url=http://opessa.dyndns.org/companyprojectsfiles/118/Campana.xls&embedded=true
            // https://docs.google.com/gview?url=http://opessa.dyndns.org/companyprojectsfiles/118/Campana.xls&embedded=true
        });
 
    };
 
}( jQuery ));