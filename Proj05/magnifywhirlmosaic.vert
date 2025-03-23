#version 330 compatibility

// will be interpolated into the fragment shader:
out  vec2  vST;                 // texture coords

void
main( )
{
	vST = gl_MultiTexCoord0.st;
	
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}