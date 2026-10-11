/* Original faceted relief model, interpreted from the monument's silhouette.
   Three-dimensional vertices, depth-sorted faces and directional light are
   projected with Canvas 2D. No downloaded mesh, library, texture or telemetry. */
(()=>{
  'use strict';
  const canvas=document.querySelector('#motherland-model');
  const ctx=canvas?.getContext('2d');
  if(!ctx)return;
  const faces=[];
  const stone='#d9d0ae', pale='#e6ddc1', shade='#a9ae94', deep='#818e75';
  const point=([x,y,z=0])=>[(x-321)*1.16,400-y,z];
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const subtract=(a,b)=>a.map((v,i)=>v-b[i]);
  const normal=vertices=>{
    const n=cross(subtract(vertices[1],vertices[0]),subtract(vertices[2],vertices[0]));
    const length=Math.hypot(...n)||1;
    return n.map(v=>v/length);
  };
  function face(vertices,color=stone){
    const v=vertices.map(point);
    const n=normal(v);
    if(n[2]<0){v.reverse();n.forEach((_,i)=>n[i]*=-1);}
    faces.push({vertices:v,normal:n,color:color.match(/\w\w/g).map(v=>parseInt(v,16))});
  }
  // Ear clipping keeps the cape and garment's concave outlines intact.
  function triangulate(vertices){
    const indices=vertices.map((_,i)=>i), result=[];
    const area=vertices.reduce((sum,p,i)=>{const q=vertices[(i+1)%vertices.length];return sum+p[0]*q[1]-q[0]*p[1];},0);
    const sign=Math.sign(area)||1;
    const turn=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
    let guard=0;
    while(indices.length>3&&guard++<vertices.length*vertices.length){
      let cut=false;
      for(let i=0;i<indices.length;i++){
        const a=indices[(i+indices.length-1)%indices.length],b=indices[i],c=indices[(i+1)%indices.length];
        if(turn(vertices[a],vertices[b],vertices[c])*sign<=.001)continue;
        const inside=indices.some(j=>j!==a&&j!==b&&j!==c&&
          turn(vertices[a],vertices[b],vertices[j])*sign>=0&&
          turn(vertices[b],vertices[c],vertices[j])*sign>=0&&
          turn(vertices[c],vertices[a],vertices[j])*sign>=0);
        if(inside)continue;
        result.push([a,b,c]);indices.splice(i,1);cut=true;break;
      }
      if(!cut)break;
    }
    if(indices.length===3)result.push(indices);
    return result;
  }
  function solid(outline,z=0,depth=16,color=stone,side=shade){
    const front=outline.map(([x,y])=>[x,y,z]);
    const back=outline.map(([x,y])=>[x,y,z-depth]);
    for(const tri of triangulate(outline)){
      face(tri.map(i=>front[i]),color);
      face(tri.map(i=>back[i]),side);
    }
    outline.forEach((_,i)=>{const j=(i+1)%outline.length;face([front[i],back[i],back[j],front[j]],side);});
  }
  function facet(points,color=stone){face(points,color);}

  // Wind-blown scarf behind the raised arm; broad planes, folded edges.
  solid([[305,360],[283,373],[254,377],[225,391],[199,399],[183,417],[202,420],[189,433],[199,446],[224,454],[248,445],[277,431],[301,423],[322,389]],-15,14,shade,deep);
  facet([[305,360,-13],[277,394,9],[225,391,-9]],pale);
  facet([[225,391,-9],[277,394,9],[201,417,8],[183,417,-13]],stone);
  facet([[201,417,8],[277,394,9],[249,428,4]],shade);
  facet([[189,433,-12],[201,417,8],[225,432,6],[199,446,-10]],deep);
  facet([[199,446,-10],[249,428,4],[277,431,-8],[224,454,-12]],stone);
  facet([[277,394,9],[322,389,-12],[301,423,-12],[249,428,4]],stone);

  // Far arm reaches outward and downward, with an open hand.
  solid([[352,358],[378,371],[399,382],[423,391],[432,393],[432,404],[446,412],[459,416],[459,420],[447,420],[454,426],[451,429],[439,422],[443,431],[440,433],[431,422],[426,412],[409,411],[385,404],[363,390],[347,378]],2,18,stone,shade);
  facet([[357,364,4],[378,371,4],[409,396,17],[385,394,22]],pale);
  facet([[357,364,4],[385,394,22],[365,390,4],[347,378,4]],shade);
  facet([[385,394,22],[409,396,17],[432,403,9],[423,391,4]],stone);
  facet([[385,394,22],[409,411,4],[426,412,4],[432,403,9]],shade);

  // Main robe: a continuous, solid silhouette under the raised folds.
  solid([[310,348],[331,350],[350,352],[371,373],[370,405],[384,425],[383,446],[379,469],[392,508],[400,553],[401,603],[414,646],[421,688],[436,718],[425,727],[423,749],[412,756],[373,754],[358,744],[333,752],[315,749],[305,735],[289,726],[285,702],[269,699],[255,687],[231,678],[238,655],[254,626],[265,595],[272,560],[281,526],[267,524],[262,510],[266,478],[277,451],[292,422],[290,390],[296,365]],14,38,stone,deep);

  // Long sculpted skirt pleats. Peaks protrude toward the viewer in 3-D.
  facet([[298,467,33],[320,488,49],[298,558,38],[276,600,24],[280,542,18]],pale);
  facet([[276,600,24],[298,558,38],[285,651,35],[257,681,26],[237,675,17]],pale);
  facet([[237,675,17],[257,681,26],[269,699,17],[255,687,17]],shade);
  facet([[298,558,38],[320,488,49],[310,591,48],[289,653,45],[285,651,35]],stone);
  facet([[285,651,35],[289,653,45],[289,699,30],[303,722,28],[289,726,17],[285,702,17],[269,699,17]],shade);
  facet([[320,488,49],[342,479,44],[336,562,39],[317,637,51],[310,591,48]],shade);
  facet([[310,591,48],[317,637,51],[312,720,34],[305,735,18],[303,722,28],[289,699,30],[289,653,45]],stone);
  facet([[342,479,44],[363,478,47],[352,547,63],[336,562,39]],pale);
  facet([[336,562,39],[352,547,63],[346,633,53],[334,719,38],[317,637,51]],stone);
  facet([[317,637,51],[334,719,38],[331,743,27],[315,749,17],[305,735,18],[312,720,34]],pale);
  facet([[363,478,47],[379,469,17],[392,508,17],[385,570,37],[352,547,63]],stone);
  facet([[352,547,63],[385,570,37],[378,647,42],[358,725,34],[346,633,53]],pale);
  facet([[346,633,53],[358,725,34],[358,744,17],[333,752,17],[331,743,27],[334,719,38]],shade);
  facet([[392,508,17],[400,553,17],[401,603,17],[394,665,32],[378,647,42],[385,570,37]],shade);
  facet([[378,647,42],[394,665,32],[395,731,34],[374,750,23],[358,744,17],[358,725,34]],stone);
  facet([[401,603,17],[414,646,17],[421,688,17],[414,712,31],[394,665,32]],pale);
  facet([[394,665,32],[414,712,31],[436,718,17],[425,727,17],[423,749,17],[395,731,34]],shade);
  facet([[395,731,34],[423,749,17],[412,756,17],[374,750,23]],pale);

  // The torso turns toward the open hand; the drape crosses the waist.
  facet([[310,348,17],[320,360,28],[303,392,36],[290,390,17],[296,365,17]],shade);
  facet([[320,360,28],[338,357,27],[328,381,48],[309,391,51],[303,392,36]],pale);
  facet([[338,357,27],[350,352,17],[363,367,30],[353,389,50],[328,381,48]],stone);
  facet([[309,391,51],[328,381,48],[325,405,51],[304,413,34]],stone);
  facet([[328,381,48],[353,389,50],[359,407,33],[325,405,51]],pale);
  facet([[363,367,30],[371,373,17],[370,405,17],[359,407,33],[353,389,50]],shade);
  facet([[303,392,36],[309,391,51],[304,413,34],[292,422,17]],shade);
  facet([[304,413,34],[325,405,51],[348,414,46],[330,439,44],[299,447,28],[292,422,17]],pale);
  facet([[325,405,51],[359,407,33],[372,423,33],[348,414,46]],shade);

  // Three diagonal folds wrap around the waist and separate torso from skirt.
  solid([[377,412],[384,425],[370,441],[327,452],[286,482],[269,499],[275,472],[300,448],[347,432]],47,9,stone,shade);
  facet([[377,412,49],[368,431,63],[314,449,62],[300,448,49],[347,432,49]],pale);
  facet([[368,431,63],[384,425,49],[370,441,49],[327,452,49],[314,449,62]],shade);
  facet([[314,449,62],[327,452,49],[286,482,49],[269,499,49],[294,465,67]],pale);
  solid([[380,440],[370,466],[346,477],[310,491],[275,521],[267,515],[281,493],[320,468],[352,459]],54,9,stone,shade);
  facet([[380,440,56],[362,459,69],[309,485,70],[281,493,56],[320,468,56],[352,459,56]],pale);
  facet([[362,459,69],[370,466,56],[346,477,56],[310,491,56],[309,485,70]],shade);
  facet([[309,485,70],[310,491,56],[275,521,56],[267,515,56]],stone);

  // Raised arm and clenched fist: the gesture leads directly into the blade.
  solid([[310,351],[300,362],[285,346],[271,322],[256,291],[241,262],[231,243],[224,226],[217,220],[211,207],[213,199],[213,186],[217,177],[225,177],[233,186],[235,201],[233,214],[236,231],[249,244],[263,264],[277,290],[292,317]],24,23,stone,shade);
  facet([[310,351,26],[292,340,46],[277,306,46],[292,317,26]],stone);
  facet([[292,340,46],[300,362,26],[285,346,26],[271,322,26],[277,306,46]],shade);
  facet([[277,306,46],[263,278,46],[256,291,26],[271,322,26]],pale);
  facet([[263,278,46],[277,306,46],[292,317,26],[277,290,26],[263,264,26]],stone);
  facet([[263,278,46],[241,249,39],[231,243,26],[241,262,26],[256,291,26]],stone);
  facet([[241,249,39],[263,278,46],[263,264,26],[249,244,26],[236,231,26]],pale);
  facet([[217,177,26],[226,185,42],[225,210,42],[217,220,26],[211,207,26],[213,186,26]],pale);
  facet([[226,185,42],[235,201,26],[233,214,26],[236,231,26],[225,210,42]],shade);
  // Finger ridges read as stone, not individually animated parts.
  for(let i=0;i<3;i++)facet([[213,187+i*8,44],[223,184+i*8,47],[228,189+i*8,45],[216,192+i*8,44]],i%2?stone:pale);

  // Neck, profile and swept hair, cut into a few deliberate planes.
  solid([[326,317],[344,319],[347,340],[356,353],[336,369],[314,354],[321,340]],27,22,stone,shade);
  facet([[329,320,42],[344,319,29],[347,340,29],[336,358,49],[324,352,45]],pale);
  solid([[315,293],[326,280],[344,279],[357,286],[362,296],[361,309],[367,318],[373,327],[368,331],[366,339],[359,345],[348,341],[337,332],[321,324],[312,310]],37,29,stone,shade);
  facet([[344,291,43],[359,295,39],[361,309,39],[355,315,57],[342,310,58]],pale);
  facet([[342,310,58],[355,315,57],[358,331,49],[348,335,43],[337,324,43]],stone);
  facet([[355,315,57],[361,309,39],[367,318,39],[373,327,39],[368,331,39],[358,331,49]],pale);
  facet([[358,331,49],[366,332,41],[366,339,39],[359,345,39],[348,341,39],[348,335,43]],shade);
  facet([[355,311,60],[362,315,53],[356,317,60]],deep);
  // Hair trails back toward the shoulder and the wind-blown scarf.
  solid([[359,289],[345,278],[326,278],[314,283],[314,289],[297,293],[302,299],[289,305],[292,315],[284,318],[289,325],[305,329],[319,323],[325,310],[338,303],[353,304],[359,299]],53,24,shade,deep);
  facet([[359,289,55],[345,284,65],[320,287,66],[326,278,55],[345,278,55]],pale);
  facet([[345,284,65],[353,296,66],[331,294,73],[302,299,55],[314,289,55],[320,287,66]],stone);
  facet([[331,294,73],[325,307,69],[306,312,66],[289,305,55],[302,299,55]],pale);
  facet([[325,307,69],[319,323,55],[305,329,55],[289,325,55],[284,318,55],[306,312,66]],stone);
  facet([[331,294,73],[353,296,66],[359,299,55],[353,304,55],[338,303,55],[325,310,55],[325,307,69]],shade);

  // A long beveled sword, held above the body and angled toward the open sky.
  solid([[223,192],[215,186],[221,166],[230,161],[233,174]],30,10,shade,deep);
  solid([[224,170],[231,159],[315,27],[324,20],[322,32],[239,172]],28,6,stone,deep);
  facet([[224,170,30],[231,159,30],[320,24,33],[233,167,40]],pale);
  facet([[233,167,40],[320,24,33],[322,32,30],[239,172,30]],shade);
  solid([[213,166],[222,158],[239,181],[237,193]],34,7,shade,deep);
  facet([[222,158,36],[226,172,46],[237,193,36],[213,166,36]],stone);

  // Feet and a low architectural plinth echo the opening monument.
  solid([[331,733],[340,739],[350,746],[353,752],[344,756],[319,754],[320,748]],52,12,pale,shade);
  solid([[388,733],[398,738],[411,749],[410,756],[374,756],[374,750]],35,12,stone,shade);
  for(let i=0;i<4;i++)facet([[327+i*5,746,67],[330+i*5,748,68],[331+i*5,754,67],[328+i*5,754,67]],stone);
  solid([[232,758],[432,758],[432,776],[232,776]],30,63,stone,deep);
  facet([[232,758,30],[232,758,-33],[432,758,-33],[432,758,30]],pale);
  solid([[216,777],[448,777],[448,785],[216,785]],42,84,shade,deep);
  facet([[216,777,42],[216,777,-42],[448,777,-42],[448,777,42]],stone);

  let width=0,height=0,dpr=1,frame=0,lastTime=null,elapsed=0,visible=false;
  const rotate=(v,yaw,pitch)=>{
    const x=v[0]*Math.cos(yaw)+v[2]*Math.sin(yaw);
    const z=-v[0]*Math.sin(yaw)+v[2]*Math.cos(yaw);
    return [x,v[1]*Math.cos(pitch)-z*Math.sin(pitch),v[1]*Math.sin(pitch)+z*Math.cos(pitch)];
  };
  function draw(){
    if(!width||!height)return;
    const phase=elapsed/1000;
    const yaw=.12+Math.sin(phase*.24)*.065, pitch=-.045;
    const scale=Math.min(width/410,height/820);
    const light=[-.38+Math.sin(phase*.17)*.06,.42,.82];
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,width,height);
    ctx.fillStyle='rgba(129,142,117,.14)';
    ctx.beginPath();ctx.ellipse(width*.5,height*.975,scale*151,scale*10,0,0,Math.PI*2);ctx.fill();
    const project=v=>[width*.5+v[0]*scale,height*.5-v[1]*scale];
    const sorted=faces.map(f=>{
      const vertices=f.vertices.map(v=>rotate(v,yaw,pitch));
      const n=rotate(f.normal,yaw,pitch);
      const shadeAmount=.84+Math.max(0,n.reduce((s,v,i)=>s+v*light[i],0))*.16;
      return {vertices,depth:vertices.reduce((s,v)=>s+v[2],0)/vertices.length,
        color:`rgb(${f.color.map(c=>Math.round(c*shadeAmount)).join(',')})`};
    }).sort((a,b)=>a.depth-b.depth);
    for(const f of sorted){
      ctx.beginPath();
      f.vertices.forEach((v,i)=>{const p=project(v);i?ctx.lineTo(...p):ctx.moveTo(...p);});
      ctx.closePath();ctx.fillStyle=f.color;ctx.fill();
      // Subpixel seams between touching facets should not look like wireframe.
      ctx.strokeStyle=f.color;ctx.lineWidth=.35;ctx.stroke();
    }
    canvas.dataset.ready='true';
  }
  function resize(){
    const box=canvas.getBoundingClientRect();
    width=box.width;height=box.height;dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);draw();
  }
  function tick(now){
    if(lastTime!==null)elapsed+=Math.min(now-lastTime,100);
    lastTime=now;draw();frame=requestAnimationFrame(tick);
  }
  function sync(){
    const running=visible&&!document.hidden&&document.documentElement.dataset.motion==='on';
    if(running&&!frame){lastTime=null;frame=requestAnimationFrame(tick);}
    if(!running&&frame){cancelAnimationFrame(frame);frame=0;lastTime=null;}
    canvas.dataset.animating=String(running);
  }
  canvas.dataset.faces=String(faces.length);
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();}).observe(canvas);
  document.addEventListener('aesthetics:motion',sync);
  document.addEventListener('visibilitychange',sync);
  resize();sync();
})();
