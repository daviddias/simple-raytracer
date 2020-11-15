var scene, textures_remaining,
__slice = [].slice;

var self = {};

function copy(obj) {
  if(Array.isArray(obj)) {
    return obj.slice();
  } else if (obj instanceof Object && !(obj instanceof Function)) {
    var new_obj = {};
    for(var key in obj) {
      var val = obj[key];
      new_obj[key] = copy(val);
    }
    return new_obj;
  } else {
    return obj;
  }
};

/* glMatrix */

var cos=Math.cos, sin=Math.sin;
vec3={
  create:function(a){var b=new Array(3);a?(b[0]=a[0],b[1]=a[1],b[2]=a[2]):b[0]=b[1]=b[2]=0;return b},
  set:function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];return b},
  add:function(a,b,c){if(!c||a===c)return a[0]+=b[0],a[1]+=b[1],a[2]+=b[2],a;c[0]=a[0]+b[0];c[1]=a[1]+b[1];c[2]=a[2]+b[2];return c},
  mul:function(a,b,c){if(!c||a===c)return a[0]*=b[0],a[1]*=b[1],a[2]*=b[2],a;c[0]=a[0]*b[0];c[1]=a[1]*b[1];c[2]=a[2]*b[2];return c},
  sub:function(a,b,c){if(!c||a===c)return a[0]-=b[0],a[1]-=b[1],a[2]-=b[2],a;c[0]=a[0]-b[0];c[1]=a[1]-b[1];c[2]=a[2]-b[2];return c},
  negate:function(a,b){b||(b=a);b[0]=-a[0];b[1]=-a[1];b[2]=-a[2];return b},
  scale:function(a,b,c){if(!c||a===c)return a[0]*=b,a[1]*=b,a[2]*=b,a;c[0]=a[0]*b;c[1]=a[1]*b;c[2]=a[2]*b;return c},
  plus:function(a,b,c){if(!c||a===c)return a[0]+=b,a[1]+=b,a[2]+=b,a;c[0]=a[0]+b;c[1]=a[1]+b;c[2]=a[2]+b;return c},
  normalize:function(a,b){b||(b=a);var c=a[0],e=a[1],f=a[2],d=Math.sqrt(c*c+e*e+f*f);if(d){if(1===d)return b[0]=c,b[1]=e,b[2]=f,b}else return b[0]=0,b[1]=0,b[2]=0,b;d=1/d;b[0]=c*d;b[1]=e*d;b[2]=f*d;return b},
  cross:function(a,b,c){c||(c=a);var e=a[0],f=a[1],a=a[2],d=b[0],g=b[1],b=b[2];c[0]=f*b-a*g;c[1]=a*d-e*b;c[2]=e*g-f*d;return c},
  dot:function(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]},
  str:function (a) {return '['+a[0]+', '+a[1]+', '+a[2]+']'},
  length:function (vec) { var x = vec[0], y = vec[1], z = vec[2]; return Math.sqrt(x * x + y * y + z * z);},
  reflect:function(i,n,r){return vec3.sub(i,vec3.scale(n,2*vec3.dot(n,i),r),r)},
  rotateXYZ:function(v,x,y,z){
    var m=mat4.create(mat4.identity());
    mat4.rotateX(m,x);
    mat4.rotateY(m,y);
    mat4.rotateZ(m,z);
    return mat4.multiplyVec3(m,v);
  },
  mix:function(x,y,a){
    return vec3.add(
      vec3.scale(x,1-a,vec3.create()),
      vec3.scale(y,a,vec3.create()),
      vec3.create());
  }
}
mat4={
  create:function(a){var b=new Array(16);a&&(b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3],b[4]=a[4],b[5]=a[5],b[6]=a[6],b[7]=a[7],b[8]=a[8],b[9]=a[9],b[10]=a[10],b[11]=a[11],b[12]=a[12],b[13]=a[13],b[14]=a[14],b[15]=a[15]);return b},
  identity:function(a){a||(a=mat4.create());a[0]=1;a[1]=0;a[2]=0;a[3]=0;a[4]=0;a[5]=1;a[6]=0;a[7]=0;a[8]=0;a[9]=0;a[10]=1;a[11]=0;a[12]=0;a[13]=0;a[14]=0;a[15]=1;return a},
  multiplyVec3:function(a,b,c){c||(c=b);var d=b[0],e=b[1],b=b[2];c[0]=a[0]*d+a[4]*e+a[8]*b+a[12];c[1]=a[1]*d+a[5]*e+a[9]*b+a[13];c[2]=a[2]*d+a[6]*e+a[10]*b+a[14];return c},
  multiplyDelta3: function(mat, vec) {
    var a_ = mat4.multiplyVec3(mat, [0, 0, 0]);
    var b_ = mat4.multiplyVec3(mat, vec3.create(vec));
    return vec3.sub(b_, a_);
  },
  rotateX:function(b,c,a){var d=Math.sin(c),c=Math.cos(c),e=b[4],f=b[5],g=b[6],h=b[7],i=b[8],j=b[9],k=b[10],l=b[11];a?b!==a&&(a[0]=b[0],a[1]=b[1],a[2]=b[2],a[3]=b[3],a[12]=b[12],a[13]=b[13],a[14]=b[14],a[15]=b[15]):a=b;a[4]=e*c+i*d;a[5]=f*c+j*d;a[6]=g*c+k*d;a[7]=h*c+l*d;a[8]=e*-d+i*c;a[9]=f*-d+j*c;a[10]=g*-d+k*c;a[11]=h*-d+l*c;return a},
  rotateY:function(b,c,a){var d=Math.sin(c),c=Math.cos(c),e=b[0],f=b[1],g=b[2],h=b[3],i=b[8],j=b[9],k=b[10],l=b[11];a?b!==a&&(a[4]=b[4],a[5]=b[5],a[6]=b[6],a[7]=b[7],a[12]=b[12],a[13]=b[13],a[14]=b[14],a[15]=b[15]):a=b;a[0]=e*c+i*-d;a[1]=f*c+j*-d;a[2]=g*c+k*-d;a[3]=h*c+l*-d;a[8]=e*d+i*c;a[9]=f*d+j*c;a[10]=g*d+k*c;a[11]=h*d+l*c;return a},
  rotateZ:function(b,c,a){var d=Math.sin(c),c=Math.cos(c),e=b[0],f=b[1],g=b[2],h=b[3],i=b[4],j=b[5],k=b[6],l=b[7];a?b!==a&&(a[8]=b[8],a[9]=b[9],a[10]=b[10],a[11]=b[11],a[12]=b[12],a[13]=b[13],a[14]=b[14],a[15]=b[15]):a=b;a[0]=e*c+i*d;a[1]=f*c+j*d;a[2]=g*c+k*d;a[3]=h*c+l*d;a[4]=e*-d+i*c;a[5]=f*-d+j*c;a[6]=g*-d+k*c;a[7]=h*-d+l*c;return a},
  translate:function(a,c,b){var d=c[0],e=c[1],c=c[2],f,g,h,i,j,k,l,m,n,o,p,q;if(!b||a===b)return a[12]=a[0]*d+a[4]*e+a[8]*c+a[12],a[13]=a[1]*d+a[5]*e+a[9]*c+a[13],a[14]=a[2]*d+a[6]*e+a[10]*c+a[14],a[15]=a[3]*d+a[7]*e+a[11]*c+a[15],a;f=a[0];g=a[1];h=a[2];i=a[3];j=a[4];k=a[5];l=a[6];m=a[7];n=a[8];o=a[9];p=a[10];q=a[11];b[0]=f;b[1]=g;b[2]=h;b[3]=i;b[4]=j;b[5]=k;b[6]=l;b[7]=m;b[8]=n;b[9]=o;b[10]=p;b[11]=q;b[12]=f*d+j*e+n*c+a[12];b[13]=g*d+k*e+o*c+a[13];b[14]=h*d+l*e+p*c+a[14];b[15]=i*d+m*e+q*c+a[15];return b},
  scale:function(a,c,b){var d=c[0],e=c[1],c=c[2];if(!b||a===b)return a[0]*=d,a[1]*=d,a[2]*=d,a[3]*=d,a[4]*=e,a[5]*=e,a[6]*=e,a[7]*=e,a[8]*=c,a[9]*=c,a[10]*=c,a[11]*=c,a;b[0]=a[0]*d;b[1]=a[1]*d;b[2]=a[2]*d;b[3]=a[3]*d;b[4]=a[4]*e;b[5]=a[5]*e;b[6]=a[6]*e;b[7]=a[7]*e;b[8]=a[8]*c;b[9]=a[9]*c;b[10]=a[10]*c;b[11]=a[11]*c;b[12]=a[12];b[13]=a[13];b[14]=a[14];b[15]=a[15];return b},
  inverse:function(c,a){a||(a=c);var d=c[0],e=c[1],f=c[2],g=c[3],h=c[4],i=c[5],j=c[6],k=c[7],l=c[8],m=c[9],n=c[10],o=c[11],p=c[12],q=c[13],r=c[14],s=c[15],t=d*i-e*h,u=d*j-f*h,v=d*k-g*h,w=e*j-f*i,x=e*k-g*i,y=f*k-g*j,z=l*q-m*p,A=l*r-n*p,B=l*s-o*p,C=m*r-n*q,D=m*s-o*q,E=n*s-o*r,b=t*E-u*D+v*C+w*B-x*A+y*z;if(!b)return null;b=1/b;a[0]=(i*E-j*D+k*C)*b;a[1]=(-e*E+f*D-g*C)*b;a[2]=(q*y-r*x+s*w)*b;a[3]=(-m*y+n*x-o*w)*b;a[4]=(-h*E+j*B-k*A)*b;a[5]=(d*E-f*B+g*A)*b;a[6]=(-p*y+r*v-s*u)*b;a[7]=(l*y-n*v+o*u)*b;a[8]=(h*D-i*B+k*z)*b;a[9]=(-d*D+e*B-g*z)*b;a[10]=(p*x-q*v+s*t)*b;a[11]=(-l*x+m*v-o*t)*b;a[12]=(-h*C+i*A-j*z)*b;a[13]=(d*C-e*A+f*z)*b;a[14]=(-p*w+q*u-r*t)*b;a[15]=(l*w-m*u+n*t)*b;return a},
  multiply:function(a,b,c){c||(c=a);var d=a[0],e=a[1],f=a[2],g=a[3],h=a[4],i=a[5],j=a[6],k=a[7],l=a[8],m=a[9],n=a[10],o=a[11],p=a[12],q=a[13],r=a[14],a=a[15],s=b[0],t=b[1],u=b[2],v=b[3],w=b[4],x=b[5],y=b[6],z=b[7],A=b[8],B=b[9],C=b[10],D=b[11],E=b[12],F=b[13],G=b[14],b=b[15];c[0]=s*d+t*h+u*l+v*p;c[1]=s*e+t*i+u*m+v*q;c[2]=s*f+t*j+u*n+v*r;c[3]=s*g+t*k+u*o+v*a;c[4]=w*d+x*h+y*l+z*p;c[5]=w*e+x*i+y*m+z*q;c[6]=w*f+x*j+y*n+z*r;c[7]=w*g+x*k+y*o+z*a;c[8]=A*d+B*h+C*l+D*p;c[9]=A*e+B*i+C*m+D*q;c[10]=A*f+B*j+C*n+D*r;c[11]=A*g+B*k+C*o+D*a;c[12]=E*d+F*h+G*l+b*p;c[13]=E*e+F*i+G*m+b*q;c[14]=E*f+F*j+G*n+b*r;c[15]=E*g+F*k+G*o+b*a;return c}
}

/* ray.js */

var inLimits, intersect, intersectItem, isValid, launchRay, lightning, mod, objects, processPixel, sign, solve_eq2,
__slice = [].slice;

var epsilon = 0.0001;

function mod(x, n) {
  return ((x % n) + n) % n;
}

function sign(x) {
  if (x > 0) {
    return 1;
  } else if (x === 0) {
    return 0;
  } else {
    return -1;
  }
}

function solve_eq2(a, b, c) {
  var delta = b * b - 4 * a * c;
  if (delta < 0) {
    return [];
  }
  var sqDelta = Math.sqrt(delta);
  return [(-b - sqDelta) / (2 * a), (-b + sqDelta) / (2 * a)];
}

/*
 * Objects
 */

objects = {};

objects.plane = {
  solutions: function(item, ray_) {
    if (ray_.dir[2] !== 0) {
      return [-ray_.origin[2] / ray_.dir[2]];
    } else {
      return [];
    }
  },
  pos2d: function(item, pos_, width, height) {
    return [width / 2 - pos_[1], height / 2 - pos_[0]];
  },
  normal: function(item, ray_, pos_) {
    return [0, 0, -sign(ray_.dir[2])];
  }
};

objects.sphere = {
  solutions: function(item, ray_) {
    var a, b, c;
    a = vec3.dot(ray_.dir, ray_.dir);
    b = 2 * vec3.dot(ray_.origin, ray_.dir);
    c = (vec3.dot(ray_.origin, ray_.origin)) - item.radius2;
    return solve_eq2(a, b, c);
  },
  pos2d: function(item, pos_, width, height) {
    var phi, theta, x, y;
    pos_ = vec3.normalize(pos_, vec3.create());
    phi = Math.acos(pos_[2]);
    y = phi / Math.PI * height;
    theta = Math.acos(pos_[1] / Math.sin(phi)) / (2 * Math.PI);
    if (pos_[0] > 0) {
      theta = 1 - theta;
    }
    x = theta * width;
    return [x, y];
  },
  normal: function(item, ray_, pos_) {
    return pos_;
  }
};

objects.cone = {
  solutions: function(item, ray_) {
    var a, b, c;
    a = ray_.dir[0] * ray_.dir[0] + ray_.dir[1] * ray_.dir[1] - item.radius * ray_.dir[2] * ray_.dir[2];
    b = 2 * (ray_.origin[0] * ray_.dir[0] + ray_.origin[1] * ray_.dir[1] - item.radius * ray_.origin[2] * ray_.dir[2]);
    c = ray_.origin[0] * ray_.origin[0] + ray_.origin[1] * ray_.origin[1] - item.radius * ray_.origin[2] * ray_.origin[2];
    return solve_eq2(a, b, c);
  },
  pos2d: objects.sphere.pos2d,
  normal: function(item, ray_, pos_) {
    var normal;
    normal = vec3.create(pos_);
    normal[2] = -normal[2] * Math.tan(item.radius2);
    return normal;
  }
};

objects.cylinder = {
  solutions: function(item, ray_) {
    var a, b, c;
    a = ray_.dir[0] * ray_.dir[0] + ray_.dir[1] * ray_.dir[1];
    b = 2 * (ray_.origin[0] * ray_.dir[0] + ray_.origin[1] * ray_.dir[1]);
    c = ray_.origin[0] * ray_.origin[0] + ray_.origin[1] * ray_.origin[1] - item.radius2;
    return solve_eq2(a, b, c);
  },
  pos2d: objects.sphere.pos2d,
  normal: function(item, ray_, pos_) {
    var normal;
    normal = vec3.create(pos_);
    normal[2] = 0;
    return normal;
  }
};

objects.portal = copy(objects.plane);

objects.portal.normal = function(item, ray_, pos_) {
  return [0, 0, 1];
};

function inLimits(limits, pos_) {
  var _ref, _ref1, _ref2;
  return (limits[0] <= (_ref = pos_[0]) && _ref <= limits[1]) && (limits[2] <= (_ref1 = pos_[1]) && _ref1 <= limits[3]) && (limits[4] <= (_ref2 = pos_[2]) && _ref2 <= limits[5]);
};

function isValid(ray, distances, item, min_distance) {
  var distance, pos, pos_, _i, _len;
  for (_i = 0, _len = distances.length; _i < _len; _i++) {
    distance = distances[_i];
    if (!((0 < distance && distance < min_distance))) {
      continue;
    }
    pos = vec3.create();
    pos = vec3.add(ray.origin, vec3.scale(ray.dir, distance, pos), pos);
    pos_ = mat4.multiplyVec3(item.inverse, pos, vec3.create());
    if (inLimits(item.limits, pos_)) {
      return [pos, pos_, distance];
    }
  }
  return [null, null, null, null];
};

function intersectItem(item, ray, min_distance) {
  var ray_ = {
    dir: vec3.normalize(mat4.multiplyDelta3(item.inverse, ray.dir)),
    origin: mat4.multiplyVec3(item.inverse, ray.origin, [0, 0, 0])
  };
  var obj = objects[item.type];

  var _ref = isValid(ray, obj.solutions(item, ray_), item, min_distance);
  var pos = _ref[0];
  var pos_ = _ref[1];
  var distance = _ref[2];
  if(!pos) {
    return;
  }
  var color = item.color;
  var opacity = item.opacity;
  var reflect = item.reflect;
  var dir = ray.dir;
  if(item.tex != null) {
    var texture = textures[item.tex];
    var pos2d = obj.pos2d(item, pos_, texture.width, texture.height);
    var x = Math.floor(pos2d[0]);
    var y = Math.floor(pos2d[1]);
    if(item.tex_rep !== 0) {
      x = mod(x * item.tex_coef, texture.width);
      y = mod(y * item.tex_coef, texture.height);
    }
    var idx = (texture.width * y + x) * 4;
    opacity *= texture.data[idx + 3] / 255;
    color = [texture.data[idx] / 255, texture.data[idx + 1] / 255, texture.data[idx + 2] / 255];
  }
  if(item.checkerboard != null) {
    var pos2d = obj.pos2d(item, pos_, 500, 500);
    if((mod(pos2d[0] / item.checkerboard, 1) > 0.5) === (mod(pos2d[1] / item.checkerboard, 1) > 0.5)) {
      color = item.color2;
    }
  }
  if(item.pnoise > 0) {
    var alpha = perlin(pos_, item.pnoise, item.pnoise_pers, item.pnoise_octave, item.pnoise_freq);
    color = vec3.mix(color, item.color2, alpha);
  }
  if(item.type === 'portal') {
    var dist = item.radius2 - (pos_[0] * pos_[0] + 2 * pos_[1] * pos_[1]);
    if(dist < 0) {
      return;
    }
    opacity *= 1 - Math.exp(-dist / 2000);
    opacity = 1 - opacity;
    pos = mat4.multiplyVec3(item.other.transform, pos_, vec3.create());
    dir = vec3.normalize(mat4.multiplyDelta3(item.other.transform, vec3.create(ray_.dir)));
  }
  var normal = obj.normal(item, ray_, pos_);
  normal = vec3.normalize(mat4.multiplyDelta3(item.transform, vec3.create(normal)));
  if(opacity === 0) {
    return;
  }
  return {
    distance: distance,
    pos: pos,
    normal: normal,
    color: color,
    item: item,
    opacity: opacity,
    reflect: reflect,
    dir: dir
  };
};

function intersect(ray, min_distance) {
  if(min_distance == null) {
    min_distance = Infinity;
  }
  var min_isect = null;
  for(i = 0; i < self.scene.item.length; i++) {
    var item = self.scene.item[i];
    var isect = intersectItem(item, ray, min_distance);
    if(isect && (!min_isect || isect.distance < min_isect.distance)) {
      min_isect = isect;
      min_distance = isect.distance;
    }
  }
  return min_isect;
};

function lightning(isect) {
  var color;
  if(self.scene.light != null) {
    color = [0, 0, 0];
  } else {
    color = vec3.create(isect.color);
  }
  for(var i = 0; i < self.scene.light.length; i++) {
    var light = self.scene.light[i];
    var dir = vec3.sub(light.coords, isect.pos, vec3.create());
    var min_distance = vec3.length(dir);
    vec3.normalize(dir);
    var pos = vec3.create();
    pos = vec3.add(isect.pos, vec3.scale(dir, epsilon, pos), pos);
    var ray = {
      origin: vec3.create(pos),
      dir: vec3.create(dir)
    };
    if(!intersect(ray, min_distance)) {
      var shade = Math.abs(vec3.dot(isect.normal, ray.dir));
      var add_color = vec3.create(isect.color);
      add_color = vec3.plus(add_color, isect.item.brightness);
      add_color = vec3.mul(add_color, light.color);
      vec3.scale(add_color, shade);
      add_color = vec3.scale(add_color, isect.item.intensity);
      vec3.add(color, add_color);
    }
  }
  var ambiant = vec3.create(isect.color);
  vec3.mul(ambiant, self.scene.global.l_color);
  vec3.add(color, ambiant);
  return color;
};

function launchRay(ray, count) {
  var color = [0, 0, 0];
  var isect = intersect(ray);
  if(isect) {
    color = lightning(isect);
    if(count > 0 && isect.opacity < 1) {
      var ray2 = {
        origin: vec3.add(isect.pos, vec3.scale(isect.dir, epsilon, vec3.create()), vec3.create()),
        dir: vec3.normalize(vec3.create(isect.dir))
      };
      color = vec3.mix(color, launchRay(ray2, count - 1), 1 - isect.opacity);
    }
    if(count > 0 && isect.reflect > 0) {
      var ray2 = {
        origin: vec3.add(isect.pos, vec3.scale(isect.normal, epsilon, vec3.create()), vec3.create()),
        dir: vec3.normalize(vec3.reflect(ray.dir, vec3.normalize(isect.normal), vec3.create()))
      };
      color = vec3.mix(color, launchRay(ray2, count - 1), isect.reflect);
    }
  }
  return color;
};

function processPixel(x, y) {
  var ray = {
    origin: vec3.create(self.scene.eye.coords),
    dir: vec3.normalize([self.scene.global.distscreen, x, y])
  };
  ray.dir = vec3.normalize(vec3.rotateXYZ.apply(vec3, [ray.dir].concat(__slice.call(self.scene.eye.rot))));
  return launchRay(ray, self.scene.global.max_reflect);
};

function process(x, y, upscale, randomRays) {
  var color = [0, 0, 0];
  vec3.add(color, processPixel((self.scene.global.W / 2 - x) / upscale, (self.scene.global.H / 2 - y) / upscale));
  for(var i = 0; i < randomRays; i++) {
    vec3.add(color, processPixel((self.scene.global.W / 2 - x + Math.random() - 0.5) / upscale, (self.scene.global.H / 2 - y + Math.random() - 0.5) / upscale));
  }
  return vec3.scale(color, 1 / (1 + randomRays));
};

/* perlin.js */

var perlin;

// Generated by CoffeeScript 1.7.1
(function() {
  
  // http://asserttrue.blogspot.com/2011/12/perlin-noise-in-javascript_31.html
  // This is a port of Ken Perlin's Java code. The
  // original Java code is at http://cs.nyu.edu/%7Eperlin/noise/.
  // Note that in this version, a number from 0 to 1 is returned.
  PerlinNoise = new function() {

    this.noise = function noise(x, y, z) {

       var p = new Array(512)
       var permutation = [ 151,160,137,91,90,15,
       131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
       190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
       88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
       77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
       102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
       135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
       5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
       223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
       129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
       251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
       49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
       138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
       for (var i=0; i < 256 ; i++)
        p[256+i] = p[i] = permutation[i];

        var X = Math.floor(x) & 255,                  // FIND UNIT CUBE THAT
              Y = Math.floor(y) & 255,                  // CONTAINS POINT.
              Z = Math.floor(z) & 255;
          x -= Math.floor(x);                                // FIND RELATIVE X,Y,Z
          y -= Math.floor(y);                                // OF POINT IN CUBE.
          z -= Math.floor(z);
          var    u = fade(x),                                // COMPUTE FADE CURVES
                 v = fade(y),                                // FOR EACH OF X,Y,Z.
                 w = fade(z);
          var A = p[X  ]+Y, AA = p[A]+Z, AB = p[A+1]+Z,      // HASH COORDINATES OF
              B = p[X+1]+Y, BA = p[B]+Z, BB = p[B+1]+Z;      // THE 8 CUBE CORNERS,

          return scale(lerp(w, lerp(v, lerp(u, grad(p[AA  ], x  , y  , z   ),  // AND ADD
                                         grad(p[BA  ], x-1, y  , z   )), // BLENDED
                                 lerp(u, grad(p[AB  ], x  , y-1, z   ),  // RESULTS
                                         grad(p[BB  ], x-1, y-1, z   ))),// FROM  8
                         lerp(v, lerp(u, grad(p[AA+1], x  , y  , z-1 ),  // CORNERS
                                         grad(p[BA+1], x-1, y  , z-1 )), // OF CUBE
                                 lerp(u, grad(p[AB+1], x  , y-1, z-1 ),
                                         grad(p[BB+1], x-1, y-1, z-1 )))));
    }
    
    function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    function lerp( t, a, b) { return a + t * (b - a); }
    function grad(hash, x, y, z) {
      var h = hash & 15; /* CONVERT LO 4 BITS OF HASH CODE */
      var u = h<8 ? x : y, /* INTO 12 GRADIENT DIRECTIONS. */
      v = h<4 ? y : h==12||h==14 ? x : z;
      return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);
    }
    function scale(n) { return n; /*return (1 + n)/2;*/ }
  };
  
  var clamp = function clamp(x, min, max) {
    if (x < min) {
      return min;
    }
    if (x > max) {
      return max;
    }
    return x;
  };

  perlin = function perlin(pos, id, persistence, octaves, frequence) {
    var amplitude, frequency, i, noise, _i;
    pos = vec3.scale(pos, frequence, vec3.create());
    noise = 0;
    frequency = 1;
    amplitude = 1;
    for (i = _i = 0; 0 <= octaves ? _i < octaves : _i > octaves; i = 0 <= octaves ? ++_i : --_i) {
      noise += amplitude * PerlinNoise.noise(pos[0] * frequency, pos[1] * frequency, pos[2] * frequency);
      frequency *= 2;
      amplitude *= persistence;
    }
    if (id === 2) {
      noise *= 20;
      noise = noise - Math.floor(noise);
    }
    if (id === 3) {
      noise = Math.cos(noise);
    }
    return (clamp(noise, -1, 1) + 1) / 2;
  };

}).call(this);

/* worker.js */

scene = null;
self.textures = {};

function render(scene, animation) {
  self.scene = scene;

  if(scene.global.highdef == null) {
    scene.global.highdef = [];
  }
  if(scene.global.highdef[0] == null) {
    scene.global.highdef[0] = 1;
  }
  if(scene.global.highdef[1] == null) {
    scene.global.highdef[1] = 0;
  }

  scene.global.upscale = scene.global.highdef[0];
  scene.global.randomRays = scene.global.highdef[1];

  if(scene.global.distscreen == null) {
    scene.global.distscreen = 1000;
  }
  if(scene.global.max_reflect == null) {
    scene.global.max_reflect = 10;
  }
  if(scene.global.l_color == null) {
    scene.global.l_color = [0, 0, 0];
  }

  scene.global.l_intensity = (scene.global.l_intensity != null ? scene.global.l_intensity : 0) / 100;
  vec3.scale(scene.global.l_color, scene.global.l_intensity);

  if(animation) {
    var theta = (2 * Math.PI * animation.frame) / animation.frames;
    scene.eye.coords = [400 * Math.cos(-(Math.PI - theta)), 400 * Math.sin(-(Math.PI - theta)), 0];
    scene.eye.rot = [0, 0, theta];
  } else {
    scene.eye.rot = vec3.scale(scene.eye.rot != null ? scene.eye.rot : [0, 0, 0], Math.PI / 180);
  }

  scene.global.W = scene.global.width * scene.global.upscale;
  scene.global.H = scene.global.height * scene.global.upscale;
  
  var groups = {};
  var portals = {};

  if(scene.light == null) {
    scene.light = [];
  }
  for(var i = 0; i < scene.light.length; i++) {
    var light = scene.light[i];
    if(light.coords == null) {
      light.coords = [0, 0, 0];
    }
    if(light.color == null) {
      light.color = [1, 1, 1];
    }
  }
  /* Items */
  for(var i = 0; i < scene.item.length; i++) {
    var item = scene.item[i];

    if(item.color == null) {
      item.color = [1, 1, 1];
    }
    if(item.color2 == null) {
      item.color2 = item.color.map(function(x) {
        return 1 - x;
      });
    }
    if(item.coords == null) {
      item.coords = [0, 0, 0];
    }
    item.rot = vec3.scale(item.rot != null ? item.rot : [0, 0, 0], Math.PI / 180);
    item.brightness = (item.brightness != null ? item.brightness : 0) / 100;
    item.intensity = (item.intensity != null ? item.intensity : 100) / 100;
    item.reflect = (item.reflect != null ? item.reflect : 0) / 100;
    item.opacity = (item.opacity != null ? item.opacity : 100) / 100;
    if(item.radius == null) {
      item.radius = 2;
    }
    if(item.limits == null) {
      item.limits = [0, 0, 0, 0, 0, 0];
    }
    for(var j = 0; j < 3; j++) {
      if(item.limits[2 * j] >= item.limits[2 * j + 1]) {
        item.limits[2 * j] = -Infinity;
        item.limits[2 * j + 1] = Infinity;
      }
    }
    if(item.pnoise == null) {
      item.pnoise = 0;
    }
    if(item.pnoise_freq == null) {
      item.pnoise_freq = 1;
    }
    if(item.pnoise_pers == null) {
      item.pnoise_pers = 1;
    }
    if(item.pnoise_octave == null) {
      item.pnoise_octave = 1;
    }
    item.transform = mat4.identity();
    mat4.translate(item.transform, item.coords);
    mat4.rotateX(item.transform, item.rot[0]);
    mat4.rotateY(item.transform, item.rot[1]);
    mat4.rotateZ(item.transform, item.rot[2]);
    if(item.group_id) {
      if(groups[item.group_id] == null) {
        groups[item.group_id] = [];
      }
      groups[item.group_id].push(item);
    }
    if(item.portal_id != null) {
      if (!(item.portal_id in portals)) {
        portals[item.portal_id] = [];
      }
      portals[item.portal_id].push(item);
    }
  }
  /* Portals */
  for(var id in portals) {
    portals[id][0].other = portals[id][1];
    portals[id][1].other = portals[id][0];
  }
  /* Groups */
  if(scene.group == null) {
    scene.group = [];
  }
  for(var i = 0; i < scene.group.length; i++) {
    var group = scene.group[i];
    if(group.size_mul == null) {
      group.size_mul = 1;
    }
    group.rot = vec3.scale(group.rot != null ? group.rot : [0, 0, 0], Math.PI / 180);
    if(group.coords == null) {
      group.coords = [0, 0, 0];
    }
    group.transform = mat4.identity();
    mat4.scale(group.transform, [group.size_mul, group.size_mul, group.size_mul]);
    mat4.translate(group.transform, group.coords);
    mat4.rotateX(group.transform, group.rot[0]);
    mat4.rotateY(group.transform, group.rot[1]);
    mat4.rotateZ(group.transform, group.rot[2]);
    if (!(group.id in groups)) {
      continue;
    }
    for(var j = 0; j < groups[group.id].length; j++) {
      var item_raw = groups[group.id][j];
      var item = copy(item_raw);
      delete item.group_id;
      var t = mat4.create(group.transform);
      mat4.multiply(t, item.transform);
      item.transform = t;
      scene.item.push(item);
    }
  }
  scene.item = scene.item.filter(function(item) {
    return item.group_id == null;
  });

  /* Textures */
  for(var i = 0 ; i < scene.item.length; i++) {
    var item = scene.item[i];
    item.coords = mat4.multiplyVec3(item.transform, [0, 0, 0]);
    item.inverse = mat4.inverse(item.transform, mat4.create());
    item.radius2 = item.radius * item.radius;
    if(item.tex != null) {
      if(item.tex_rep == null) {
        item.tex_rep = 0;
      }
      if(item.tex_coef == null) {
        item.tex_coef = 1;
      }
    }
  }

  /* Render */
  var result = []; // ''; // []
  for(var y = scene.job.begin_y; y < scene.job.end_y; y++) {
    for(var x = scene.job.begin_x; x < scene.job.end_x; x++) {
      var color = process(y, x, scene.global.upscale, scene.global.randomRays);
      // result += encode(~~(color[0] * 255), ~~(color[1] * 255), ~~(color[2] * 255));
      result.push(~~(color[0] * 255));
      result.push(~~(color[1] * 255));
      result.push(~~(color[2] * 255));
    }
  }
  return result;
}

function encode(byte1, byte2, byte3) {
  var bytes = new Uint8Array([byte1, byte2, byte3]);
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var chunk = (bytes[0] << 16) | (bytes[1] << 8) | bytes[2]; 
  // Use bitmasks to extract 6-bit segments from the triplet
  var a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
  var b = (chunk & 258048) >> 12;   // 258048   = (2^6 - 1) << 12
  var c = (chunk & 4032) >> 6;      // 4032     = (2^6 - 1) << 6
  var d = chunk & 63;               // 63       = 2^6 - 1
  // Convert the raw binary segments to the appropriate ASCII encoding
  return encodings[a] + encodings[b] + encodings[c] + encodings[d];
}




module.exports = function run(_scene, d) {
  var scene = JSON.parse(JSON.stringify(_scene));
  scene.job = d;

  return {
    id: d.id,
    data: render(scene, d.animation)
  };    
}