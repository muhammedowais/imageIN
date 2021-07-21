imageIN = function ( options ) {

	if ( typeof options == 'undefined' || typeof options.ele == 'undefined' || typeof options.name == 'undefined' ) 
		throw "Element and Name Required";

	var _this = this;

	this.Options = {
        fontSize: '12px',
        width: '256px',
        height: '144px',
        background: '#fff',
        color: '#606060',
        imageBackground: '#000',
        fontFamily: '"Roboto", "Noto", sans-serif',
        border: '2px dashed #0000001a',
        borderRadius: '0px',
        labelText: 'Upload Image',
        preLoadImage: '',
        afterCreated: '',
        afterImageLoaded: '',
        afterPreLoadImage: '',
        afterImageChanged: '',
        iconType: 'image', //values image, upload
        dropText: 'Drop Here!',
        dropBorder: '2px solid #0000001a',
        dropBackground: 'rgb(245 238 238)',
        dropColor: '#606060'
	};

	// Overwriting default values
  	for( var key in options ){
    	this.Options[key] = options[key];
  	}

  	this.Options.ele = document.querySelector(this.Options.ele);
  	this.Options.fontFamily = this.Options.fontFamily.replace(/"/g, "'");

  	if ( this.Options.iconType != 'image' && this.Options.iconType != 'upload' ) {

  		this.Options.iconType = 'image';

  	}

	_createUI();
	_bindEvents();

	function _createUI( ele ) {

		_this.Options.ele.innerHTML = `
			<div class="imagein-wrapper" style="width:${_this.Options.width};height:${_this.Options.height};background:${_this.Options.background};border:${_this.Options.border};border-radius:${_this.Options.borderRadius};font-family:${_this.Options.fontFamily}">
	            <label for="${_this.Options.name}">
	                <div>
	                  <div class="imagein-icon-wrapper">
	                  	${_getIcon( _this.Options.iconType, _this.Options.color )}
	                  </div>
	                  <div class="imagein-text" style="font-size:${_this.Options.fontSize};color:${_this.Options.color};">${_this.Options.labelText}</div>
	                </div>
	                <input type="file" name="${_this.Options.name}" id="${_this.Options.name}" title="Click or Drop" accept="image/*">
	                <div class="imagein-img-wrapper">
	                	<div class="imagein-img" style="background-color:${_this.Options.imageBackground}"></div>
		                <div class="imagein-img-overlay">
		                	<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
								<path d="M27 0c2.761 0 5 2.239 5 5 0 1.126-0.372 2.164-1 3l-2 2-7-7 2-2c0.836-0.628 1.874-1 3-1zM2 23l-2 9 9-2 18.5-18.5-7-7-18.5 18.5zM22.362 11.362l-14 14-1.724-1.724 14-14 1.724 1.724z"></path>
							</svg>
		                </div>
	                </div>
	            </label>
	        </div>`;

		if ( _this.Options.preLoadImage != '' ) {

			_loadImage( _this.Options.preLoadImage );

			if ( typeof _this.Options.afterPreLoadImage === 'function' ) {
				_this.Options.afterPreLoadImage( _this );
			}

		}

		if ( typeof _this.Options.afterCreated === 'function' ) {
			_this.Options.afterCreated( _this );
		}

	}

	function _bindEvents() {

		var ele = _this.Options.ele;
		var input = ele.querySelector('input[type="file"]');
		
		ele.querySelector('.imagein-wrapper').addEventListener('dragover', function( e ) {

			if ( _containsFiles( e ) ) {

				this.style.border = _this.Options.dropBorder;
				this.style.background = _this.Options.dropBackground;
				this.querySelector('.imagein-icon-wrapper').innerHTML = _getIcon( 'drop', _this.Options.dropColor );
				this.querySelector('.imagein-text').innerHTML = _this.Options.dropText;
				this.querySelector('.imagein-text').style.color = _this.Options.dropColor;

				if ( this.querySelector('.imagein-img img') != null ) {

					this.querySelector('.imagein-img-wrapper').style.visibility = 'hidden';
					this.querySelector('.imagein-img img').style.visibility = 'hidden';

				}
				
			}

		});

		ele.querySelector('.imagein-wrapper').addEventListener('dragleave', function( e ) {
		            
			_resetStyle( this );

			if ( this.querySelector('.imagein-img img') != null ) {

				this.querySelector('.imagein-img-wrapper').style.visibility = 'visible';
				this.querySelector('.imagein-img img').style.visibility = 'visible';

			}

		});

	    input.addEventListener('change', function( e ) {
            
            if ( this.files && this.files[0] ) {

	            var reader = new FileReader();
	            var _thisEvent = this;

	            reader.onload = function (e) {
  					
    				_loadImage( e.target.result );

    				if ( typeof _this.Options.afterImageChanged === 'function' ) {

    					var data = _this;
    					data.files = _thisEvent.files;
						_this.Options.afterImageChanged( data );

					}

	            }
	            reader.readAsDataURL( _thisEvent.files[0] );
	        }

        });
	
	}

	function _loadImage( img ) {

		var ele = _this.Options.ele;
		var input = ele.querySelector('input[type="file"]');

		_resetStyle( ele.querySelector('.imagein-wrapper') );

		var image = new Image();
		image.src = img;

		image.onload = function() {
			
			var width = input.clientWidth;
			var height = input.clientHeight;
			var sizeStyle = ( ( width >= height ) ? `height:${height}px;` : `width:${width}px;` );

            ele.querySelector('.imagein-img-wrapper').style.visibility = "visible";
			ele.querySelector('.imagein-img').innerHTML = `<img src="${img}" style="${sizeStyle};visibility:hidden;">`;
			var rederedImg = ele.querySelector('.imagein-img img');
			var container = ele.querySelector('.imagein-wrapper');

			if ( rederedImg.width >= container.clientWidth ) {
				rederedImg.style.width = container.clientWidth + 'px';
				rederedImg.style.height = 'auto';
			}

			rederedImg.style.visibility = 'visible';

		}

		if ( typeof _this.Options.afterImageLoaded === 'function' ) {
			_this.Options.afterImageLoaded( _this );
		}
	
	}

	function _getIcon( type, color ) {

		var icons = {
	  		image: `<svg viewBox="3 2 19 19">
	                    <g viewBox="0 0 24 24">
	                    	<path fill="${color}" d="M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z"></path>
	                    </g>
	                </svg>`,
	  		upload: `<svg viewBox="0 0 480 448">
				 		<path fill="${color}" d="M320 216c0-2-0.75-4.25-2.25-5.75l-88-88c-1.5-1.5-3.5-2.25-5.75-2.25-2 0-4.25 0.75-5.75 2.25l-87.75 87.75c-1.5 1.75-2.5 3.75-2.5 6 0 4.5 3.5 8 8 8h56v88c0 4.25 3.75 8 8 8h48c4.25 0 8-3.75 8-8v-88h56c4.5 0 8-3.75 8-8zM480 288c0 53-43 96-96 96h-272c-61.75 0-112-50.25-112-112 0-43.5 25.25-83 64.5-101.25-0.25-3.75-0.5-7.25-0.5-10.75 0-70.75 57.25-128 128-128 52 0 98.75 31.5 118.5 79.5 11.5-10 26.25-15.5 41.5-15.5 35.25 0 64 28.75 64 64 0 12.25-3.5 24.25-10.25 34.5 43.5 10.25 74.25 49 74.25 93.5z"></path>
				 	</svg>`,
	  		drop: `<svg viewBox="0 0 512 512">
						<path fill="${color}" d="M256 496l240-240h-144v-256h-192v256h-144z"></path>
					</svg>`
	  	};

	  	return icons[type];
	
	}

	function _resetStyle( ele ) {

		ele.style.border = _this.Options.border;
		ele.style.background = _this.Options.background;
		ele.querySelector('.imagein-icon-wrapper').innerHTML = _getIcon( _this.Options.iconType, _this.Options.color );
		ele.querySelector('.imagein-text').innerHTML = _this.Options.labelText;
		ele.querySelector('.imagein-text').style.color = _this.Options.color;
	
	}

	function _containsFiles( event ) {

	    if (event.dataTransfer.types) {
	        for (var i = 0; i < event.dataTransfer.types.length; i++) {
	            if (event.dataTransfer.types[i] == "Files") {
	                return true;
	            }
	        }
	    }
	    
	    return false;

	}

}