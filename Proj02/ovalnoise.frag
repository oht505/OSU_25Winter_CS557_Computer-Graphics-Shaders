#version 330 compatibility

// you can set these 4 uniform variables dynamically or hardwire them:

uniform float	uKa, uKd, uKs;	// coefficients of each type of lighting
uniform float	uShininess;	// specular exponent

// in Project #2, these have to be set dynamically from glman sliders or keytime animations or by keyboard hits:
uniform float	uAd, uBd;
uniform float	uTol;
uniform sampler3D Noise3;
uniform float	uNoiseFreq, uNoiseAmp;

// interpolated from the vertex shader:
in  vec2  vST;                  // texture coords
in  vec3  vN;                   // normal vector
in  vec3  vL;                   // vector from point to light
in  vec3  vE;                   // vector from point to eye
in  vec3  vMC;			        // model coordinates
in  vec3  vMCposition;

// for Mac users:
//	Leave out the #version line, or use 120
//	Change the "in" to "varying"


const vec3 OBJECTCOLOR          = vec3( 0.95, 0.95, 0.95 );           // color to make the object
const vec3 ELLIPSECOLOR         = vec3( 1., 0.5, 0.4 );           // color to make the ellipse
const vec3 SPECULARCOLOR        = vec3( 1., 1., 1. );

void
main( )
{
        vec3 myColor = OBJECTCOLOR;
	    vec2 st = vST;

	    // blend OBJECTCOLOR and ELLIPSECOLOR by using the ellipse equation to decide how close
	    // 	this fragment is to the ellipse border:

        int numins = int( st.s / uAd );
	    int numint = int( st.t / uBd );

	    // << do the rest of the ellipse equation to compute d (=rst) >>

        float ra = uAd / 2.;
        float rb = uBd / 2.;
        float s_c = numins * uAd + ra;
        float t_c = numint * uBd + rb;
		float rst = pow((st.s - s_c) / ra, 2) + pow((st.t - t_c) / rb, 2);

	    // float t = smoothstep( 1.-uTol, 1.+uTol, rst );
        // myColor = mix( ELLIPSECOLOR, OBJECTCOLOR, t );

        // Project #2 part

        // vec4 nv = texture( Noise3, uNoiseFreq * vMC );
        vec4 nv = texture( Noise3, uNoiseFreq * vec3(vST, 0.) );
        float n = nv.r + nv.g + nv.b + nv.a;    // range is 1. -> 3.
        n = n-2.;                               // range is now -1. -> 1.
        n *= uNoiseAmp;

        float ds = st.s - s_c;
        float dt = st.t - t_c;
        float oldDist = sqrt( ds * ds + dt * dt );
        float newDist = oldDist + n;
        float scale = newDist / oldDist;

        ds *= scale;
        ds /= ra;
        dt *= scale;
        dt /= rb;

        float drst = ds*ds + dt*dt;
        float t = smoothstep( 1.-uTol, 1.+uTol, drst );
        vec3 color = mix( ELLIPSECOLOR, OBJECTCOLOR, t );


	    // now use myColor in the per-fragment lighting equations:

        vec3 Normal    = normalize(vN);
        vec3 Light     = normalize(vL);
        vec3 Eye       = normalize(vE);

        // vec3 ambient = uKa * myColor;
        vec3 ambient = uKa * color;

        float d = max( dot(Normal,Light), 0. );       // only do diffuse if the light can see the point
        // vec3 diffuse = uKd * d * myColor;
        vec3 diffuse = uKd * d * color;

		float s = 0.;
        if( d > 0. )              // only do specular if the light can see the point
        {
                vec3 ref = normalize(  reflect( -Light, Normal )  );
                float cosphi = dot( Eye, ref );
                if( cosphi > 0. )
                        s = pow( max( cosphi, 0. ), uShininess );
        }
        vec3 specular = uKs * s * SPECULARCOLOR.rgb;
        gl_FragColor = vec4( ambient + diffuse + specular,  1. );
}