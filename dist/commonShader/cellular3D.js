export default "#define GLSLIFY 1\n//#version 120\n\n// Cellular noise (\"Worley noise\") in 3D in GLSL.\n// Copyright (c) Stefan Gustavson 2011-04-19. All rights reserved.\n// This code is released under the conditions of the MIT license.\n// See LICENSE file for details.\n// https://github.com/stegu/webgl-noise\n\n// Modulo 289 without a division (only multiplications)\nvec3 mod289(vec3 x){\n    return x-floor(x*(1./289.))*289.;\n}\n\n// Modulo 7 without a division\nvec3 mod7(vec3 x){\n    return x-floor(x*(1./7.))*7.;\n}\n\n// Permutation polynomial: (34x^2 + 6x) mod 289\nvec3 permute(vec3 x){\n    return mod289((34.*x+10.)*x);\n}\n\n// Cellular noise, returning F1 and F2 in a vec2.\n// 3x3x3 search region for good F2 everywhere, but a lot\n// slower than the 2x2x2 version.\n// The code below is a bit scary even to its author,\n// but it has at least half decent performance on a\n// modern GPU. In any case, it beats any software\n// implementation of Worley noise hands down.\n\nvec2 cellular(vec3 P){\n    #define K .142857142857// 1/7\n    #define Ko .428571428571// 1/2-K/2\n    #define K2 .020408163265306// 1/(7*7)\n    #define Kz .166666666667// 1/6\n    #define Kzo .416666666667// 1/2-1/6*2\n    #define jitter 1.0// smaller jitter gives more regular pattern\n    \n    vec3 Pi=mod289(floor(P));\n    vec3 Pf=fract(P)-.5;\n    \n    vec3 Pfx=Pf.x+vec3(1.,0.,-1.);\n    vec3 Pfy=Pf.y+vec3(1.,0.,-1.);\n    vec3 Pfz=Pf.z+vec3(1.,0.,-1.);\n    \n    vec3 p=permute(Pi.x+vec3(-1.,0.,1.));\n    vec3 p1=permute(p+Pi.y-1.);\n    vec3 p2=permute(p+Pi.y);\n    vec3 p3=permute(p+Pi.y+1.);\n    \n    vec3 p11=permute(p1+Pi.z-1.);\n    vec3 p12=permute(p1+Pi.z);\n    vec3 p13=permute(p1+Pi.z+1.);\n    \n    vec3 p21=permute(p2+Pi.z-1.);\n    vec3 p22=permute(p2+Pi.z);\n    vec3 p23=permute(p2+Pi.z+1.);\n    \n    vec3 p31=permute(p3+Pi.z-1.);\n    vec3 p32=permute(p3+Pi.z);\n    vec3 p33=permute(p3+Pi.z+1.);\n    \n    vec3 ox11=fract(p11*K)-Ko;\n    vec3 oy11=mod7(floor(p11*K))*K-Ko;\n    vec3 oz11=floor(p11*K2)*Kz-Kzo;// p11 < 289 guaranteed\n    \n    vec3 ox12=fract(p12*K)-Ko;\n    vec3 oy12=mod7(floor(p12*K))*K-Ko;\n    vec3 oz12=floor(p12*K2)*Kz-Kzo;\n    \n    vec3 ox13=fract(p13*K)-Ko;\n    vec3 oy13=mod7(floor(p13*K))*K-Ko;\n    vec3 oz13=floor(p13*K2)*Kz-Kzo;\n    \n    vec3 ox21=fract(p21*K)-Ko;\n    vec3 oy21=mod7(floor(p21*K))*K-Ko;\n    vec3 oz21=floor(p21*K2)*Kz-Kzo;\n    \n    vec3 ox22=fract(p22*K)-Ko;\n    vec3 oy22=mod7(floor(p22*K))*K-Ko;\n    vec3 oz22=floor(p22*K2)*Kz-Kzo;\n    \n    vec3 ox23=fract(p23*K)-Ko;\n    vec3 oy23=mod7(floor(p23*K))*K-Ko;\n    vec3 oz23=floor(p23*K2)*Kz-Kzo;\n    \n    vec3 ox31=fract(p31*K)-Ko;\n    vec3 oy31=mod7(floor(p31*K))*K-Ko;\n    vec3 oz31=floor(p31*K2)*Kz-Kzo;\n    \n    vec3 ox32=fract(p32*K)-Ko;\n    vec3 oy32=mod7(floor(p32*K))*K-Ko;\n    vec3 oz32=floor(p32*K2)*Kz-Kzo;\n    \n    vec3 ox33=fract(p33*K)-Ko;\n    vec3 oy33=mod7(floor(p33*K))*K-Ko;\n    vec3 oz33=floor(p33*K2)*Kz-Kzo;\n    \n    vec3 dx11=Pfx+jitter*ox11;\n    vec3 dy11=Pfy.x+jitter*oy11;\n    vec3 dz11=Pfz.x+jitter*oz11;\n    \n    vec3 dx12=Pfx+jitter*ox12;\n    vec3 dy12=Pfy.x+jitter*oy12;\n    vec3 dz12=Pfz.y+jitter*oz12;\n    \n    vec3 dx13=Pfx+jitter*ox13;\n    vec3 dy13=Pfy.x+jitter*oy13;\n    vec3 dz13=Pfz.z+jitter*oz13;\n    \n    vec3 dx21=Pfx+jitter*ox21;\n    vec3 dy21=Pfy.y+jitter*oy21;\n    vec3 dz21=Pfz.x+jitter*oz21;\n    \n    vec3 dx22=Pfx+jitter*ox22;\n    vec3 dy22=Pfy.y+jitter*oy22;\n    vec3 dz22=Pfz.y+jitter*oz22;\n    \n    vec3 dx23=Pfx+jitter*ox23;\n    vec3 dy23=Pfy.y+jitter*oy23;\n    vec3 dz23=Pfz.z+jitter*oz23;\n    \n    vec3 dx31=Pfx+jitter*ox31;\n    vec3 dy31=Pfy.z+jitter*oy31;\n    vec3 dz31=Pfz.x+jitter*oz31;\n    \n    vec3 dx32=Pfx+jitter*ox32;\n    vec3 dy32=Pfy.z+jitter*oy32;\n    vec3 dz32=Pfz.y+jitter*oz32;\n    \n    vec3 dx33=Pfx+jitter*ox33;\n    vec3 dy33=Pfy.z+jitter*oy33;\n    vec3 dz33=Pfz.z+jitter*oz33;\n    \n    vec3 d11=dx11*dx11+dy11*dy11+dz11*dz11;\n    vec3 d12=dx12*dx12+dy12*dy12+dz12*dz12;\n    vec3 d13=dx13*dx13+dy13*dy13+dz13*dz13;\n    vec3 d21=dx21*dx21+dy21*dy21+dz21*dz21;\n    vec3 d22=dx22*dx22+dy22*dy22+dz22*dz22;\n    vec3 d23=dx23*dx23+dy23*dy23+dz23*dz23;\n    vec3 d31=dx31*dx31+dy31*dy31+dz31*dz31;\n    vec3 d32=dx32*dx32+dy32*dy32+dz32*dz32;\n    vec3 d33=dx33*dx33+dy33*dy33+dz33*dz33;\n    \n    // Sort out the two smallest distances (F1, F2)\n    #if 0\n    // Cheat and sort out only F1\n    vec3 d1=min(min(d11,d12),d13);\n    vec3 d2=min(min(d21,d22),d23);\n    vec3 d3=min(min(d31,d32),d33);\n    vec3 d=min(min(d1,d2),d3);\n    d.x=min(min(d.x,d.y),d.z);\n    return vec2(sqrt(d.x));// F1 duplicated, no F2 computed\n    #else\n    // Do it right and sort out both F1 and F2\n    vec3 d1a=min(d11,d12);\n    d12=max(d11,d12);\n    d11=min(d1a,d13);// Smallest now not in d12 or d13\n    d13=max(d1a,d13);\n    d12=min(d12,d13);// 2nd smallest now not in d13\n    vec3 d2a=min(d21,d22);\n    d22=max(d21,d22);\n    d21=min(d2a,d23);// Smallest now not in d22 or d23\n    d23=max(d2a,d23);\n    d22=min(d22,d23);// 2nd smallest now not in d23\n    vec3 d3a=min(d31,d32);\n    d32=max(d31,d32);\n    d31=min(d3a,d33);// Smallest now not in d32 or d33\n    d33=max(d3a,d33);\n    d32=min(d32,d33);// 2nd smallest now not in d33\n    vec3 da=min(d11,d21);\n    d21=max(d11,d21);\n    d11=min(da,d31);// Smallest now in d11\n    d31=max(da,d31);// 2nd smallest now not in d31\n    d11.xy=(d11.x<d11.y)?d11.xy:d11.yx;\n    d11.xz=(d11.x<d11.z)?d11.xz:d11.zx;// d11.x now smallest\n    d12=min(d12,d21);// 2nd smallest now not in d21\n    d12=min(d12,d22);// nor in d22\n    d12=min(d12,d31);// nor in d31\n    d12=min(d12,d32);// nor in d32\n    d11.yz=min(d11.yz,d12.xy);// nor in d12.yz\n    d11.y=min(d11.y,d12.z);// Only two more to go\n    d11.y=min(d11.y,d11.z);// Done! (Phew!)\n    return sqrt(d11.xy);// F1, F2\n    #endif\n}\n\n"