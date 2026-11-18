import bpy,time
bpy.ops.wm.read_factory_settings(use_empty=True)
sc=bpy.context.scene;sc.render.engine='CYCLES';sc.cycles.device='CPU';sc.cycles.samples=48;sc.cycles.use_denoising=True
try: sc.cycles.denoiser='OPENIMAGEDENOISE'
except Exception as e: print('denoiser',e)
sc.render.resolution_x=1080;sc.render.resolution_y=1920;sc.render.filepath='/tmp/claude-0/-home-claude/8bcf18bf-fc54-55e3-8e39-21fdff62776b/scratchpad/speed.png'
bpy.ops.mesh.primitive_plane_add(size=10);bpy.ops.mesh.primitive_uv_sphere_add(radius=1,location=(0,0,1));bpy.ops.object.shade_smooth()
m=bpy.data.materials.new('m');m.use_nodes=True;b=m.node_tree.nodes['Principled BSDF'];b.inputs['Base Color'].default_value=(0.95,0.8,0.4,1);b.inputs['Subsurface Weight'].default_value=0.5;bpy.context.object.data.materials.append(m)
bpy.ops.object.light_add(type='AREA',location=(3,-3,5));bpy.context.object.data.energy=800;bpy.context.object.data.size=3
bpy.ops.object.camera_add(location=(0,-7,2.5),rotation=(1.3,0,0));sc.camera=bpy.context.object
w=bpy.data.worlds.new('w');sc.world=w;w.use_nodes=True;w.node_tree.nodes['Background'].inputs[0].default_value=(0.4,0.35,0.3,1)
t=time.time();bpy.ops.render.render(write_still=True);print('seconds per frame',round(time.time()-t,1))
