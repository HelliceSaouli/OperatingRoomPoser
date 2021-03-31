// https://stackoverflow.com/questions/44391448/electron-require-is-not-defined
const fs = require('fs'); 

// global variables
let scene,renderer, camera, orbControls, skeletHelper;
 /* let sceneMedical, renderMedical, cameraMedical; these are for displaying medical images */

var applicationSettings = {Poses:'SimpleMeshRigged.fbx', Rotate:false,  Translate:false, DshowTransform:false, DPoseX:' ', DPoseZ:' ',DRotation:' '
                                    , cRotate:false,  cTranslate:false, cshowTransform:false, cPoseX:' ', cPoseZ:' ',cRotation:' '
                                    , tRotate:false,  tTranslate:false, tshowTransform:false, tPoseX:' ', tPoseZ:' ',tRotation:' '
                                    , cControlRotateX:0.0,cControlRotateZ:0.0
                                    , showBonesControles: false
                                    , RoomSizeX:' ',RoomSizeY:' ',RoomSizeZ:' '
                                    , WorldSizeX:' ',WorldSizeY:' ',WorldSizeZ:' '
                                    , Materials:'Air'
                                    , WorldMatrial:'Air'
                                    , RoomMatrial:'Air'};


var materialLib = { 
'Vacuum': 'Vacuum',
'Aluminium': 'Aluminium',
'Titanium':'Titanium',
'Nickel': 'Nickel',
'Copper':'Copper',
'Gold':'Gold', 
'Uranium':'Uranium', 
'Silicon':'Silicon', 
'Germanium':'Germanium', 
'Yttrium':'Yttrium', 
'Gadolinium':'Gadolinium', 
'Lutetium':'Lutetium', 
'Tungsten':'Tungsten',
'Lead':'Lead', 
'Bismuth':'Bismuth', 
'NaI':'NaI', 
'PWO':'PWO', 
'BGO':'BGO', 
'LSO':'LSO', 
'Plexiglass':'Plexiglass', 
'GSO':'GSO', 
'LuAP':'LuAP', 
'YAP':'YAP', 
'Water':'Water', 
'Quartz':'Quartz', 
'Breast':'Breast', 
'Air':'Air', 
'Glass':'Glass', 
'Scinti-C9H10':'Scinti-C9H10', 
'LuYAP-70':'LuYAP-70', 
'LuYAP-80':'LuYAP-80', 
'Plastic':'Plastic',  
'Biomimic':'Biomimic', 
'FITC':'FITC',
'RhB':'RhB',  
'CZT':'CZT', 
'Lung':'Lung',  
'Polyethylene':'Polyethylene',  
'PVC':'PVC', 
'SS304':'SS304', 
'PTFE':'PTFE',  
'LYSO':'LYSO', 
'Body':'Body',                                                                                                                                  
'Muscle':'Muscle',                                                                                                                                  
'LungMoby':'LungMoby',                                                                                                                           
'SpineBone':'SpineBone',                                                                                                                 
'RibBone':'RibBone', 
'Adipose':'Adipose', 
'Epidermis':'Epidermis', 
'Hypodermis':'Hypodermis', 
'Blood':'Blood',  
'Heart':'Heart',  
'Kidney':'Kidney', 
'Liver':'Liver',  
'Lymph':'Lymph',  
'Pancreas':'Pancreas', 
'Intestine':'Intestine', 
'Skull':'Skull', 
'Cartilage':'Cartilage', 
'Brain':'Brain', 
'Spleen':'Spleen', 
'Testis':'Testis', 
'PMMA':'PMMA',  
'Epoxy':'Epoxy', 
'Carbide':'Carbide'                    
};

var poseLib = { 'Default': 'models/Poses/SimpleMeshRigged.fbx',
                'Pose 1 ': 'models/Poses/Pose1.fbx',
                'Pose 2 ': 'models/Poses/Pose2.fbx',
                'Pose 3 ': 'models/Poses/Pose3.fbx',
                'Pose 4 ': 'models/Poses/Pose4.fbx',
                'Pose 5 ': 'models/Poses/Pose5.fbx',
                'Pose 6 ': 'models/Poses/Pose6.fbx',
                'Pose 7 ': 'models/Poses/Pose7.fbx',
                'Pose 8 ': 'models/Poses/Pose8.fbx',
                'Pose 9 ': 'models/Poses/Pose9.fbx',
                'Pose 10 ': 'models/Poses/Pose10.fbx'
};

// variables for posing the doctor mesh
var bones = [];
var carmbone;

//global Controls
var GlobalDoctorTraform;
var GlobalCarmTraform;
var GlobalTableTraform;

var panel;
var panel2 = "null";

var link = document.createElement( 'a' );
link.style.display = 'none';
document.body.appendChild( link );




/************************************************************ Main *******************************************************************/

start();
update();

/*************************************************************************************************************************************/
// functions

function mmTom(val)
{
  return val *  0.001;
}

function mTomm(val)
{
  return val * 1000.0;
}

function inRange(x, min, max) 
{
  return ((x-min)*(x-max) <= 0);
}

function panelForDoctorControl()
{
  panel = new dat.GUI( { width: 500} );

  // stackoverflow.com/questions/57328700/using-a-switch-statement-to-load-multiple-objects-in-three-js
  const folder1 = panel.addFolder( 'Medical Stuff Library Poses' );
  const folder5_1 = panel.addFolder( 'Room Setup' );
  const folder2 = panel.addFolder( 'Bone Controle' );
  const folder3 = panel.addFolder( 'Location Control' );
  const folder4 = panel.addFolder( 'Machine Location Control' );
  const folder4_1 = panel.addFolder( 'Table Location Control' );
  const folder5 = panel.addFolder( 'C-Controle' );
  const folder6 = panel.addFolder( 'Simulation' );

  folder1.add(applicationSettings, 'Poses', poseLib).onChange(function(){ loadDoctorPoses();
     if(panel2 != "null")
          {
            panel2.destroy();
            panel2 = "null";
          }
  } );

  applicationSettings.UploadPose = function()
  {
    const fileSelector = document.getElementById('file-selector').click();
  }

  folder1.add(applicationSettings,'UploadPose').name('Upload existing Pose');

  folder5_1.add(applicationSettings, 'Materials', materialLib).onChange(function(){} );


  folder5_1.add(applicationSettings, 'WorldSizeX').name('Wrold Dim X =').listen().onChange(function(value)
  {  
    applicationSettings.WorldSizeX = value;
  } );

  folder5_1.add(applicationSettings, 'WorldSizeY').name('Wrold Dim Y =').listen().onChange(function(value)
  {  
    applicationSettings.WorldSizeY = value;
  } );

  folder5_1.add(applicationSettings, 'WorldSizeZ').name('Wrold Dim Z =').listen().onChange(function(value)
  {  
    applicationSettings.WorldSizeZ = value;
  } );

  applicationSettings.CreateWorld = function()
  {

    var oldobject = scene.getObjectByName('world');

    if(oldobject)
    {
           scene.remove(oldobject);
    }

    var x = mmTom(parseFloat(applicationSettings.WorldSizeX));
    var y = mmTom(parseFloat(applicationSettings.WorldSizeY));
    var z = mmTom(parseFloat(applicationSettings.WorldSizeZ));

    const geometry = new THREE.BoxGeometry( x, y, z );
    const material = new THREE.MeshBasicMaterial( {color: 0xa0abaf} );
    material.transparent = true
    const world = new THREE.Mesh( geometry, material );
    world.name = "world";
    world.position.set(0.0,y / 2.0, 0.0);
    world.material.opacity = 0.5;
    world.material.side = THREE.DoubleSide;
    world.castShadow = false;
    scene.add( world );
    applicationSettings.WorldMatrial =  applicationSettings.Materials;
  }

  folder5_1.add(applicationSettings,'CreateWorld').name('Create World Volume');



  folder5_1.add(applicationSettings, 'RoomSizeX').name('Room Dim X =').listen().onChange(function(value)
  {  
    applicationSettings.RoomSizeX = value;
  } );

  folder5_1.add(applicationSettings, 'RoomSizeY').name('Room Dim Y =').listen().onChange(function(value)
  {  
    applicationSettings.RoomSizeY = value;
  } );

  folder5_1.add(applicationSettings, 'RoomSizeZ').name('Room Dim Z =').listen().onChange(function(value)
  {  
    applicationSettings.RoomSizeZ = value;
  } );

  applicationSettings.CreateRoom = function()
  {

    var oldobject = scene.getObjectByName('room');

    if(oldobject)
    {
           scene.remove(oldobject);
    }

    var x = mmTom(parseFloat(applicationSettings.RoomSizeX));
    var y = mmTom(parseFloat(applicationSettings.RoomSizeY));
    var z = mmTom(parseFloat(applicationSettings.RoomSizeZ));

    const geometry = new THREE.BoxGeometry( x,y,z );
    const material = new THREE.MeshBasicMaterial( {color: 0x01b0b0} );
    material.transparent = true
    const room = new THREE.Mesh( geometry, material );
    room.name = "room";
    room.position.set(0.0,y / 2.0, 0.0);
    room.material.opacity = 0.2;
    room.material.side = THREE.DoubleSide;
    room.castShadow = false;
    scene.add( room );
    applicationSettings.RoomMatrial =  applicationSettings.Materials;
  }

  folder5_1.add(applicationSettings,'CreateRoom').name('Create Room Volume');


  folder2.add(applicationSettings, 'showBonesControles').name('Show Bones').listen().onChange(function(value)
  { 
      skeletHelper.visible = value;
  } );


  applicationSettings.makePose = function()
  {
    if(panel2 == "null")
    {
      createRiggingGUIFolder();
    }
      
  }

  applicationSettings.QuitePoseMenue = function()
  {
    if(panel2 != "null")
    {
      panel2.destroy();
      panel2 = "null";
    } 
    
  }

  folder2.add(applicationSettings,'makePose').name('Make Pose');
  folder2.add(applicationSettings,'QuitePoseMenue').name('Quite Pose Menue');


  folder3.add(applicationSettings, 'DshowTransform').name('Show Transform').listen().onChange(function(value)
  {  
      if(value == true)
      {
        var obj = scene.getObjectByName('meshdoctor');
        GlobalDoctorTraform.attach( obj );	
      }
      else
      {
        var obj = scene.getObjectByName('meshdoctor');
        GlobalDoctorTraform.detach( obj );	
      }
  } );


  folder3.add(applicationSettings, 'Rotate').listen().onChange(function(value)
  {  
    
    GlobalDoctorTraform.setMode( "rotate" );
    GlobalDoctorTraform.showY = value;
    GlobalDoctorTraform.showX = false;
    GlobalDoctorTraform.showZ = false;
    applicationSettings.Translate= false;
  } );

  folder3.add(applicationSettings, 'Translate').listen().onChange(function(value)
  {  
    GlobalDoctorTraform.setMode( "translate" );
    GlobalDoctorTraform.showY = false;
    GlobalDoctorTraform.showX = value;
    GlobalDoctorTraform.showZ = value;
    applicationSettings.Rotate= false;

  } );

  folder3.add(applicationSettings, 'DPoseX').name('x =').listen().onChange(function(value)
  {  
    if(applicationSettings.Translate == true)
    {
      var obj = scene.getObjectByName('meshdoctor');
      obj.position.x = mmTom(parseFloat(value));
    }


  } );

  folder3.add(applicationSettings, 'DPoseZ').name('z =').listen().onChange(function(value)
  {  
    if(applicationSettings.Translate == true)
    {
      var obj = scene.getObjectByName('meshdoctor');
      obj.position.z = mmTom(parseFloat(value));
    }

  } );

  folder3.add(applicationSettings, 'DRotation').name('Rotation =').listen().onChange(function(value)
  {  
    if(applicationSettings.Rotate == true)
    {
      var obj = scene.getObjectByName('meshdoctor');
      obj.rotation.y = THREE.Math.degToRad(value);
    }

  } );



  folder4.add(applicationSettings, 'cshowTransform').listen().name('Show C-arm Transform').onChange(function(value)
  {  
      if(value == true)
      {
        var obj = scene.getObjectByName('carm');
        GlobalCarmTraform.attach( obj );	
      }
      else
      {
        var obj = scene.getObjectByName('carm');
        GlobalCarmTraform.detach( obj );	
      }
  } );


  folder4.add(applicationSettings, 'cRotate').name('Machine Rotate').listen().onChange(function(value)
  {  
    
    GlobalCarmTraform.setMode( "rotate" );
    GlobalCarmTraform.showY = value;
    GlobalCarmTraform.showX = false;
    GlobalCarmTraform.showZ = false;
    applicationSettings.cTranslate= false;
  } );

  folder4.add(applicationSettings, 'cTranslate').name('Machine Translate').listen().onChange(function(value)
  {  
    GlobalCarmTraform.setMode( "translate" );
    GlobalCarmTraform.showY = false;
    GlobalCarmTraform.showX = value;
    GlobalCarmTraform.showZ = value;
    applicationSettings.cRotate= false;

  } );

  folder4.add(applicationSettings, 'cPoseX').name('x =').listen().onChange(function(value)
  {  
    if(applicationSettings.cTranslate == true) 
    {
      var obj = scene.getObjectByName('carm');
      obj.position.x = mmTom(parseFloat(value));
    }
  } );

  folder4.add(applicationSettings, 'cPoseZ').name('z =').listen().onChange(function(value)
  {  
    if(applicationSettings.cTranslate == true)
    {
      var obj = scene.getObjectByName('carm');
      obj.position.z = mmTom(parseFloat(value));
    }
  } );

  folder4.add(applicationSettings, 'cRotation').name('Rotation =').listen().onChange(function(value)
  {  
    if(applicationSettings.cRotate == true)
    {
      var obj = scene.getObjectByName('carm');
      obj.rotation.y = THREE.Math.degToRad(value);
    }

  } );


  folder4_1.add(applicationSettings, 'tshowTransform').listen().name('Show Table Transform').onChange(function(value)
  {  
      if(value == true)
      {
        var obj = scene.getObjectByName('table');
        GlobalTableTraform.attach( obj );	
      }
      else
      {
        var obj = scene.getObjectByName('table');
        GlobalTableTraform.detach( obj );	
      }
  } );


  folder4_1.add(applicationSettings, 'tRotate').name('Table Rotate').listen().onChange(function(value)
  {  
    
    GlobalTableTraform.setMode( "rotate" );
    GlobalTableTraform.showY = value;
    GlobalTableTraform.showX = false;
    GlobalTableTraform.showZ = false;
    applicationSettings.cTranslate= false;
  } );

  folder4_1.add(applicationSettings, 'tTranslate').name('Table Translate').listen().onChange(function(value)
  {  
    GlobalTableTraform.setMode( "translate" );
    GlobalTableTraform.showY = false;
    GlobalTableTraform.showX = value;
    GlobalTableTraform.showZ = value;
    applicationSettings.tRotate= false;

  } );

  folder4_1.add(applicationSettings, 'tPoseX').name('x =').listen().onChange(function(value)
  {  
    if(applicationSettings.tTranslate == true) 
    {
      var obj = scene.getObjectByName('table');
      obj.position.x = mmTom(parseFloat(value));
    }
  } );

  folder4_1.add(applicationSettings, 'tPoseZ').name('z =').listen().onChange(function(value)
  {  
    if(applicationSettings.tTranslate == true)
    {
      var obj = scene.getObjectByName('table');
      obj.position.z = mmTom(parseFloat(value));
    }
  } );

  folder4_1.add(applicationSettings, 'tRotation').name('Rotation =').listen().onChange(function(value)
  {  
    if(applicationSettings.tRotate == true)
    {
      var obj = scene.getObjectByName('table');
      obj.rotation.y = THREE.Math.degToRad(value);
    }

  } );

  folder5.add(applicationSettings, 'cControlRotateX',0.0, 180.0,1.0).name('Elevation').listen().onChange(function(value)
  { 
    var obj = scene.getObjectByName('carm');
    obj.traverse( function ( object ) {

      if ( object.isMesh ) 
      {
        carmbone.rotation.x = THREE.Math.degToRad(value);
      }
  
      } );
   
  } );


  folder5.add(applicationSettings, 'cControlRotateZ',-90.0, 90.0,1.0).name('latitude').listen().onChange(function(value)
  { 
    carmbone.rotation.z = THREE.Math.degToRad(value);
  } );

  applicationSettings.RunSimulation = function()
  {
    const loader = new THREE.FileLoader();

    // check if there is a pose loaded
    var pose = scene.getObjectByName('meshdoctor');
    if(!pose)
      {
        alert("Setup the medical stuff pose before generating simulation macro");
        return;
      }

    //load a text file and output the result to the console
    loader.load(
      // resource URL
      'public/main.mac',
    
      // onLoad callback
      function ( data ) {
        // output the text to the console

        var subdata = data.split( '\n' );
        var newbuffer = '';
        for(var i = 0; i < subdata.length; i++)
        {
            var line = subdata[i];
            if(line.search("{orbital}") != -1 && line.toString().search("{angular}") != -1)
            {
               var changed = line.toString().replace("{orbital}",applicationSettings.cControlRotateX.toString());
               changed = changed.replace("{angular}",applicationSettings.cControlRotateZ.toString());
               newbuffer += changed + '\n';
               continue;
            } 
            
            if(line.toString().search("WorldSizeX" ) != -1)
            {
              var changed = line.toString().replace("WorldSizeX",applicationSettings.WorldSizeX.toString());
              newbuffer += changed + '\n';
              continue;
            }
            
            if(line.toString().search("WorldSizeY") != -1)
            {
              var changed = line.toString().replace("WorldSizeY",applicationSettings.WorldSizeY.toString());
              newbuffer += changed + '\n';
              continue;
            }
            
            if(line.toString().search("WorldSizeZ") != -1)
            {
              var changed = line.toString().replace("WorldSizeZ",applicationSettings.WorldSizeZ.toString());
              newbuffer += changed + '\n';
              continue;
            }



            if(line.toString().search("RoomSizeX" ) != -1)
            {
              var changed = line.toString().replace("RoomSizeX",applicationSettings.RoomSizeX.toString());
              newbuffer += changed + '\n';
              continue;
            }
            
            if(line.toString().search("RoomSizeY") != -1)
            {
              var changed = line.toString().replace("RoomSizeY",applicationSettings.RoomSizeY.toString());
              newbuffer += changed + '\n';
              continue;
            }
            
            if(line.toString().search("RoomSizeZ") != -1)
            {
              var changed = line.toString().replace("RoomSizeZ",applicationSettings.RoomSizeZ.toString());
              newbuffer += changed + '\n';
              continue;
            }

            if(line.toString().search("WorldMatrial") != -1)
            {
              var changed = line.toString().replace("WorldMatrial",applicationSettings.WorldMatrial.toString());
              newbuffer += changed + '\n';
              continue;
            }

            if(line.toString().search("RoomMatrial") != -1)
            {
              var changed = line.toString().replace("RoomMatrial",applicationSettings.RoomMatrial.toString());
              newbuffer += changed + '\n';
              continue;
            }
            
            newbuffer  += line.toString() + '\n'; 
        }

        if (!fs.existsSync('public/GATESCRIPT'))
        {
            fs.mkdir('public/GATESCRIPT',function(e){
              if(!e || (e && e.code === 'EEXIST')){

                  // Create  sub directory for script
                  fs.mkdir('public/GATESCRIPT/mac',function(e){
                    if(!e || (e && e.code === 'EEXIST')){
                      fs.writeFile('public/GATESCRIPT/mac/main.mac', newbuffer, (err) => {
                        //DO NOTHING
                    });  
                    } 
                });

                //create sub directory for data
                fs.mkdir('public/GATESCRIPT/data',function(e){
                  if(!e || (e && e.code === 'EEXIST')){
                      //TODO put exported models here

                      var outputPoseMesh = createPosedClone();
                      outputPoseMesh.updateMatrix();
                      var exporter = new THREE.STLExporter();
                      var result = exporter.parse( outputPoseMesh );
                     fs.writeFile('public/GATESCRIPT/data/pose.stl', result, (err) => {
                      //DO NOTHING
                      });
                  } 
              });

              //create sub directory for ouput
              fs.mkdir('public/GATESCRIPT/output',function(e){
                if(!e || (e && e.code === 'EEXIST')){
                    //for the scriptoutput it just sub directory i will do nothing here
                } 
            });

              } else {
                  //debug
                  console.log(e);
              }
          });
      }
      else
      {
        // the path does existe create the files and import meshes
        fs.writeFile('public/GATESCRIPT/mac/main.mac', newbuffer, (err) => {
          //DO NOTHING
          }); 

          var outputPoseMesh = createPosedClone();
          outputPoseMesh.updateMatrix();
          var exporter = new THREE.STLExporter();
          var result = exporter.parse( outputPoseMesh );
         fs.writeFile('public/GATESCRIPT/data/pose.stl', result, (err) => {
          //DO NOTHING
          });
      }

       // saveArrayBuffer(newbuffer,'main-1.mac')
        //console.log( data )
      },
    
      // onProgress callback
      function ( xhr ) {
        console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
      },
    
      // onError callback
      function ( err ) {
        console.error( 'An error happened' );
      }
    );

    alert("Script Generated");
  }

  /*
  applicationSettings.ShowMHD = function()
  {

  }
  */

  folder6.add(applicationSettings,'RunSimulation').name('Run Simulation');
  /* folder6.add(applicationSettings,'ShowMHD').name('Show Maps'); */

}



function createRiggingGUIFolder()
{
  var mesh = scene.getObjectByName('meshdoctor');
  var i = 0;
  mesh.traverse( function ( object ) {

    // this is hard coded and only work with maximo mesh to remove bones i don't wanna use in application
    if ( object.isBone )
    {
      if( !inRange(i,4,6) && !inRange(i, 15,18) && !inRange(i, 20,23) &&
          !inRange(i, 25,28) && !inRange(i, 30,33) && !inRange(i, 35,39) &&
          !inRange(i, 41,42) && !inRange(i, 48,51) && !inRange(i, 53,56) &&
          !inRange(i, 58,61) && !inRange(i, 63,66) && !inRange(i, 68,71) &&
          !inRange(i, 75,77))
       {
        bones.push(object); 
        //console.log(i);

      }
        i = i + 1;
        
    }

    

  } );
   
  panel2 = new dat.GUI( { width: 500} );

  for ( var i = 1; i < bones.length; i ++ ) {

    var bone = bones[ i ];

    var folder = panel2.addFolder( bone.name.substr(9) );

    folder.add( bone.position, 'x', -10 + bone.position.x, 10 + bone.position.x );
    folder.add( bone.position, 'y', -10 + bone.position.y, 10 + bone.position.y );
    folder.add( bone.position, 'z', -10 + bone.position.z, 10 + bone.position.z );

    folder.add( bone.rotation, 'x', -Math.PI * 0.5, Math.PI * 0.5 );
    folder.add( bone.rotation, 'y', -Math.PI * 0.5, Math.PI * 0.5 );
    folder.add( bone.rotation, 'z', -Math.PI * 0.5, Math.PI * 0.5 );

    folder.__controllers[ 0 ].name( "position.x" );
    folder.__controllers[ 1 ].name( "position.y" );
    folder.__controllers[ 2 ].name( "position.z" );

    folder.__controllers[ 3 ].name( "rotation.x" );
    folder.__controllers[ 4 ].name( "rotation.y" );
    folder.__controllers[ 5 ].name( "rotation.z" );

  }

}


/**************************************For saving *******************************************************/

    // utlity function 
function createPosedClone()
{
      var skinnedMesh = scene.getObjectByName('meshdoctor');
      //skinnedMesh.scale.set(0.001,0.001,0.001);
      return skinnedMesh;
}

/*
function save( blob, filename ) {

  link.href = URL.createObjectURL( blob );
  link.download = filename;
  link.click();

}

function saveArrayBuffer( buffer, filename ) 
{
  save( new Blob( [ buffer ], { type: 'application/octet-stream'} ), filename );
}
*/

/***********************************************************************************************/

function loadProtection(path,x,z,r) 
{
    const objLoader = new THREE.FBXLoader();
    // clear old object
    var oldobject = scene.getObjectByName('prtoection');
    
    if(oldobject)
         scene.remove(oldobject);
  
    objLoader.load(path, (root) => {
      root.name = 'prtoection';
      
      root.scale.set(0.01, 0.01 , 0.01);
   
      root.position.set( x, 0 , z );
      root.rotation.y = r;
  
      scene.add(root); 
    });
}

function loadDoctorPoses() 
{
  const objLoader = new THREE.FBXLoader();
  

  // clear old object
  var oldobject = scene.getObjectByName('meshdoctor');
  var oldSkhelper = scene.getObjectByName('skeletal');

  if(oldobject)
  {
         scene.remove(oldobject);
         scene.remove(oldSkhelper);
         bones = [];
  }

  objLoader.load(applicationSettings.Poses, (root) => {
    root.name = 'meshdoctor';
    root.scale.set(0.00001,0.00001,0.00001);  // the fbx loder scale up the value by 100 so if we have 2000mm it will be 2000 00 so 
                                              // i need to down scale by factor of 0.00001

    root.position.set(-1.0,-0.05,-1.0);
    root.rotation.set(0.0,90.0,0.0);
    scene.add(root);



    skeletHelper = new THREE.SkeletonHelper( root );
    skeletHelper.name = "skeletal";
    skeletHelper.visible = false;
    applicationSettings.showBonesControles = false;
    scene.add( skeletHelper );

    root.traverse( function ( object ) {

      if ( object.isMesh ) object.castShadow = true;

    } );

    // add controler transform
    GlobalDoctorTraform.addEventListener( 'dragging-changed', function ( event ) {
          
      orbControls.enabled = ! event.value;
      var obj  = scene.getObjectByName('meshdoctor');
      applicationSettings.DPoseX = mTomm(obj.getWorldPosition().x).toString();
      applicationSettings.DPoseZ = mTomm(obj.getWorldPosition().z).toString();

      applicationSettings.DRotation = THREE.Math.radToDeg(obj.rotation.y) % 360;

    } );
     var obj  = scene.getObjectByName('meshdoctor');
     loadProtection('./models/protection.fbx',obj.getWorldPosition().x,obj.getWorldPosition().z,obj.rotation.y);
    //GlobalDoctorTraform.attach( root );   // noot needed i attach the thing in the gui in show transform	  
    scene.add( GlobalDoctorTraform );

    var mixer = new THREE.AnimationMixer( root );

    var action = mixer.clipAction( root.animations[ 0 ] );
    action.play();
    // mixer.update( 1.0/30.0 ); this will give undesirable effect
    
   //for ( var i = 0; i < bonesNames.length; i ++ )
     //   {
       //     var b = root.getObjectByName( bonesNames[i] );
       //     bones.push(b);    
       // }
        
  });
}


function LoadTable(path) 
{
  const objLoader = new THREE.FBXLoader();
  // clear old object
  var oldobject = scene.getObjectByName('table');
  if(oldobject)
       scene.remove(oldobject);

  objLoader.load(path, (root) => {
    root.name = 'table';
    
    root.scale.set(0.01, 0.01 , 0.01);
 
   
    root.position.set( -2, 0 , 0 );
    root.rotation.y = THREE.Math.degToRad(90);

    scene.add(root);

    root.traverse( function ( object ) {

    if ( object.isMesh ) 
    {
        object.castShadow = true;
    }

    } );
  
    GlobalTableTraform.addEventListener( 'dragging-changed', function ( event ) {
      
        orbControls.enabled = ! event.value;
        var obj  = scene.getObjectByName('table');
        applicationSettings.tPoseX = mTomm(obj.getWorldPosition().x).toString();
        applicationSettings.tPoseZ = mTomm(obj.getWorldPosition().z).toString();
  
        applicationSettings.tRotation = THREE.Math.radToDeg(obj.rotation.y) % 360;

      } );
      
  //GlobalCarmTraform.attach( root );	  // noot needed i attach the thing in the gui in show transform
   scene.add( GlobalTableTraform );
  });
}


function loadCarm(path) 
{
  const objLoader = new THREE.FBXLoader();
  // clear old object
  var oldobject = scene.getObjectByName('carm');
  if(oldobject)
       scene.remove(oldobject);

  objLoader.load(path, (root) => {
    root.name = 'carm';
    root.scale.set( 0.01, 0.01 , 0.01 );
    root.position.set( 0, 0 , 0 );
    root.rotation.set( 0, -0 , 0 );
    scene.add(root);
 
    root.traverse( function ( object ) {

      if ( object.isMesh ) object.castShadow = true;

    } );
  
      GlobalCarmTraform.addEventListener( 'dragging-changed', function ( event ) {
      
        orbControls.enabled = ! event.value;
        var obj  = scene.getObjectByName('carm');
        applicationSettings.cPoseX = mTomm(obj.getWorldPosition().x).toString();
        applicationSettings.cPoseZ = mTomm(obj.getWorldPosition().z).toString();
  
        applicationSettings.cRotation = THREE.Math.radToDeg(obj.rotation.y) % 360;

      } );
  
          
  //GlobalCarmTraform.attach( root );	  // noot needed i attach the thing in the gui in show transform
   scene.add( GlobalCarmTraform );
   carmbone = root.getObjectByName( 'Bone' ); 
  });
}

function start()
{

  // get the container, the whole canvas
  const container = document.getElementById( 'container' );
  /* const containerImage = document.getElementById( 'viewer' ); */

  // setup camera
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000000);
  camera.position.set( 1, 2, - 3 );
  camera.lookAt( 0, 1, 0 );

/*
  cameraMedical = new THREE.PerspectiveCamera( 45, 1.0, 1, 1000 );
  cameraMedical.position.set( 1, 2, - 3 );
  cameraMedical.lookAt( 0, 1, 0 );
*/
  // intiate scene
  scene = new THREE.Scene();
   /* sceneMedical = new THREE.Scene(); */
  // create scene elements

  scene.background = new THREE.Color( 0xa0a0a0 );
  scene.fog = new THREE.Fog( 0xa0abaf, 20, 500 );

  const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x424242 );
  hemiLight.position.set( 0, 200, 0 );
  scene.add( hemiLight );

  const dirLight = new THREE.DirectionalLight( 0xffffff );
  dirLight.position.set( - 3, 10, - 10 );
  dirLight.castShadow = true;
  scene.add( dirLight );

  // ground

  const mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0x112133, depthWrite: true } ) );
  mesh.rotation.x = - Math.PI / 2;
  mesh.receiveShadow = true;
  mesh.position.set(0.0,-0.03,0.0);
  scene.add( mesh );

  // extras
      
  var size = 100;
  var divisions = 100;
  

  var gridHelper = new THREE.GridHelper( size, divisions);
  scene.add( gridHelper );

  var axesHelper = new THREE.AxesHelper( 100 );
  scene.add( axesHelper );

  // setup the renderer and attach it to canvas

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
 
/*
  renderMedical = new THREE.WebGLRenderer();
  renderMedical.setPixelRatio( window.devicePixelRatio );
  renderMedical.setSize( 400  , 400);
*/


  // set up orbit control
  orbControls = new THREE.OrbitControls( camera, renderer.domElement );
  orbControls.enablePan = true;
  orbControls.enableZoom = true;
  orbControls.target.set( 0, 1, 0 );
  orbControls.update();

  // some global controls set up 
  GlobalDoctorTraform = new THREE.TransformControls( camera, renderer.domElement );
  GlobalCarmTraform = new THREE.TransformControls( camera, renderer.domElement );
  GlobalTableTraform = new THREE.TransformControls( camera, renderer.domElement );

  GlobalDoctorTraform.setTranslationSnap(0.001);
  GlobalDoctorTraform.setRotationSnap( THREE.Math.degToRad( 1.0 ) );
  GlobalDoctorTraform.showY = false;
  GlobalDoctorTraform.showX = false;
  GlobalDoctorTraform.showZ = false;


  GlobalCarmTraform.setTranslationSnap(0.001);
  GlobalCarmTraform.setRotationSnap( THREE.Math.degToRad( 1.0 ) );
  GlobalCarmTraform.showY = false;
  GlobalCarmTraform.showX = false;
  GlobalCarmTraform.showZ = false;


  GlobalTableTraform.setTranslationSnap(0.001);
  GlobalTableTraform.setRotationSnap( THREE.Math.degToRad( 1.0 ) );
  GlobalTableTraform.showY = false;
  GlobalTableTraform.showX = false;
  GlobalTableTraform.showZ = false;


  // create panels
  loadCarm('./models/CARM/CIOCARM.fbx');
  LoadTable('./models/CARM/TableSurgery2.fbx');
  panelForDoctorControl();

  container.appendChild( renderer.domElement );
  /*containerImage.appendChild( renderMedical.domElement ); */
}



function update()
{
  requestAnimationFrame( update );
  renderer.render( scene, camera );
  /* renderMedical.render( sceneMedical, cameraMedical ); */
}