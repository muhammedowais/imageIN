imageIN = function ( options ) {

	if ( typeof options == 'undefined' || typeof options.ele == 'undefined' || typeof options.name == 'undefined' ) 
		throw "Element and Name Required";

	var _this = this;

	this.Options = {
        fontSize: '12px',
        width: '157px',
        height: '88px',
        background: '#fff',
        color: '#606060',
        imageBackground: '#000',
        fontFamily: '"Roboto", "Noto", sans-serif',
        border: '1px dashed #0000001a',
        preLoadImage: '',
        afterCreated: '',
        afterImageLoaded: '',
        afterPreLoadImage: '',
        afterImageChanged: ''
	};

	// Overwriting default values
  	for( var key in options ){
    	this.Options[key] = options[key];
  	}

  	this.Options.ele = document.querySelector(this.Options.ele);
  	this.Options.fontFamily = this.Options.fontFamily.replace(/"/g, "'");

	_createUI();
	_bindEvents();

	function _createUI( ele ) {

		_this.Options.ele.innerHTML = `
			<div class="imagein-wrapper" style="width:${_this.Options.width};height:${_this.Options.height};background:${_this.Options.background};border:${_this.Options.border};font-family:${_this.Options.fontFamily}">
	            <label for="${_this.Options.name}">
	                <div>
	                  <svg viewBox="3 2 19 19" preserveAspectRatio="xMidYMid meet" focusable="false">
	                    <g viewBox="0 0 24 24" style="fill:${_this.Options.color};">
	                        <path d="M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z"></path>
	                    </g>
	                  </svg>
	                  <div style="font-size:${_this.Options.fontSize};color:${_this.Options.color};">Upload Image</div>
	                </div>
	                <input type="file" name="${_this.Options.name}" id="${_this.Options.name}">
	                <div class="imagein-img" style="background-color:${_this.Options.imageBackground}"></div>
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
		
	    input.addEventListener('change', function( e ) {
            
            if ( this.files && this.files[0] ) {

	            var reader = new FileReader();
	            reader.onload = function (e) {
  					
    				_loadImage( e.target.result );

    				if ( typeof _this.Options.afterImageChanged === 'function' ) {
						_this.Options.afterImageChanged( _this );
					}

	            }
	            reader.readAsDataURL( this.files[0] );
	        }

        });
	
	}

	function _loadImage( img ) {

		var ele = _this.Options.ele;
		var input = ele.querySelector('input[type="file"]');

		var image = new Image();
		image.src = img;

		image.onload = function() {
			
			var width = input.clientWidth;
			var height = input.clientHeight;
			var sizeStyle = ( ( width >= height ) ? `height:${height}px;` : `width:${width}px;` );

            ele.querySelector('.imagein-img').style.visibility = "visible";
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

}