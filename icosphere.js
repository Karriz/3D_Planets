function IcoSphere() {
    /*
    Based on:
    http://blog.andreaskahler.com/2009/06/creating-icosphere-mesh-in-code.html
    */


    this.geometry = new THREE.Geometry();
    
    this.middlePointIndexCache = [];
    
    this.getMiddle = function(a,b){
        var firstIsSmaller = a<b;
        var key1;
        var key2;
        
        if (firstIsSmaller) {
            key1=a;
            key2=b;
        }
        else {
            key1=b;
            key2=a;
        }
        if (typeof this.middlePointIndexCache[key1] !== 'undefined') {
            if (typeof this.middlePointIndexCache[key1][key2] !== 'undefined') {
                return this.middlePointIndexCache[key1][key2];
            }
        }

        var middle = new THREE.Vector3(0,0,0);
        middle.add(this.geometry.vertices[a]);
        middle.add(this.geometry.vertices[b]);
        
        middle.divideScalar(2);
        
        middle.normalize();
        this.geometry.vertices.push(middle);
        var last = this.geometry.vertices.length-1;
        
        if (typeof this.middlePointIndexCache[key1] === 'undefined') {
            this.middlePointIndexCache[key1] = [];
        }
        
        this.middlePointIndexCache[key1][key2] = (last);
        
        return (last);

    }
    
    this.build = function () {
        var t = (1.0+Math.sqrt(5.0)) / 2.0;
        
        this.geometry.vertices = [];
        
        for (var y = t; y >= -t; y-=2*t) {
            for (var x = -1; x <=1; x+=2) {
                var vertice = new THREE.Vector3(x,y,0);
                vertice.normalize();
                this.geometry.vertices.push(vertice);
            }
        }
        
        for (var z = t; z >= -t; z-=2*t) {
            for (var y = -1; y <=1; y+=2) {
                var vertice = new THREE.Vector3(0,y,z);
                vertice.normalize();
                this.geometry.vertices.push(vertice);
            }
        }
        
        for (var x = t; x >= -t; x-=2*t) {
            for (var z = -1; z <=1; z+=2) {
                var vertice = new THREE.Vector3(x,0,z);
                vertice.normalize();
                this.geometry.vertices.push(vertice);
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
        
        this.geometry.verticesNeedUpdate = true;
        this.geometry.computeFaceNormals();
        this.geometry.computeVertexNormals();
    }
    
    this.subDivide = function (recursionLevel) {
        for (var i=0; i<recursionLevel; i++) {
            var faces2 = [];
            for(var j=0; j<this.geometry.faces.length; j++) {
                var face = this.geometry.faces[j];
                
                var middle1 = this.getMiddle(face.a,face.b);
                var middle2 = this.getMiddle(face.b,face.c);
                var middle3 = this.getMiddle(face.c,face.a);
                
                faces2.push( new THREE.Face3( face.a, middle1, middle3 ) );
                faces2.push( new THREE.Face3( face.b, middle2, middle1 ) );
                faces2.push( new THREE.Face3( face.c, middle3, middle2 ) );
                faces2.push( new THREE.Face3( middle1, middle2, middle3 ) );
            }
            
            this.geometry.faces = faces2;
        }
        this.geometry.verticesNeedUpdate = true;
        this.geometry.computeFaceNormals();
        this.geometry.computeVertexNormals();
    }
        
    this.build();
    this.subDivide(2);
    
    this.material = new THREE.MeshPhongMaterial( { 
    wireframe: true
    } );
    
    this.mesh = new THREE.Mesh(this.geometry,this.material);
}