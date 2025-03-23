#version 330 compatibility

uniform float Timer;

out vec3 vN;
out vec3 vL;
out vec3 vE;

const vec3	LIGHTPOSITION = vec3( 5., 5., 0.);
const float PI = 3.141592;

void
main()
{
	vec4 vert = gl_Vertex;
	vec4 ECposition = gl_ModelViewMatrix * vert;

	float elephantY = sin(2.0 * PI * Timer) * 500.0;
	if( elephantY <= 0.)
	{
		elephantY = 0.;
	}

	vert.z += elephantY;

    vN = normalize( gl_NormalMatrix * gl_Normal );
	vL = LIGHTPOSITION - ECposition.xyz;
	vE =  vec3( 0., 0., 0.) - ECposition.xyz ;

    gl_Position = gl_ModelViewProjectionMatrix * vert;
}