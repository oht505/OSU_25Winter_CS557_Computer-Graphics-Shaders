#version 330 compatibility

uniform float	 uKa, uKd, uKs;
uniform float	 uShineness;
uniform float	 uTp, uRefractionIndex;
uniform float	 uEta;
uniform float 		uMix;
uniform float 		uWhiteMix;
uniform samplerCube uReflectUnit;
uniform samplerCube uRefractUnit;

flat in vec2 	 vST;
flat in vec3	 vN;
flat in vec3	 vL;
flat in vec3	 vE;
flat in vec3 vReflection;

const vec3  WHITE = vec3( 1.,1.,1. );

void main( )
{
	vec3 Normal = normalize(vN);
	vec3 Light = normalize(vL);
	vec3 Eye = normalize(vE);

	vec3 reflectVector = reflect( Eye, Normal );
	vec3 reflectColor = texture( uReflectUnit, reflectVector ).rgb;

	vec3 refractVector = refract( Eye, Normal, uEta );
	vec3 refractColor;
	if( all( equal( refractVector, vec3(0.,0.,0.) ) ) )
	{
		refractColor = reflectColor;
	}
	else
	{
		refractColor = texture( uRefractUnit, refractVector ).rgb;
		refractColor = mix( refractColor, WHITE, uWhiteMix );
	}
	vec3 color = mix( refractColor, reflectColor, uMix );
	color = mix( color, WHITE, uWhiteMix );
	gl_FragColor = vec4( color, 1. );
}
