#version 330 compatibility

uniform vec4    uColor;


void
main( )
{      
    gl_FragColor = vec4( uColor.rgb, 1.);

}
