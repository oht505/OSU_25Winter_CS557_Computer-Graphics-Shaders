#version 330 compatibility

uniform float	uKa, uKd, uKs;	// coefficients of each type of lighting
uniform float	uShininess;	// specular exponent
uniform float	uLightX, uLightY, uLightZ;
uniform vec4    uColor;

uniform float   uRedDepth, uBlueDepth;
uniform bool    uUseChromaDepth;

// interpolated from the vertex shader:
in  vec3  	vN;                   // normal vector
in  vec3    gN;
in  vec3    gL;
in  vec3    gE;
in  vec4    FragColor;

in float    gZ;

vec3
Rainbow( float t )
{
    t = clamp( t, 0., 1. );

    float r = 1.;
    float g = 0.0;
    float b = 1. - 6. * ( t - ( 5./6. ));

    if( t <= ( 5./6. ))
    {
        r = 6. * ( t - ( 4./6. ) );
        g = 0.;
        b = 1.;
    }

    if( t <= ( 4./6. ))
    {
        r = 0.;
        g = 1. - 6. * ( t - ( 3./6. ));
        b = 1.;
    }

    if( t <= ( 3./6. ))
    {
        r = 0.;
        g = 1.;
        b = 6. * ( t - ( 2./6. ));
    }

    if( t <= ( 2./6. ))
    {
        r = 1. - 6. * ( t - ( 1./6. ));
        g = 1.;
        b = 0.;
    }

    if ( t <= ( 1./6. ))
    {
        r = 1.;
        g = 6. * t;
    }

    return vec3( r, g, b);
}

void
main( )
{      
    vec3 myColor = uColor.rgb;
    vec3 mySpecularColor = vec3( 1.0, 1.0, 1.0 );

    if( uUseChromaDepth )
    {
        float t = (2./3.) * ( abs(gZ) - uRedDepth ) / ( uBlueDepth  - uRedDepth );
        t = clamp( t, 0., 2./3. );
        myColor = Rainbow( t );
    } 

    gl_FragColor = vec4( myColor, 1.0 );

}
