    
createVertexKey = function(vertex) {
    return vertex.x.toString()+","+vertex.y.toString()+","+vertex.z.toString();
}

function FaceData(face, context, parent) {

    this.v1 = createVertexKey(context.geometry.vertices[face.a]);
    this.v2 = createVertexKey(context.geometry.vertices[face.b]);
    this.v3 = createVertexKey(context.geometry.vertices[face.c]);
    
    this.parent = parent;

    if (parent != undefined) {
        //console.log(this);
        parent.children.push(this);
    }
    context.vertexCache[this.v1].faces.push(this);
    context.vertexCache[this.v2].faces.push(this);
    context.vertexCache[this.v3].faces.push(this);
    
    this.children = [];
}

function VertexData(index, vector) {
    //console.log(index);
    this.index = index;
    this.vector = vector;
    
    this.faces = [];
}

function IcoSphere(subDivision) {
    /*
    Based on:
    http://blog.andreaskahler.com/2009/06/creating-icosphere-mesh-in-code.html
    */


    this.geometry = new THREE.Geometry();
    
    this.vertexCache = {};
    this.faceContainer = [];
    
    this.getMiddle = function(a,b){
        //console.log(b);
        var key;
        
        var avert = this.geometry.vertices[a];
        var bvert = this.geometry.vertices[b]
        
        var middle = new THREE.Vector3(0,0,0);
        middle.add(avert);
        middle.add(bvert);
        
        middle.divideScalar(2);
        
        middle.normalize();
        
        key = createVertexKey(middle);
        
        if (typeof this.vertexCache[key] !== 'undefined') {
            return this.vertexCache[key];
        }

        this.geometry.vertices.push(middle);
        var last = this.geometry.vertices.length-1;
        
        this.vertexCache[key] = new VertexData(last, middle);
        
        return this.vertexCache[key];

    }
    
    this.build = function () {
        var t = (1.0+Math.sqrt(5.0)) / 2.0;
        
        this.geometry.vertices = [];
        
        for (var y = t; y >= -t; y-=2*t) {
            for (var x = -1; x <=1; x+=2) {
                var vertice = new THREE.Vector3(x,y,0);
                vertice.normalize();
                this.geometry.vertices.push(vertice);
                var key = createVertexKey(vertice);
                this.vertexCache[key] = new VertexData(this.geometry.vertices.length -1, vertice);
            }
        }
        
        for (var z = t; z >= -t; z-=2*t) {
            for (var y = -1; y <=1; y+=2) {
                var vertice = new THREE.Vector3(0,y,z);
                vertice.normalize();
                this.geometry.vertices.push(vertice);
                var key = createVertexKey(vertice);
                this.vertexCache[key] = new VertexData(this.geometry.vertices.length -1, vertice);
            }
        }
        
        for (var x = t; x >= -t; x-=2*t) {
            for (var z = -1; z <=1; z+=2) {
                var vertice = new THREE.Vector3(x,0,z);
                vertice.normalize();
                this.geometry.vertices.push(vertice);
                var key = createVertexKey(vertice);
                this.vertexCache[key] = new VertexData(this.geometry.vertices.length -1, vertice);
            }
        }
        
        this.geometry.faces.push( new THREE.Face3( 0, 11, 5 ) );
        this.geometry.faces.push( new THREE.Face3( 0, 5, 1 ) );
        this.geometry.faces.push( new THREE.Face3( 0, 1, 7 ) );
        this.geometry.faces.push( new THREE.Face3( 0, 7, 10 ) );
        this.geometry.faces.push( new THREE.Face3( 0, 10, 11 ) );

        this.geometry.faces.push( new THREE.Face3( 1, 5, 9 ) );
        this.geometry.faces.push( new THREE.Face3( 5, 11, 4 ) );
        this.geometry.faces.push( new THREE.Face3( 11, 10, 2 ) );
        this.geometry.faces.push( new THREE.Face3( 10, 7, 6 ) );
        this.geometry.faces.push( new THREE.Face3( 7, 1, 8 ) );
        
        this.geometry.faces.push( new THREE.Face3( 3, 9, 4 ) );
        this.geometry.faces.push( new THREE.Face3( 3, 4, 2 ) );
        this.geometry.faces.push( new THREE.Face3( 3, 2, 6 ) );
        this.geometry.faces.push( new THREE.Face3( 3, 6, 8 ) );
        this.geometry.faces.push( new THREE.Face3( 3, 8, 9 ) );
        
        this.geometry.faces.push( new THREE.Face3( 4, 9, 5 ) );
        this.geometry.faces.push( new THREE.Face3( 2, 4, 11 ) );
        this.geometry.faces.push( new THREE.Face3( 6, 2, 10 ) );
        this.geometry.faces.push( new THREE.Face3( 8, 6, 7 ) );
        this.geometry.faces.push( new THREE.Face3( 9, 8, 1 ) );
        
        
        this.faceContainer[0] = [];
        for (var i=0;i<this.geometry.faces.length;i++) {
            var facedata = new FaceData(this.geometry.faces[i],this);
            this.geometry.faces[i]["facedata"] = facedata;
            this.faceContainer[0].push(facedata);
        }
        
        this.geometry.verticesNeedUpdate = true;
        this.geometry.computeFaceNormals();
        this.geometry.computeVertexNormals();
    }
        
    this.subDivideFace = function(face, faces, level) {
        //console.log(face);
        var middle1 = this.getMiddle(face.a,face.b);
        var middle2 = this.getMiddle(face.b,face.c);
        var middle3 = this.getMiddle(face.c,face.a);
        
        //console.log(middle1);
        //console.log(middle2);
        //console.log(middle3);
        
        faces.push( new THREE.Face3( face.a, middle1.index, middle3.index ) );
        faces.push( new THREE.Face3( face.b, middle2.index, middle1.index ) );
        faces.push( new THREE.Face3( face.c, middle3.index, middle2.index ) );
        faces.push( new THREE.Face3( middle1.index, middle2.index, middle3.index ) );
        if (this.faceContainer[level] == undefined) {
            this.faceContainer[level] = [];
        }
        for (var i=faces.length-4; i< faces.length; i++) {
            //console.log(face["facedata"]);
            console.log(level);
            var facedata = new FaceData(faces[i],this,face["facedata"]);
            faces[i]["facedata"] = facedata;
            this.faceContainer[level].push(facedata);
        }
    }
    
    this.subDivideAll = function (recursionLevel) {
        for (var i=0; i<recursionLevel; i++) {
            var faces2 = [];
            for(var j=0; j<this.geometry.faces.length; j++) {
                var face = this.geometry.faces[j];
                
                this.subDivideFace(face, faces2, i+1);
            
            }
            
            this.geometry.faces = faces2;
        }
        this.geometry.verticesNeedUpdate = true;
        this.geometry.computeFaceNormals();
        this.geometry.computeVertexNormals();
    }
        
    this.build();
    this.subDivideAll(subDivision);
    console.log(this.faceContainer.length);
    console.log(this.faceContainer[1].length);
    console.log(this.faceContainer[1][5]);
    
    this.material = new THREE.MeshPhongMaterial( { 
    wireframe: true
    } );
    
    this.mesh = new THREE.Mesh(this.geometry,this.material);
}