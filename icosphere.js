    
createVertexKey = function(vertex) {
    return vertex.x.toString()+","+vertex.y.toString()+","+vertex.z.toString();
}

function FaceData(face, context, parent) {
    //console.log(face);
    //console.log(context.geometry.vertices);
    //console.log(context.geometry.vertices[face.b]);
    
    this.v1 = context.geometry.vertices[face.a].vertexData.key;
    this.v2 = context.geometry.vertices[face.b].vertexData.key;
    this.v3 = context.geometry.vertices[face.c].vertexData.key;
    
    var center = new THREE.Vector3(0,0,0);
    center.add(context.geometry.vertices[face.a]);
    center.add(context.geometry.vertices[face.b]);
    center.add(context.geometry.vertices[face.c]);
    
    center.divideScalar(3);
    center.normalize();
    
    this.key = createVertexKey(center);
    
    this.parent = parent;
    this.isActive = true;
    
    this.level = 0;
    
    if (parent != undefined) {
        //console.log(this);
        parent.children.push(this);
        this.level = parent.level + 1;
    }
    context.geometry.vertices[context.vertexCache[this.v1]].vertexData.faces.push(this);
    context.geometry.vertices[context.vertexCache[this.v2]].vertexData.faces.push(this);
    context.geometry.vertices[context.vertexCache[this.v3]].vertexData.faces.push(this);
    
    this.children = [];
}

function VertexData(vertex) {
    this.key = createVertexKey(vertex);
    this.faces = [];
}

function IcoSphere(subDivision) {
    /*
    Based on:
    http://blog.andreaskahler.com/2009/06/creating-icosphere-mesh-in-code.html
    */


    this.geometry = new THREE.Geometry();
    
    this.zero1 = new THREE.Vector3(0.001,0,0);
    this.zero2 = new THREE.Vector3(0,0.001,0);
    this.zero3 = new THREE.Vector3(0,0,0);
    
    this.geometry.vertices.push(this.zero1);
    this.geometry.vertices.push(this.zero2);
    this.geometry.vertices.push(this.zero3);
    
    this.zeroFace = new THREE.Face3(0,1,2);
    this.zeroFace["faceData"] = {isActive : false};
    
    this.vertexCache = {};
    this.faceCache = {};
    
    this.removedFaces = [];
    this.removedFacesCache = {};
    
    this.emptyVertexIndices = [];
    this.emptyFaceIndices = [];
    this.emptyRemovedFaceIndices = [];
    
    this.getMiddle = function(a,b){
        var key;
        
        var avert = this.geometry.vertices[a];
        var bvert = this.geometry.vertices[b]
        
        var middle = new THREE.Vector3(0,0,0);
        middle.add(avert);
        middle.add(bvert);
        
        middle.divideScalar(2);
        
        key = createVertexKey(middle);
        
        if (typeof this.vertexCache[key] !== 'undefined') {
            return this.vertexCache[key];
        }
        
        return this.createVertex(middle);

    }
    
    this.createVertex = function(vertex) {
        vertex.normalize();
        vertex["vertexData"] = new VertexData(vertex);
        
        var index = this.geometry.vertices.length;
        if (this.emptyVertexIndices.length > 0) {
            index = this.emptyVertexIndices.pop();
        }

        this.geometry.vertices[index] = vertex;
        var key = vertex.vertexData.key;
        
        this.vertexCache[key] = index;
        
        return this.vertexCache[key];
    }
    
    this.createFace = function(face, parent) {
        face["faceData"] = new FaceData(face, this, parent);
        
        if (typeof parent !== "undefined") {
            if (parent.children.length == 4) {
                var index = this.removedFaces.length;
                if (this.emptyRemovedFaceIndices.length > 0) {
                    index = emptyRemovedFaceIndices.pop();
                }
                this.removedFaces[index] = parent;
                //console.log(this.faceCache[parent.key]);
                this.geometry.faces[this.faceCache[parent.key]] = this.zeroFace;
                var emptyindex = this.faceCache[parent.key];
                this.emptyFaceIndices.push(emptyindex);
                delete this.faceCache[parent.key];
                this.removedFacesCache[parent.key] = index;
            }
        }

        var index = this.geometry.faces.length;
        if (this.emptyFaceIndices.length > 0) {
            //console.log(this.geometry.faces);
            index = this.emptyFaceIndices.pop();
            //console.log(index);
        }
        this.geometry.faces[index] = face;
        var key = face.faceData.key;
        
        this.faceCache[key] = index;
        //console.log(this.faceCache);
        return this.faceCache[key];
    
    }
    
    this.build = function () {
        var t = (1.0+Math.sqrt(5.0)) / 2.0;
        
        for (var y = t; y >= -t; y-=2*t) {
            for (var x = -1; x <=1; x+=2) {
                var vertex = new THREE.Vector3(x,y,0);
                this.createVertex(vertex);
            }
        }
        
        for (var z = t; z >= -t; z-=2*t) {
            for (var y = -1; y <=1; y+=2) {
                var vertex = new THREE.Vector3(0,y,z);
                this.createVertex(vertex);
            }
        }
        
        for (var x = t; x >= -t; x-=2*t) {
            for (var z = -1; z <=1; z+=2) {
                var vertex = new THREE.Vector3(x,0,z);
                this.createVertex(vertex);
            }
        }
        
        
        this.createFace( new THREE.Face3( 3, 14, 8 ) );
        this.createFace( new THREE.Face3( 3, 8, 4 ) );
        this.createFace( new THREE.Face3( 3, 4, 10 ) );
        this.createFace( new THREE.Face3( 3, 10, 13 ) );
        this.createFace( new THREE.Face3( 3, 13, 14 ) );

        this.createFace( new THREE.Face3( 4, 8, 12 ) );
        this.createFace( new THREE.Face3( 8, 14, 7 ) );
        this.createFace( new THREE.Face3( 14, 13, 5 ) );
        this.createFace( new THREE.Face3( 13, 10, 9 ) );
        this.createFace( new THREE.Face3( 10, 4, 11 ) );
        
        this.createFace( new THREE.Face3( 6, 12, 7 ) );
        this.createFace( new THREE.Face3( 6, 7, 5 ) );
        this.createFace( new THREE.Face3( 6, 5, 9 ) );
        this.createFace( new THREE.Face3( 6, 9, 11 ) );
        this.createFace( new THREE.Face3( 6, 11, 12 ) );
        
        this.createFace( new THREE.Face3( 7, 12, 8 ) );
        this.createFace( new THREE.Face3( 5, 7, 14 ) );
        this.createFace( new THREE.Face3( 9, 5, 13 ) );
        this.createFace( new THREE.Face3( 11, 9, 10 ) );
        this.createFace( new THREE.Face3( 12, 11, 4 ) );
        
        this.geometry.verticesNeedUpdate = true;
        this.geometry.computeFaceNormals();
        this.geometry.computeVertexNormals();
    }
        
    this.subDivideFace = function(face) {
        //console.log("subdividing face");
        var middle1 = this.getMiddle(face.a,face.b);
        var middle2 = this.getMiddle(face.b,face.c);
        var middle3 = this.getMiddle(face.c,face.a);
        
        this.createFace( new THREE.Face3( face.a, middle1, middle3 ), face.faceData );
        this.createFace( new THREE.Face3( face.b, middle2, middle1 ), face.faceData );
        this.createFace( new THREE.Face3( face.c, middle3, middle2 ), face.faceData );
        this.createFace( new THREE.Face3( middle1, middle2, middle3 ), face.faceData );
    }
    
    this.subDivideAll = function (recursionLevel) {
        //console.log("Starting subdivision");
        for (var i=0; i<recursionLevel; i++) {
            var end = this.geometry.faces.length;
            for(var j=0; j<end; j++) {
                //console.log(i);
                //console.log(j);
                var face = this.geometry.faces[j];
                if (face.faceData.isActive) {
                    this.subDivideFace(face);
                }
                else {
                    //console.log("Inactive");
                }
            
            }

        }
        this.geometry.verticesNeedUpdate = true;
        this.geometry.computeFaceNormals();
        this.geometry.computeVertexNormals();
    }
        
    this.build();
    this.subDivideAll(subDivision);
    console.log(this.geometry.faces.length);
    
    this.material = new THREE.MeshPhongMaterial( { 
    wireframe: true
    } );
    
    this.mesh = new THREE.Mesh(this.geometry,this.material);
}