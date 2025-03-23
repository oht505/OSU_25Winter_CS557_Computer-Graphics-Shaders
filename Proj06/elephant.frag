#version 330 compatibility

// uniform float   uTp;

in vec3 vN, vL, vE;

void
main()
{
    vec3 N = normalize(vN);
    vec3 L = normalize(vL);
    vec3 E = normalize(vE);

    float diff = max(dot(N, L), 0.3);
    float spec = pow(max(dot(reflect(-L, N), E), 0.0), 50.0);

    vec3 color = vec3(0.47, 0.47, 0.47);
    vec3 finalColor = color * diff + vec3(1.0, 1.0, 1.0) * spec;

    gl_FragColor = vec4(finalColor, 1.0);
}