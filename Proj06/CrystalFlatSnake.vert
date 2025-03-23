#version 330 compatibility

//uniform float uShineness;
uniform float Timer;

flat out 	vec2	vST;
flat out	vec3	vN; 
flat out	vec3	vL;
flat out	vec3	vE;
flat out vec3 vReflection;

const vec3	LIGHTPOSITION = vec3( 5., 5., 0.);
const float PI = 3.141592;

void
main()
{
	// Convex effect
	vec4 vert = gl_Vertex;
	float sphereRadius = 2.0;
	float elephantRegionX = 3.0;
	float elephantRegionZ = 3.0;
	float groundLevel = 1.3;
	float bulgeFactor = 1.2;
	float elephantY = sin(2.0 * PI * Timer) * 1.0;

	if( abs(vert.x) < elephantRegionX && abs(vert.z) < elephantRegionZ )
	{
		float sphereShape = sqrt(sphereRadius * sphereRadius - (vert.x * vert.x + vert.z * vert.z));

		float newY = groundLevel + sphereShape * bulgeFactor;

		vert.y = max(newY + elephantY, groundLevel);
	}

	vST = gl_MultiTexCoord0.st;
	vec4 ECposition = gl_ModelViewMatrix * vert;

	vN = normalize( gl_NormalMatrix * gl_Normal );
	vL = LIGHTPOSITION - ECposition.xyz;
	vE = vec3( 0., 0., 0.) - ECposition.xyz;

	vReflection = reflect(vE, vN);

	gl_Position = gl_ModelViewProjectionMatrix * vert;
}