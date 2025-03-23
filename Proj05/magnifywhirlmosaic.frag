#version 330 compatibility

uniform float		uSc;
uniform float		uTc;
uniform float		uRad;
uniform float		uMag;
uniform float		uWhirl;
uniform float		uMosaic;
uniform float		uPower;
uniform sampler2D	uTexUnit;
uniform sampler2D	uImageUnit;

// interpolated from the vertex shader:
in  vec2  vST;                  // texture coords


// for Mac users:
//	Leave out the #version line, or use 120
//	Change the "in" to "varying"


void
main( )
{       
	vec2 st = vST - vec2(uSc, uTc);	// make (0, 0) the center of the circle

	if(length(st) > uRad)
	{
		vec3 rgb = texture( uImageUnit, vST).rgb;
		gl_FragColor = vec4( rgb, 1. );
	}
	else
	{
		// Magnifying
		float r = length(st);
		float r_dot = r / uMag;
		st = normalize(st) * r_dot;

		// Whirling
		float theta = atan( st.t, st.s );
		float theta_dot = theta - uWhirl * r;

		// Restoring (s,t)
		st = r_dot * vec2( cos( theta_dot ), sin( theta_dot ) );	// now in the range -1. to +1.
		st += vec2( uSc, uTc );

		// Mosaic'ing
		// Which block of pixels will this pixel be in?
		float s = st.s;
		float t = st.t;
		int numins = int( s / uMosaic );		// same as with the ellipses except use uMosaic instead of uAd and uBd
		int numint = int( t / uMosaic );
		float sc = (numins + 0.5) * uMosaic;			// center of the block
		float tc = (numint + 0.5) * uMosaic;

		// For this entire block of pixels, we are only going to sample the texture at its center (sc, tc):
		st.s = sc;
		st.t = tc;

		// Use st to lookup a color in the image texture. Assign it to gl_FragColor
		vec3 rgb = texture( uImageUnit, st ).rgb;
		gl_FragColor = vec4( rgb, 1. );
	}
}