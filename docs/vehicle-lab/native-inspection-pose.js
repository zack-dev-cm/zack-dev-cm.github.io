// Exact-source diagnostic rigid poses. No geometry, mesh scaling or physics.
const I=()=>[[1,0,0],[0,1,0],[0,0,1]],rad=x=>x*Math.PI/180,deg=x=>x*180/Math.PI;
const add=(a,b)=>a.map((x,i)=>x+b[i]),sub=(a,b)=>a.map((x,i)=>x-b[i]);
const mul=(a,k)=>a.map(x=>x*k),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),norm=a=>Math.hypot(...a);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const unit=a=>mul(a,1/norm(a)),mv=(R,p)=>R.map(r=>dot(r,p));
const mm=(a,b)=>a.map(r=>[0,1,2].map(j=>dot(r,b.map(v=>v[j]))));
function axisRotation(axis,angle){const [x,y,z]=unit(axis),c=Math.cos(angle),s=Math.sin(angle),t=1-c;return [[t*x*x+c,t*x*y-s*z,t*x*z+s*y],[t*x*y+s*z,t*y*y+c,t*y*z-s*x],[t*x*z-s*y,t*y*z+s*x,t*z*z+c]];}
function xyz(r,p,y){return mm(mm(axisRotation([0,0,1],y),axisRotation([0,1,0],p)),axisRotation([1,0,0],r));}
const transform=(R=I(),t=[0,0,0])=>({R,t}),point=(M,p)=>add(mv(M.R,p),M.t);
const compose=(a,b)=>transform(mm(a.R,b.R),add(mv(a.R,b.t),a.t));
const around=(origin,axis,angle)=>{const R=axisRotation(axis,angle);return transform(R,sub(origin,mv(R,origin)));};
function matrix(M){const R=M.R,t=M.t;return [R[0][0],R[1][0],R[2][0],0,R[0][1],R[1][1],R[2][1],0,R[0][2],R[1][2],R[2][2],0,...t,1];}
function segment(a,b,c,d){
  const u=unit(sub(b,a)),v=unit(sub(d,c)),axis=cross(u,v),s=norm(axis),co=Math.max(-1,Math.min(1,dot(u,v)));
  if(Math.abs(norm(sub(b,a))-norm(sub(d,c)))>1e-5)throw Error('Rigid segment endpoint length does not close');
  let R=I();if(s>1e-12)R=axisRotation(axis,Math.atan2(s,co));else if(co<0)R=axisRotation(cross(u,Math.abs(u[0])<.8?[1,0,0]:[0,1,0]),Math.PI);
  return transform(R,sub(c,mv(R,a)));
}
function linear(A,b){
  A=A.map((r,i)=>[...r,b[i]]);const n=b.length;
  for(let i=0;i<n;i++){
    let k=i;for(let j=i+1;j<n;j++)if(Math.abs(A[j][i])>Math.abs(A[k][i]))k=j;
    if(Math.abs(A[k][i])<1e-11)throw Error('Inspection rear constraint Jacobian singular');
    [A[k],A[i]]=[A[i],A[k]];const div=A[i][i];for(let j=i;j<=n;j++)A[i][j]/=div;
    for(let r=0;r<n;r++)if(r!==i){const f=A[r][i];for(let j=i;j<=n;j++)A[r][j]-=f*A[i][j];}
  }return A.map(r=>r[n]);
}
function solveRear(c,h,roll){
  const a=c.rear_chassis_points_mm,b=c.rear_carrier_points_mm,L=a.map((p,i)=>norm(sub(p,b[i]))),rr=rad(roll);
  const residual=q=>{const R=xyz(rr,q[2],q[3]),t=[300*q[0],300*q[1],h];return b.map((p,i)=>(norm(sub(add(mv(R,p),t),a[i]))-L[i])/300);};
  let q=[(380-Math.sqrt(380**2-h**2))/300,0,0,0],iterations=0;
  for(;iterations<35;iterations++){
    const f=residual(q);if(Math.max(...f.map(Math.abs))*300<1e-8)break;
    const e=1e-6,J=Array.from({length:4},()=>Array(4));
    for(let k=0;k<4;k++){const qa=[...q],qb=[...q];qa[k]+=e;qb[k]-=e;const fa=residual(qa),fb=residual(qb);for(let i=0;i<4;i++)J[i][k]=(fa[i]-fb[i])/(2*e);}
    const step=linear(J,f.map(x=>-x));let accepted=false;
    for(let scale=1;scale>=1/128;scale/=2){const nq=q.map((x,i)=>x+scale*step[i]);if(norm(residual(nq))<norm(f)){q=nq;accepted=true;break;}}
    if(!accepted)throw Error('Rear inspection solver could not improve closure');
  }
  const error=Math.max(...residual(q).map(Math.abs))*300;if(error>1e-6)throw Error('Rear inspection closure failed');
  const M=transform(xyz(rr,q[2],q[3]),[300*q[0],300*q[1],h]);
  const wheels=[point(M,[0,300,0]),point(M,[0,-300,0])];
  if(wheels.some(p=>p[2]<c.inspection_input_bounds.per_rear_wheel_heave_mm[0]-1e-6||p[2]>c.inspection_input_bounds.per_rear_wheel_heave_mm[1]+1e-6))throw Error('Combined rear heave/roll exceeds individual inspection wheel range');
  return {M,points:b.map(p=>point(M,p)),wheels,error,iterations,eulerXYZDeg:[roll,deg(q[2]),deg(q[3])]};
}
// Invert wheel heights through the actual four-distance closure. Equal
// heights are axle heave; unequal heights require carrier roll and joints
// that accommodate it. This does not introduce independent rear arms.
export function rearPoseFromWheelHeights(contract,left,right){
  const bounds=contract.inspection_input_bounds.per_rear_wheel_heave_mm;
  if(![left,right].every(x=>Number.isFinite(x)&&x>=bounds[0]&&x<=bounds[1]))throw Error('Rear wheel input outside inspection bounds');
  const h=(left+right)/2,target=left-right;
  if(Math.abs(target)<1e-10)return {heaveRear:h,rearRoll:0};
  // Allow intermediate bracketing poses to exceed a wheel bound; only the
  // requested converged pose is evaluated against the real contract.
  const wide={...contract,inspection_input_bounds:{...contract.inspection_input_bounds,per_rear_wheel_heave_mm:[-1000,1000]}};
  const residual=roll=>{const r=solveRear(wide,h,roll);return r.wheels[0][2]-r.wheels[1][2]-target;};
  let [lo,hi]=contract.inspection_input_bounds.rear_roll_deg;
  if(residual(lo)>0||residual(hi)<0)throw Error('Requested left/right split needs roll outside inspection domain');
  for(let n=0;n<45;n++){const m=(lo+hi)/2;if(residual(m)>0)hi=m;else lo=m;}
  const rearRoll=(lo+hi)/2;
  solveRear(contract,h,rearRoll);
  return {heaveRear:h,rearRoll};
}
function solveFront(c,h,steer,side){
  const f=c.front_cfg,v=c.front_variant,base=[0,...f.lower_inner_yz_mm],axis=unit(v.upright_axis_mm),psi=rad(steer);
  const tilt=rad(f.column_tilt_deg),cb=[v.column_base_x_mm,0,-v.column_reach_mm*Math.tan(tilt)];
  const ca=[-Math.sin(tilt),0,Math.cos(tilt)],mirror=p=>[p[0],side*p[1],p[2]];
  const cp0=add(cb,[v.column_reach_mm,side*v.column_pickup_half_width_mm,v.column_reach_mm*Math.tan(tilt)]);
  const cp=add(cb,mv(axisRotation(ca,psi),sub(cp0,cb))),drive=v.relay_input_offset_mm;
  const length=norm(sub(mirror(add(base,drive)),cp0));
  const residual=d=>norm(sub(mirror(add(base,mv(axisRotation(axis,d),drive))),cp))-length;
  let delta=0;
  if(Math.abs(steer)>1e-12){
    const roots=[];let lo=-1.2,fl=residual(lo);
    for(let k=1;k<=120;k++){
      const hi=-1.2+k*.02,fh=residual(hi);if(Math.abs(fl)<1e-10)roots.push(lo);
      if(fl*fh<0){let a=lo,b=hi,fa=fl;for(let n=0;n<55;n++){const m=(a+b)/2,fm=residual(m);if(fa*fm<=0)b=m;else{a=m;fa=fm;}}roots.push((a+b)/2);}
      lo=hi;fl=fh;
    }
    if(!roots.length)throw Error('No front steering relay closure in inspection domain');
    delta=roots.reduce((a,b)=>Math.abs(a+side*psi)<Math.abs(b+side*psi)?a:b);
  }
  const R=axisRotation(axis,delta),offset=mv(R,f.wheel_offset_from_lower_joint_mm);
  const sine=(h-base[2]-offset[2])/v.lower_arm_radius_mm;if(Math.abs(sine)>1)throw Error('Front requested heave outside exact arm geometry');
  const theta=Math.asin(sine),lower=add(base,[0,v.lower_arm_radius_mm*Math.cos(theta),v.lower_arm_radius_mm*Math.sin(theta)]);
  const upper=add(lower,v.upright_axis_mm),tieOuter=add(lower,mv(R,f.outer_tie_offset_mm));
  const inner=add(base,mv(R,f.outer_tie_offset_mm)),relay=add(base,mv(R,drive)),wheel=add(lower,offset);
  const global=p=>add(mirror(p),[c.wheelbase_mm,0,0]),points={lower:global(lower),upper:global(upper),tie_outer:global(tieOuter),tie_inner:global(inner),relay_input:global(relay),column_pickup:add(cp,[c.wheelbase_mm,0,0]),relay_base:global(base)};
  for(const [sign,tag]of[[-1,'rear'],[1,'front']]){
    points['lower_'+tag]=[c.wheelbase_mm+sign*f.lower_inner_half_span_x_mm,side*base[1],base[2]];
    points['upper_'+tag]=[c.wheelbase_mm+v.upright_axis_mm[0]+sign*f.upper_inner_half_span_x_mm,side*v.upper_inner_yz_mm[0],v.upper_inner_yz_mm[1]];
  }
  const gr=R.map((r,i)=>r.map((x,j)=>x*(i===1?side:1)*(j===1?side:1)));
  const errors=[Math.abs(wheel[2]-h),Math.abs(norm(sub(points.tie_outer,points.tie_inner))-v.lower_arm_radius_mm),Math.abs(residual(delta))];
  for(const tag of ['rear','front']){
    errors.push(Math.abs(norm(sub(points.lower,points['lower_'+tag]))-Math.hypot(v.lower_arm_radius_mm,f.lower_inner_half_span_x_mm)));
    errors.push(Math.abs(norm(sub(points.upper,points['upper_'+tag]))-Math.hypot(v.upper_arm_radius_mm,f.upper_inner_half_span_x_mm)));
  }
  if(Math.max(...errors)>1e-6)throw Error('Front inspection constraint closure failed');
  return {R:gr,points,wheel:global(wheel),theta,delta,error:Math.max(...errors),side};
}

export function createNativeInspectionPose({modelKey,manifest,parts},contract){
  if(modelKey!=='ridge_r4')return {available:false,reason:'This model has no exact-source complete suspension adapter; body/wheel-only studies cannot show a fabricated mechanism.'};
  if(!manifest||manifest.source_native_sha256!==contract.native_sha256||contract.model_key!==modelKey||manifest.part_count!==contract.part_count)throw Error('Inspection pose native revision mismatch');
  const ids=parts.map(p=>p.id),expected=contract.parts.map(p=>p.part_id);
  if(ids.length!==expected.length||new Set(ids).size!==ids.length||expected.some(id=>!ids.includes(id)))throw Error('Inspection pose PartID inventory mismatch');
  if(contract.automatic_geometry_exclusions!==false||contract.physics_simulation!==false)throw Error('Unexpected inspection contract scope');
  // Preserve the recorded contract; its later rear-shock scope supersedes
  // the older blanket statement that all shock components remain fixed.
  const warnings=contract.nonphysical_limits.map(w=>
    w==='Spring/shock telescoping and flexible wires stay at native pose; do not hide or deform them.'&&contract.rear_shock_pose_scope
      ? contract.rear_shock_pose_scope+' Flexible wires remain at native pose.' : w);
  let cached=null,cacheKey='';
  function evaluate(input={}){
    const p={heaveL:0,heaveR:0,heaveRear:0,rearRoll:0,steer:0,wheelSpin:0,...input};
    for(const k of ['heaveL','heaveR','heaveRear','rearRoll','steer','wheelSpin'])if(!Number.isFinite(p[k]))throw Error('Nonfinite inspection input '+k);
    const bounds=contract.inspection_input_bounds;
    for(const [key,b]of[['heaveL',bounds.front_heave_mm],['heaveR',bounds.front_heave_mm],['heaveRear',bounds.rear_heave_mm],['rearRoll',bounds.rear_roll_deg],['steer',bounds.steer_deg]])if(p[key]<b[0]||p[key]>b[1])throw Error('Inspection input outside bounded domain: '+key);
    const serial=JSON.stringify(p);if(serial===cacheKey)return cached;
    const rear=solveRear(contract,p.heaveRear,p.rearRoll),front={1:solveFront(contract,p.heaveL,p.steer,1),'-1':solveFront(contract,p.heaveR,p.steer,-1)};
    const matrices={},held=[],twist=[],internal=[];const wb=[contract.wheelbase_mm,0,0];
    const shocks=[1,-1].map(side=>{
      const index=side===1?0:1,top=[285,side*185,157.5],initialLower=[285,side*185,-40];
      // The source mounts the shock one quarter along the LOWER LINK from
      // its fixed chassis end. It is not a point fixed to the axle carrier.
      const a=contract.rear_chassis_points_mm[index],b=contract.rear_carrier_points_mm[index];
      const lower=add(a,mul(sub(rear.points[index],a),.25)),length=norm(sub(lower,top));
      const direction=unit(sub(lower,top)),initialLength=norm(sub(initialLower,top));
      const body=segment(top,initialLower,top,add(top,mul(direction,initialLength)));
      const rod=transform(body.R,sub(lower,mv(body.R,initialLower)));
      const carrierAxis=mv(segment(a,b,a,rear.points[index]).R,[0,1,0]);
      return {side,top,lower,lengthMm:length,body,rod,
        eyeAxisMismatchDeg:deg(Math.acos(Math.min(1,Math.abs(dot(carrierAxis,[0,1,0]))))),
        supplierLengthLimitsVerified:false};
    });
    for(const d of contract.parts){
      let M=transform(),f=d.side?front[d.side]:d.data?.side?front[d.data.side]:null;
      if(d.kind==='rear_carrier'){M=rear.M;if(d.status.includes('INTERNAL_ROTATION_UNSOLVED'))internal.push(d.part_id);}
      else if(d.kind==='rear_link'){M=segment(contract.rear_chassis_points_mm[d.index],contract.rear_carrier_points_mm[d.index],contract.rear_chassis_points_mm[d.index],rear.points[d.index]);twist.push(d.part_id);}
      else if(d.kind==='column'||d.kind==='front_column')M=around(contract.column_base_mm,contract.column_axis,rad(p.steer));
      else if(d.kind==='front_arm'){
        const inner=d.level==='lower'?[contract.wheelbase_mm,d.side*contract.front_cfg.lower_inner_yz_mm[0],contract.front_cfg.lower_inner_yz_mm[1]]:[contract.wheelbase_mm+contract.front_variant.upright_axis_mm[0],d.side*contract.front_variant.upper_inner_yz_mm[0],contract.front_variant.upper_inner_yz_mm[1]];
        M=around(inner,[1,0,0],d.side*f.theta);
      }else if(d.kind==='front_upright')M=transform(f.R,sub(f.points.lower,mv(f.R,add(d.data.initial_origin,wb))));
      else if(d.kind==='front_relay')M=transform(f.R,sub(f.points.relay_base,mv(f.R,f.points.relay_base)));
      else if(d.kind==='front_segment'){M=segment(add(d.data.initial_a,wb),add(d.data.initial_b,wb),f.points[d.data.a],f.points[d.data.b]);twist.push(d.part_id);}
      else if(d.kind==='wheel'){
        const centre=[d.axle==='front'?contract.wheelbase_mm:0,d.side*contract.track_mm/2,0];
        const support=d.axle==='rear'?rear.M:transform(f.R,sub(f.wheel,mv(f.R,centre)));
        M=compose(support,around(centre,[0,1,0],rad(p.wheelSpin)));
      }else if(d.kind==='rear_shock_body')M=shocks.find(s=>s.side===d.side).body;
      else if(d.kind==='rear_shock_rod')M=shocks.find(s=>s.side===d.side).rod;
      else if(d.kind==='unresolved_fixed')held.push(d.part_id);
      const m=matrix(M);if(!m.every(Number.isFinite))throw Error('Nonfinite rigid matrix '+d.part_id);matrices[d.part_id]=m;
    }
    const unresolved=[...new Set([...held,...twist,...internal])];
    cached={available:true,revision:contract.revision,nativeSha256:contract.native_sha256,pose:p,matrices,excludedPartIDs:[],heldAtNativePosePartIDs:held,axialTwistConventionPartIDs:twist,internalRotationUnsolvedPartIDs:internal,unresolvedPartIDs:unresolved,
      warnings,metrics:{rearConstraintErrorMm:rear.error,frontConstraintErrorMm:Math.max(front[1].error,front[-1].error),rearEulerXYZDeg:rear.eulerXYZDeg,rearWheelCentresMm:rear.wheels,frontWheelCentresMm:[front[1].wheel,front[-1].wheel],frontDeltaDeg:[deg(front[1].delta),deg(front[-1].delta)],rearShocks:shocks.map(({body,rod,...s})=>s),allNativePartsRetained:Object.keys(matrices).length===contract.part_count,rigidMatricesOnly:true},physicsSimulation:false,stagePass:false};
    cacheKey=serial;return cached;
  }
  return {available:true,contract,evaluate};
}
