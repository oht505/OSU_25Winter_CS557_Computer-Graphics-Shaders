#version 330 compatibility

uniform float uLightX, uLightY, uLightZ;
uniform float uA, uP;
uniform float uY0 = 1.;

// will be interpolated into the fragment shader:
out  vec2  vST;                 // texture coords
out  vec3  vN;                  // normal vector
out  vec3  vL;                  // vector from point to light
out  vec3  vE;                  // vector from point to eye
out  vec3  vMC;			// model coordinates

// for Mac users:
//	Leave out the #version line, or use 120
//	Change the "out" to "varying"

vec3 eyeLIGHTPOSITION = vec3( uLightX, uLightY, uLightZ ); 
const vec3 LIGHTPOSITION = vec3( 5., 5., 0. );

const float PI = 3.141592;

void
main( )
{
	float z = uA * ( uY0 - gl_Vertex.y ) * sin( 2. * PI * gl_Vertex.x / uP);
	vST = gl_MultiTexCoord0.st;
	vec4 vert = gl_Vertex;
	vert.z = z;
	vMC = vert.xyz;
	vec4 ECposition = gl_ModelViewMatrix * vert; // eye coordinate position

	float dzdx = uA * ( uY0 - gl_Vertex.y ) * ( 2. * PI / uP ) * cos( 2.*PI * gl_Vertex.x / uP );
	float dzdy = -uA * sin( 2. * PI * gl_Vertex.x / uP );

	vec3 Tx = vec3(1., 0., dzdx);
	vec3 Ty = vec3(0., 1., dzdy);
	vN = normalize( cross( Tx, Ty ) );

	vL = eyeLIGHTPOSITION - ECposition.xyz; // vector from the point to the light position
	vE = vec3( 0., 0., 0. ) - ECposition.xyz; // vector from the point to the eye position
	gl_Position = gl_ModelViewProjectionMatrix * vert;
}